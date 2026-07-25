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

  function ensureControlNames(root) {
    var controls = (root || document).querySelectorAll
      ? (root || document).querySelectorAll('input, select, textarea')
      : [];
    Array.prototype.forEach.call(controls, function (control) {
      if (control.getAttribute('aria-label') || control.getAttribute('aria-labelledby')) return;
      if (control.id && document.querySelector('label[for="' + CSS.escape(control.id) + '"]')) return;
      var wrappingLabel = control.closest('label');
      if (wrappingLabel && wrappingLabel.textContent.trim()) return;
      var group = control.closest(
        '.field-group, .input-group, .form-group, .input-row, .select-wrap, td, section'
      );
      if (group && group.classList.contains('select-wrap')) group = group.parentElement;
      var label = group && group.querySelector('label, .field-label, .input-label, .card-title');
      var name = label && label.textContent.replace(/\s+/g, ' ').trim();
      if (!name) {
        name = control.getAttribute('placeholder') ||
          control.getAttribute('name') ||
          control.id ||
          (control.tagName === 'SELECT' ? '請選擇項目' : '請輸入資料');
      }
      control.setAttribute('aria-label', name);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeToggle');
    if (btn) {
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
    }
    ensureControlNames(document);
    new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        Array.prototype.forEach.call(mutation.addedNodes, function (node) {
          if (node.nodeType === 1) ensureControlNames(node);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  });
})();
