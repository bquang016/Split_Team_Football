import { create } from 'zustand';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface WebSocketState {
  client: Client | null;
  isConnected: boolean;
  connect: (token?: string) => void;
  disconnect: () => void;
  subscribe: (topic: string, callback: (message: any) => void) => () => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  client: null,
  isConnected: false,

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
      },
      onDisconnect: () => {
        set({ isConnected: false });
      },
      onStompError: () => {
        set({ isConnected: false });
      },
      onWebSocketClose: () => {
        set({ isConnected: false });
      },
    });

    client.activate();
    set({ client });
  },

  disconnect: () => {
    const client = get().client;
    if (client) {
      client.deactivate();
      set({ client: null, isConnected: false });
    }
  },

  subscribe: (topic: string, callback: (message: any) => void) => {
    const client = get().client;
    if (!client || !get().isConnected) {
      // If not yet connected, retry after short delay
      const timer = setTimeout(() => {
        const c = get().client;
        if (c && get().isConnected) {
          c.subscribe(topic, (msg: IMessage) => {
            try {
              const body = JSON.parse(msg.body);
              callback(body);
            } catch {
              callback(msg.body);
            }
          });
        }
      }, 1000);
      return () => clearTimeout(timer);
    }

    const sub: StompSubscription = client.subscribe(topic, (msg: IMessage) => {
      try {
        const body = JSON.parse(msg.body);
        callback(body);
      } catch {
        callback(msg.body);
      }
    });

    return () => {
      try {
        sub.unsubscribe();
      } catch {}
    };
  },
}));
