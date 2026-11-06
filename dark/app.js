const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', '打开菜单'); mobileMenu.hidden = true; }
menuButton.addEventListener('click', () => { const expanded = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!expanded)); menuButton.setAttribute('aria-label', expanded ? '打开菜单' : '关闭菜单'); mobileMenu.hidden = expanded; });
mobileMenu.querySelectorAll('a, button').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

// One continuous logo band. The duplicate is visual only.
const logoGroup = document.querySelector('.logo-group');
const logoDuplicate = logoGroup.cloneNode(true);
logoDuplicate.setAttribute('aria-hidden', 'true');
logoDuplicate.querySelectorAll('img').forEach(img => { img.alt = ''; img.loading = 'lazy'; });
document.querySelector('#logo-track').append(logoDuplicate);
const pauseButton = document.querySelector('.marquee-control');
pauseButton.addEventListener('click', () => {
  const paused = document.querySelector('.ecosystem').classList.toggle('is-paused');
  pauseButton.setAttribute('aria-pressed', String(paused));
  pauseButton.setAttribute('aria-label', paused ? '继续图标滚动' : '暂停图标滚动');
});

// Progressive enhancement: all content remains visible without JavaScript.
if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

function bindTabs(buttons, select) {
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); select(buttons[next]); buttons[next].focus(); }
    });
  });
}
const screens = {
  knowledge: { src: '../assets/knowledge-library.png', title: 'SIREN / 客户资料库', description: '让文档、表格、图片与扫描件，成为可检索、可调用的依据。', alt: 'SIREN 客户资料库实际界面，包含资料搜索、上传和状态管理' },
  publishing: { src: '../assets/publishing-workspace.png', title: 'SIREN / 多平台运营', description: '统一管理平台账号，连接内容审核、发布执行与结果核验。', alt: 'SIREN 多平台账号管理实际界面，展示小红书、知乎、头条、网易与搜狐账号状态' }
};
const productButtons = [...document.querySelectorAll('[data-screen]')];
function selectScreen(button) {
  productButtons.forEach(item => { item.setAttribute('aria-selected', String(item === button)); item.tabIndex = item === button ? 0 : -1; });
  const screen = screens[button.dataset.screen];
  const image = document.querySelector('#product-screen');
  image.src = screen.src; image.alt = screen.alt;
  document.querySelector('#screen-name').textContent = screen.title;
  document.querySelector('#screen-description').textContent = screen.description;
  document.querySelector('#product-panel').setAttribute('aria-labelledby', button.id);
}
bindTabs(productButtons, selectScreen);

const workflows = {
  growth: [['发现真实问题', '建立客户问题与品牌诊断基线，识别知识、内容与公开信源的缺口。'], ['形成有据内容', '从品牌资料与专业知识中检索依据，组织文章、专题与 FAQ，并经人工审核。'], ['连接官网与平台', '完善官网信息结构与多模态内容，按平台要求适配、发布并核验结果。'], ['持续观察与迭代', '保存回答、引用与推荐快照，结合执行记录形成下一阶段策略。']],
  casework: [['接案与案情梳理', '整理访谈与案件材料，抽取事实、主体、时间线与争议焦点。'], ['检索与证据组织', '连接法律法规、类案与律所知识，组织证据目录并定位来源。'], ['文书辅助与审核', '支持起草、审阅、比对与版本管理，关键输出由专业人员审核。'], ['协同与知识沉淀', '通过任务、权限与操作留痕组织协作，将案件经验沉淀为律所知识。']]
};
const flowButtons = [...document.querySelectorAll('[data-flow]')];
function selectFlow(button) {
  flowButtons.forEach(item => { item.setAttribute('aria-selected', String(item === button)); item.tabIndex = item === button ? 0 : -1; });
  document.querySelector('#workflow-panel').setAttribute('aria-labelledby', button.id);
  document.querySelector('#workflow-steps').replaceChildren(...workflows[button.dataset.flow].map(([title, body], index) => {
    const li = document.createElement('li');
    const number = document.createElement('span'); number.className = 'step-number'; number.textContent = String(index + 1).padStart(2, '0');
    const content = document.createElement('div'); const heading = document.createElement('h3'); const description = document.createElement('p');
    heading.textContent = title; description.textContent = body; content.append(heading, description); li.append(number, content); return li;
  }));
}
bindTabs(flowButtons, selectFlow); selectFlow(flowButtons[0]);
document.querySelectorAll('[data-workflow-link]').forEach(link => link.addEventListener('click', () => selectFlow(flowButtons.find(button => button.dataset.flow === link.dataset.workflowLink))));

