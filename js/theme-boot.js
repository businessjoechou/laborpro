(function () {
  var html = document.documentElement;
  var stored = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = stored || (prefersDark ? 'dark' : 'light');
  if (theme === 'light') html.setAttribute('data-theme', 'light');

  function updateIcon(t) {
    var btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = t === 'light' ? '☾' : '☀';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    updateIcon(html.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    btn.addEventListener('click', function () {
      html.classList.add('theme-transitioning');
      var current = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      if (current === 'light') html.setAttribute('data-theme', 'light');
      else html.removeAttribute('data-theme');
      localStorage.setItem('theme', current);
      updateIcon(current);
      setTimeout(function () { html.classList.remove('theme-transitioning'); }, 350);
    });
  });
})();
