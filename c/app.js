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
document.querySelector('.logo-track').append(logoDuplicate);
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
      const vertical=button.closest('[role=tablist]').getAttribute('aria-orientation')==='vertical';
      if (vertical && event.key === 'ArrowDown') next=(index+1)%buttons.length;
      if (vertical && event.key === 'ArrowUp') next=(index-1+buttons.length)%buttons.length;
      if (event.key === 'ArrowRight') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + buttons.length) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); select(buttons[next]); buttons[next].focus(); }
    });
  });
}
const assetRoot = new URL('../assets/', document.currentScript.src);
const screens = {
  knowledge: { src: new URL('knowledge-library.png', assetRoot).href, title: '多模态知识库', description: '让文档、表格、图片与扫描件，成为可检索、可调用的依据。', alt: 'SIREN 客户资料库实际界面，包含资料搜索、上传和状态管理' },
  publishing: { src: new URL('publishing-workspace.png', assetRoot).href, title: '多平台运营', description: '统一管理平台账号，连接内容审核、发布执行与结果核验。', alt: 'SIREN 多平台账号管理实际界面，展示小红书、知乎、头条、网易与搜狐账号状态' }
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
  casework: [
    {title:'智能接案',label:'案件入口',heading:'把案情起点，整理清楚。',description:'整理访谈与客户材料，抽取事实、主体和服务需求，为案件建立清晰起点。',highlight:'事实与诉求先经核对，再进入后续工作流。',sources:['客户访谈','初步材料','服务需求','接案纪要']},
    {title:'案情梳理',label:'事实与争点',heading:'把分散材料，串成一条线。',description:'整理事件时间线，识别关键主体与争议焦点，让事实结构更清晰。',highlight:'在原始材料之间建立联系，保留事实对应的位置。',sources:['事件记录','主体信息','往来文件','案情时间线']},
    {title:'法律检索',label:'法律与类案',heading:'让检索结果，回到具体问题。',description:'连接法律法规、裁判文书与律所专业资料，检索与案件问题相关的依据。',highlight:'保留法规、案例和专业资料的来源，供律师核验。',sources:['法律法规','裁判文书','律所知识','相关依据']},
    {title:'证据组织',label:'来源定位',heading:'让每一项判断，都有依据。',description:'组织证据目录、关联事实与资料，保留原始位置，辅助识别材料缺口。',highlight:'回到原始文件，核对来源与具体内容。',sources:['合同与附件','往来邮件','付款凭证','会议纪要']},
    {title:'文书辅助',label:'版本与修订',heading:'从有据的材料，到可审核的草稿。',description:'辅助文书起草、审阅与比对，关联案件材料和检索依据，保留修订版本。',highlight:'文书草稿由律师审核，专业判断始终进入关键环节。',sources:['业务模板','引用依据','历史版本','文书草稿']},
    {title:'协同复盘',label:'经验沉淀',heading:'让一次交付，积累下一次的知识。',description:'组织任务与协作，保留操作记录，将可复用的案件经验沉淀为律所知识。',highlight:'案件经验、专业模板与流程记录，持续进入知识积累。',sources:['协作任务','过程留痕','交付材料','复盘记录']}
  ],
  growth: [
    {title:'意图挖掘',label:'真实客户问题',heading:'先理解，客户正在问什么。',description:'围绕业务方向与客户需求建立问题集合，梳理适合持续观察的问法与场景。',highlight:'用真实业务问题，连接品牌资料与专业内容。',sources:['业务方向','客户需求','典型问法','问题集合']},
    {title:'品牌诊断',label:'知识与信源',heading:'找到专业价值表达中的缺口。',description:'整理品牌实体、业务信息与公开来源，识别专业内容和官网结构中的改进空间。',highlight:'核对名称、身份与业务信息，让专业表达有据可循。',sources:['品牌资料','官网页面','专业内容','诊断发现']},
    {title:'数据监测',label:'回答表现',heading:'把 AI 如何回答，记录下来。',description:'建立问题与竞对基线，保存回答、引用与推荐结果的采样快照。',highlight:'分平台、分问题保存观察结果，避免用一次回答代替持续判断。',sources:['目标问题','回答样本','引用来源','基线快照']},
    {title:'策略学习',label:'策略迭代',heading:'从变化里，确定下一步行动。',description:'结合回答表现、内容与信源条件，分析变化原因并调整后续工作优先级。',highlight:'每一轮观察，都成为下一轮策略与内容安排的依据。',sources:['诊断发现','回答变化','执行记录','行动建议']},
    {title:'内容生产',label:'专业表达',heading:'让行业经验，成为可引用的内容。',description:'检索品牌与法律知识，先准备依据，再组织文章、专题与常见问题，并经人工审核。',highlight:'关联主张与依据，保留内容所引用的具体资料版本。',sources:['专业选题','品牌知识','证据材料','内容母版']},
    {title:'A/B 测试',label:'表达验证',heading:'用验证，调整内容与结构。',description:'围绕表达、页面结构与信源安排开展对照观察，为后续迭代积累依据。',highlight:'记录测试条件与回答样本，结合实际表现调整方向。',sources:['测试问题','结构方案','表达版本','观察记录']},
    {title:'内容分发',label:'公开信源',heading:'把专业内容，送到可发现的地方。',description:'通过官网与授权平台发布适配后的内容，核验实际状态和文章链接。',highlight:'文章母版、适配稿与实际发布记录，保留相互对应关系。',sources:['官网页面','平台适配稿','账号授权','发布记录']},
    {title:'效果回测',label:'结果核验',heading:'把执行结果，带回下一轮策略。',description:'持续观察引用、推荐与回答变化，结合网站访问和执行记录形成阶段交付。',highlight:'用回答证据、内容台账和行动建议，解释阶段性变化。',sources:['回答快照','内容台账','访问摘要','阶段报告']}
  ]
};
const businessButtons = [...document.querySelectorAll('[data-business]')];
let currentBusiness = 'casework';
function selectStep(index) {
  const step = workflows[currentBusiness][index];
  const stepButtons = [...document.querySelectorAll('[data-step]')];
  stepButtons.forEach((button,i) => {button.setAttribute('aria-selected',String(i===index));button.tabIndex=i===index?0:-1;});
  document.querySelector('#step-panel').setAttribute('aria-labelledby','step-'+index);
  document.querySelector('#step-heading').textContent=step.title;
  document.querySelector('#source-label').textContent=currentBusiness==='casework'?'案件材料':'增长资料';
  ['one','two','three','four'].forEach((key,i)=>{document.querySelector('#source-'+key).textContent=step.sources[i];});
  document.querySelector('#document-label').textContent=step.label;
  document.querySelector('#document-title').textContent=step.heading;
  document.querySelector('#document-description').textContent=step.description;
  document.querySelector('#document-highlight').textContent=step.highlight;
}
function selectBusiness(button) {
  currentBusiness=button.dataset.business;
  businessButtons.forEach(item=>{item.setAttribute('aria-selected',String(item===button));item.tabIndex=item===button?0:-1;});
  document.querySelector('#business-panel').setAttribute('aria-labelledby',button.id);
  const stepList=document.querySelector('.step-list');
  stepList.replaceChildren(...workflows[currentBusiness].map((step,i)=>{
    const stepButton=document.createElement('button');
    stepButton.id='step-'+i;stepButton.className='step-button';stepButton.dataset.step=String(i);
    stepButton.setAttribute('role','tab');stepButton.setAttribute('aria-controls','step-panel');
    const number=document.createElement('span');number.className='step-number';number.textContent=String(i+1).padStart(2,'0');
    const label=document.createElement('span');label.textContent=step.title;stepButton.append(number,label);return stepButton;
  }));
  bindTabs([...stepList.querySelectorAll('button')],stepButton=>selectStep(Number(stepButton.dataset.step)));
  selectStep(currentBusiness==='casework'?3:0);
}
bindTabs(businessButtons,selectBusiness);
selectBusiness(businessButtons[1]);


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

