const grid = document.querySelector('#review-grid');
const tabs = [...document.querySelectorAll('[data-variant]')];
const panes = [...document.querySelectorAll('.preview-pane')];
const compareButton = document.querySelector('#compare-toggle');
const deviceButton = document.querySelector('#device-toggle');
const compareLabel = compareButton.querySelector('.control-label');
const deviceLabel = deviceButton.querySelector('.control-label');
let current = 'light', compare = true, mobile = window.matchMedia('(max-width:600px)').matches;
function fitFrames() {
  document.querySelectorAll('.preview-stage').forEach(stage => {
    if (stage.closest('[hidden]')) return;
    const frame = stage.querySelector('iframe');
    const targetWidth = mobile ? 390 : compare ? 1280 : Math.max(960, stage.clientWidth);
    const scale = Math.min(stage.clientWidth / targetWidth, mobile ? 1 : Infinity);
    if (!scale) return;
    frame.style.width = targetWidth + 'px';
    frame.style.height = Math.round(stage.clientHeight / scale) + 'px';
    frame.style.left = mobile ? Math.max(0,(stage.clientWidth-targetWidth*scale)/2) + 'px' : '0';
    frame.style.transform = 'scale(' + scale + ')';
  });
}
function render() {
  grid.classList.toggle('compare',compare);
  grid.classList.toggle('is-mobile',mobile);
  tabs.forEach(tab => {const selected = tab.dataset.variant === current;tab.setAttribute('aria-selected',String(selected));tab.tabIndex = selected ? 0 : -1;});
  panes.forEach(pane => {pane.hidden = !compare && pane.id !== current+'-pane';});
  compareButton.setAttribute('aria-pressed',String(compare));
  compareLabel.textContent = compare ? '返回单页' : '并排对比';
  deviceButton.setAttribute('aria-pressed',String(mobile));
  deviceLabel.textContent = mobile ? '桌面视图' : '手机视图';
  document.querySelector('#review-description').textContent = compare ? '两版可独立滚动。点「打开完整页面」可查看实际字号。' : current === 'light' ? '方案 C：浅色背景，首屏展示产品界面。' : '方案 01：暗色背景，首屏展示 SIREN 智能系统。';
  requestAnimationFrame(fitFrames);
}
tabs.forEach((tab,index) => {
  tab.addEventListener('click',()=>{current=tab.dataset.variant;compare=false;render();});
  tab.addEventListener('keydown',event=>{
    let next;
    if(event.key==='ArrowRight') next=(index+1)%tabs.length;
    if(event.key==='ArrowLeft') next=(index-1+tabs.length)%tabs.length;
    if(event.key==='Home') next=0;
    if(event.key==='End') next=tabs.length-1;
    if(next!==undefined){event.preventDefault();current=tabs[next].dataset.variant;compare=false;render();tabs[next].focus();}
  });
});
compareButton.addEventListener('click',()=>{compare=!compare;render();});
deviceButton.addEventListener('click',()=>{mobile=!mobile;render();});
const observer=new ResizeObserver(fitFrames);
document.querySelectorAll('.preview-stage').forEach(stage=>observer.observe(stage));
window.addEventListener('pagehide',()=>observer.disconnect(),{once:true});
window.addEventListener('pageshow',event=>{if(event.persisted){document.querySelectorAll('.preview-stage').forEach(stage=>observer.observe(stage));fitFrames();}});
render();
