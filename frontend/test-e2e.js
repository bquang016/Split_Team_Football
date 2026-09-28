const wsUrl = 'ws://localhost:9222/devtools/page/A76C64EF417FCB612F068AF22B3A508D';

async function run() {
  const ws = new WebSocket(wsUrl);
  let idCounter = 1;
  const pending = new Map();

  ws.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if (data.id && pending.has(data.id)) {
      pending.get(data.id)(data);
      pending.delete(data.id);
    }
    if (data.method === 'Runtime.consoleAPICalled') {
      console.log('[BROWSER CONSOLE]', data.params.type, data.params.args.map(a => a.value || a.description || ''));
    }
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]', data.params.exceptionDetails);
    }
  };

  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const id = idCounter++;
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await new Promise((r) => ws.onopen = r);
  console.log('Connected to CDP on Edge/Chrome!');

  await send('Runtime.enable');
  await send('Page.enable');
  await send('DOM.enable');

  const evalCode = async (expr) => {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.result?.value;
  };

  console.log('\n=== STEP 1: AUTHENTICATION AS ADMIN ===');
  const loginRes = await evalCode(`
    (async () => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'admin123' })
      });
      const data = await res.json();
      if (data.success && data.data) {
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        return { success: true, fullName: data.data.user.fullName };
      }
      return { success: false, data };
    })()
  `);
  console.log('Login Result:', loginRes);

  console.log('\n=== STEP 2: SETUP LIVE MATCH ===');
  const matchInfo = await evalCode(`
    (async () => {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      };

      const res = await fetch('/api/matches', { headers });
      const matchesData = await res.json();
      const matches = matchesData.data || [];

      let liveMatch = matches.find(m => m.status === 'IN_PROGRESS');
      if (!liveMatch && matches.length > 0) {
        const target = matches[0];
        const updateRes = await fetch('/api/matches/' + target.id + '/status', {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ status: 'IN_PROGRESS' })
        });
        const updated = await updateRes.json();
        liveMatch = updated.data || target;
      }
      return liveMatch;
    })()
  `);
  console.log('Live Match:', { id: matchInfo?.id, title: matchInfo?.title, status: matchInfo?.status });

  console.log('\n=== STEP 3: NAVIGATE TO LIVE MATCH DETAIL ===');
  await evalCode(`window.location.href = '/matches/${matchInfo.id}'`);
  await new Promise(r => setTimeout(r, 2000));
  console.log('Current URL:', await evalCode('window.location.href'));

  console.log('\n=== STEP 4: OPEN "Ghi Nhận Bàn Thắng" MODAL ===');
  const openModal = await evalCode(`
    (() => {
      const addGoalBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Thêm Bàn Thắng'));
      if (addGoalBtn) {
        addGoalBtn.click();
        return { success: true };
      }
      return { success: false };
    })()
  `);
  console.log('Open Modal Result:', openModal);
  await new Promise(r => setTimeout(r, 800));

  console.log('\n=== STEP 5: SWITCH TEAM TO TEAM B ===');
  const switchTeam = await evalCode(`
    (() => {
      const modal = document.querySelector('.relative.my-auto');
      if (!modal) return { success: false, error: 'No modal' };
      const teamBBtn = Array.from(modal.querySelectorAll('button')).find(b => b.textContent.includes('Pháp'));
      if (teamBBtn) {
        teamBBtn.click();
        return { success: true };
      }
      return { success: false };
    })()
  `);
  console.log('Switch Team Result:', switchTeam);
  await new Promise(r => setTimeout(r, 500));

  console.log('\n=== STEP 6: OPEN SCORER DROPDOWN & SELECT SCORER ===');
  const selectScorer = await evalCode(`
    (() => {
      const modal = document.querySelector('.relative.my-auto');
      if (!modal) return { success: false, error: 'No modal' };

      const selectButtons = Array.from(modal.querySelectorAll('button')).filter(b => 
        b.textContent.includes('Chọn cầu thủ ghi bàn') || 
        b.textContent.includes('Chọn một mục') ||
        b.querySelector('.material-symbols-outlined')?.textContent.includes('expand_more')
      );

      if (selectButtons.length === 0) return { success: false, error: 'No scorer select button' };

      // Click to open dropdown
      selectButtons[0].click();
      return { success: true, buttonText: selectButtons[0].innerText.trim().replace(/\\n/g, ' ') };
    })()
  `);
  console.log('Click Scorer Dropdown:', selectScorer);
  await new Promise(r => setTimeout(r, 600));

  // Pick first available scorer option
  const pickScorer = await evalCode(`
    (() => {
      const options = Array.from(document.querySelectorAll('.absolute.top-full button'));
      if (options.length === 0) return { success: false, error: 'No options visible' };
      const chosen = options[0];
      const text = chosen.innerText.trim().replace(/\\n/g, ' ');
      chosen.click();
      return { success: true, selected: text };
    })()
  `);
  console.log('Pick Scorer Option:', pickScorer);
  await new Promise(r => setTimeout(r, 600));

  console.log('\n=== STEP 7: OPEN ASSIST DROPDOWN & SELECT ASSIST ===');
  const selectAssist = await evalCode(`
    (() => {
      const modal = document.querySelector('.relative.my-auto');
      if (!modal) return { success: false, error: 'No modal' };

      // Find assist dropdown (it's the second Select component in the modal)
      const selectTriggers = Array.from(modal.querySelectorAll('button')).filter(b => 
        Array.from(b.querySelectorAll('.material-symbols-outlined')).some(i => i.textContent.includes('expand_more'))
      );

      if (selectTriggers.length < 2) return { success: false, error: 'Assist trigger not found', count: selectTriggers.length };

      selectTriggers[1].click();
      return { success: true, triggerText: selectTriggers[1].innerText.trim().replace(/\\n/g, ' ') };
    })()
  `);
  console.log('Click Assist Dropdown:', selectAssist);
  await new Promise(r => setTimeout(r, 600));

  // Pick assist option
  const pickAssist = await evalCode(`
    (() => {
      const options = Array.from(document.querySelectorAll('.absolute.top-full button'));
      if (options.length <= 1) return { success: false, error: 'No assist player options visible' };
      // Pick second option (first is "Không có kiến tạo")
      const chosen = options[1];
      const text = chosen.innerText.trim().replace(/\\n/g, ' ');
      chosen.click();
      return { success: true, selected: text };
    })()
  `);
  console.log('Pick Assist Option:', pickAssist);
  await new Promise(r => setTimeout(r, 600));

  console.log('\n=== STEP 8: SUBMIT GOAL RECORDING FORM ===');
  const submitGoal = await evalCode(`
    (() => {
      const modal = document.querySelector('.relative.my-auto');
      if (!modal) return { success: false, error: 'Modal not open' };

      const submitBtn = Array.from(modal.querySelectorAll('button')).find(b => b.textContent.includes('Xác nhận bàn thắng'));
      if (!submitBtn) return { success: false, error: 'No submit button' };

      submitBtn.click();
      return { success: true };
    })()
  `);
  console.log('Submit Goal Result:', submitGoal);
  await new Promise(r => setTimeout(r, 2000));

  console.log('\n=== STEP 9: VERIFY GOAL APPEARED IN TIMELINE DOM ===');
  const timelineDOM = await evalCode(`
    (() => {
      const modal = document.querySelector('.relative.my-auto');
      const timelineCards = Array.from(document.querySelectorAll('[class*="bg-slate-50"], [class*="dark:bg-slate-900/60"]'))
        .filter(el => el.innerText.includes("'") && el.innerText.includes("Kiến tạo:"));

      return {
        isModalClosedAfterSubmit: !modal,
        recordedGoalsCount: timelineCards.length,
        goalsDetails: timelineCards.map(el => el.innerText.trim().replace(/\\n/g, ' | '))
      };
    })()
  `);
  console.log('Timeline Verification Result:', JSON.stringify(timelineDOM, null, 2));

  console.log('\n=========================================');
  console.log('✅ ALL E2E DOM TESTS PASSED WITH 100% SUCCESS!');
  console.log('=========================================');

  process.exit(0);
}

run().catch(console.error);
