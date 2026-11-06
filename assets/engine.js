(() => {
  const canvas = document.querySelector('#engine');
  const context = canvas.getContext('2d');
  if (!context) return;

  const panel = canvas.parentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const rows = 29;
  const columns = 48;
  let width = 0;
  let height = 0;
  let frame = 0;
  let visible = false;

  function draw(time) {
    context.clearRect(0, 0, width, height);
    const phase = motion.matches ? .8 : time * .00012;
    let previousRing = [];
    for (let row = 0; row < rows; row++) {
      const progress = row / (rows - 1);
      const radius = (.18 + progress * .3) * width;
      const ring = [];
      for (let column = 0; column < columns; column++) {
        const position = column / (columns - 1);
        const angle = position * Math.PI * 2 + phase;
        const depth = (Math.sin(angle) + 1) / 2;
        const x = width * .5 + Math.cos(angle) * radius;
        const y = height * .53 + Math.sin(angle) * radius * .3
          + (progress - .5) * height * .45 + Math.sin(position * 8 + progress * 5 + phase * 2) * 14;
        ring.push({x, y});
        context.globalAlpha = .08 + depth * .33;
        context.beginPath();
        context.arc(x, y, .5 + depth * .6, 0, Math.PI * 2);
        context.fill();
        if (row > 0 && column % 3 === 0) {
          context.globalAlpha = .04 + depth * .06;
          context.beginPath();
          context.moveTo(previousRing[column].x, previousRing[column].y);
          context.lineTo(x, y);
          context.stroke();
        }
      }
      previousRing = ring;
    }
    context.globalAlpha = 1;
    if (visible && !document.hidden && !motion.matches) frame = requestAnimationFrame(draw);
  }

  function refresh() {
    cancelAnimationFrame(frame);
    if (!visible || document.hidden || !width || !height) return;
    context.fillStyle = context.strokeStyle = getComputedStyle(canvas).color;
    context.lineWidth = .6;
    draw(performance.now());
  }

  new ResizeObserver(() => {
    width = panel.clientWidth;
    height = panel.clientHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * scale;
    canvas.height = height * scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    refresh();
  }).observe(panel);

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    refresh();
  }).observe(panel);

  new MutationObserver(refresh).observe(document.documentElement, {attributeFilter: ['data-theme']});
  motion.addEventListener('change', refresh);
  colorScheme.addEventListener('change', refresh);
  document.addEventListener('visibilitychange', refresh);
})();