const contactDialog = document.querySelector('#contact-dialog');
const screenDialog = document.querySelector('#screen-dialog');
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => contactDialog.showModal()));
document.querySelectorAll('.zoom-screen, .screen-button').forEach(button => button.addEventListener('click', () => {
  screenDialog.querySelector('img').src = document.querySelector('#product-screen').src;
  screenDialog.querySelector('img').alt = document.querySelector('#product-screen').alt;
  screenDialog.showModal();
}));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
});
document.querySelector('#copy-brief').addEventListener('click', async () => {
  const text = '你好，我们希望预约 SIREN 系统诊断会。\n机构名称：\n主要业务方向：\n当前希望解决的问题：\n感兴趣的方向：GEO 品牌增长 / AI 案件管办 / 一体化方案\n方便沟通的时间：';
  try { await navigator.clipboard.writeText(text); document.querySelector('.copy-result').textContent = '已复制，可发送给原初之幕项目对接人。'; }
  catch { document.querySelector('.copy-result').textContent = text; }
});

// A quiet, code-native network surface, accompanying the template's split hero.
// It depicts a shared intelligence layer rather than simulating a live product.
const canvas = document.querySelector('#engine');
const ctx = canvas.getContext('2d');
if (ctx) {
  const visual = canvas.parentElement; let width = 0, height = 0, running = true, frame = 0, visible = true;
  const rows = 35, columns = 48;
  function resize() { width = visual.clientWidth; height = visual.clientHeight; const ratio = Math.min(window.devicePixelRatio || 1, 2); canvas.width = width * ratio; canvas.height = height * ratio; ctx.setTransform(ratio, 0, 0, ratio, 0, 0); }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(visual); resize();
  function render(time) {
    ctx.clearRect(0, 0, width, height);
    const t = reduceMotion.matches ? 0.8 : time * 0.00012;
    const points = [];
    for (let row = 0; row < rows; row++) {
      const line = [];
      for (let column = 0; column < columns; column++) {
        const u = column / (columns - 1), v = row / (rows - 1);
        const angle = u * Math.PI * 2.0 + t;
        const radius = (0.18 + v * 0.30) * width;
        const wave = Math.sin(u * 8 + v * 5 + t * 2) * 14;
        const x = width * 0.50 + Math.cos(angle) * radius;
        const y = height * 0.53 + Math.sin(angle) * radius * 0.30 + (v - 0.5) * height * 0.45 + wave;
        const z = (Math.sin(angle) + 1) / 2;
        const point = {x, y, z}; line.push(point);
        ctx.fillStyle = `rgba(149,231,168,${0.08 + z * 0.33})`;
        ctx.beginPath(); ctx.arc(x, y, 0.5 + z * 0.6, 0, Math.PI * 2); ctx.fill();
        if (column > 0 && row % 2 === 0) { ctx.strokeStyle = `rgba(119,196,143,${0.025 + z * 0.06})`; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(line[column-1].x,line[column-1].y); ctx.lineTo(x,y); ctx.stroke(); }
        if (row > 0 && column % 3 === 0) { const previous = points[row-1][column]; ctx.strokeStyle = `rgba(132,221,154,${0.025 + z * 0.04})`; ctx.beginPath(); ctx.moveTo(previous.x,previous.y); ctx.lineTo(x,y); ctx.stroke(); }
      }
      points.push(line);
    }
    if (running && !reduceMotion.matches && visible && !document.hidden) frame = requestAnimationFrame(render);
  }
  const visibilityObserver = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; cancelAnimationFrame(frame); if (visible) render(performance.now()); }); visibilityObserver.observe(visual);
  document.addEventListener('visibilitychange', () => { cancelAnimationFrame(frame); if (!document.hidden && visible) render(performance.now()); });
  reduceMotion.addEventListener('change', () => { cancelAnimationFrame(frame); render(performance.now()); });
  window.addEventListener('pagehide', () => { running = false; cancelAnimationFrame(frame); resizeObserver.disconnect(); visibilityObserver.disconnect(); }, {once:true});
  window.addEventListener('pageshow', event => { if(event.persisted) { running = true; resizeObserver.observe(visual); visibilityObserver.observe(visual); render(performance.now()); } });
}
