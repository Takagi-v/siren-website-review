(() => {
  const key = 'siren-site-theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  const browserColor = document.querySelector('meta[name="theme-color"]');

  function updateBrowserColor() {
    const dark = root.dataset.theme === 'dark' || (!root.dataset.theme && system.matches);
    browserColor.content = dark ? '#101514' : '#f7faf9';
  }

  function apply(preference) {
    if (preference === 'light' || preference === 'dark') {
      root.dataset.theme = preference;
    } else {
      delete root.dataset.theme;
    }
    updateBrowserColor();
  }

  try {
    apply(localStorage.getItem(key));
  } catch {
    // The system theme also works when storage is unavailable.
    updateBrowserColor();
  }
  system.addEventListener('change', updateBrowserColor);

  document.addEventListener('DOMContentLoaded', () => {
    const select = document.querySelector('#site-theme');
    select.value = root.dataset.theme || 'system';
    select.addEventListener('change', () => {
      apply(select.value);
      try {
        if (select.value === 'system') localStorage.removeItem(key);
        else localStorage.setItem(key, select.value);
      } catch {
        // Keep the selected theme for this page even without storage.
      }
    });

    window.addEventListener('storage', event => {
      if (event.key !== key && event.key !== null) return;
      apply(event.newValue);
      select.value = root.dataset.theme || 'system';
    });
  });
})();
