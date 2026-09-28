import { create } from 'zustand';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let subIdCounter = 0;

interface SubEntry {
  topic: string;
  callback: (message: any) => void;
}

interface WebSocketState {
  client: Client | null;
  isConnected: boolean;
  registeredSubs: Map<number, SubEntry>;
  stompSubs: Map<number, StompSubscription>;
  connect: (token?: string) => void;
  disconnect: () => void;
  subscribe: (topic: string, callback: (message: any) => void) => () => void;
}

function createStompSub(
  client: Client,
  topic: string,
  callback: (msg: any) => void
): StompSubscription {
  return client.subscribe(topic, (msg: IMessage) => {
    try {
      const body = JSON.parse(msg.body);
      callback(body);
    } catch {
      callback(msg.body);
    }
  });
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  client: null,
  isConnected: false,
  registeredSubs: new Map(),
  stompSubs: new Map(),

  connect: (token?: string) => {
    if (get().client && get().isConnected) return;

    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:8081/ws';

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: () => {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        set({ isConnected: true });
        // Re-subscribe all registered subscriptions on (re)connect
        const { registeredSubs } = get();
        const newStompSubs = new Map<number, StompSubscription>();
        const c = get().client;
        if (c) {
          registeredSubs.forEach((entry, id) => {
            const stompSub = createStompSub(c, entry.topic, entry.callback);
            newStompSubs.set(id, stompSub);
          });
        }
        set({ stompSubs: newStompSubs });
      },
      onDisconnect: () => {
        // Clear STOMP subs but keep registeredSubs for re-subscription on reconnect
        set({ isConnected: false, stompSubs: new Map() });
      },
      onStompError: () => {
        set({ isConnected: false });
      },
      onWebSocketClose: () => {
        // Clear STOMP subs but keep registeredSubs for re-subscription on reconnect
        set({ isConnected: false, stompSubs: new Map() });
      },
    });

    client.activate();
    set({ client });
  },

  disconnect: () => {
    const client = get().client;
    if (client) {
      client.deactivate();
      set({ client: null, isConnected: false, registeredSubs: new Map(), stompSubs: new Map() });
    }
  },

  subscribe: (topic: string, callback: (message: any) => void) => {
    const id = ++subIdCounter;
    const { registeredSubs, stompSubs } = get();

    // Register the subscription (persisted across reconnects)
    const newRegistered = new Map(registeredSubs);
    newRegistered.set(id, { topic, callback });
    set({ registeredSubs: newRegistered });

    // If already connected, create the STOMP subscription immediately
    const client = get().client;
    if (client && get().isConnected) {
      const stompSub = createStompSub(client, topic, callback);
      const newStomp = new Map(stompSubs);
      newStomp.set(id, stompSub);
      set({ stompSubs: newStomp });
    }

    // Return cleanup function
    return () => {
      const { registeredSubs: currentReg, stompSubs: currentStomp } = get();

      // Unsubscribe from STOMP if active
      const sub = currentStomp.get(id);
      if (sub) {
        try {
          sub.unsubscribe();
        } catch {
          /* connection may already be closed */
        }
      }

      // Remove from both tracking maps
      const updatedReg = new Map(currentReg);
      updatedReg.delete(id);
      const updatedStomp = new Map(currentStomp);
      updatedStomp.delete(id);
      set({ registeredSubs: updatedReg, stompSubs: updatedStomp });
    };
  },
}));
