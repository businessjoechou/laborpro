// auth-bar.js — LaborPro 版浮動登入 UI（綠色主題）
import { supabase } from './auth.js';

async function initAuthBar() {
  const style = document.createElement('style');
  style.textContent = `
    .auth-bar {
      position: fixed;
      bottom: calc(24px + env(safe-area-inset-bottom, 0px));
      right: 20px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .auth-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(19, 28, 19, 0.92);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(42, 110, 62, 0.3);
      border-radius: 40px;
      padding: 6px 14px 6px 8px;
      cursor: pointer;
      font-family: 'Noto Sans TC', sans-serif;
      font-size: 12px;
      color: rgba(238, 245, 236, 0.7);
      text-decoration: none;
      transition: border-color 0.2s, color 0.2s;
      user-select: none;
    }
    .auth-pill:hover {
      border-color: rgba(42, 110, 62, 0.6);
      color: #eef5ec;
    }
    .auth-avatar {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--accent, #2a6e3e);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
    }
    #auth-dropdown {
      position: fixed;
      bottom: calc(64px + env(safe-area-inset-bottom, 0px));
      right: 20px;
      background: #131c13;
      border: 1px solid rgba(42, 110, 62, 0.3);
      border-radius: 10px;
      padding: 8px;
      min-width: 148px;
      z-index: 10000;
      font-family: 'Noto Sans TC', sans-serif;
      font-size: 13px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      animation: authDropIn 0.15s ease both;
    }
    #auth-dropdown a,
    #auth-dropdown .dropdown-item {
      display: block;
      padding: 8px 12px;
      color: #eef5ec;
      text-decoration: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.15s;
    }
    #auth-dropdown a:hover,
    #auth-dropdown .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.07);
    }
    #auth-dropdown .dropdown-signout { color: var(--gold, #c8901a); }
    #auth-dropdown .dropdown-divider {
      height: 1px;
      background: rgba(255,255,255,0.08);
      margin: 4px 0;
    }
    @keyframes authDropIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @media print { .auth-bar, #auth-dropdown { display: none !important; } }
  `;
  document.head.appendChild(style);

  const { data: { user } } = await supabase.auth.getUser();

  const bar = document.createElement('div');
  bar.className = 'auth-bar';

  if (!user) {
    bar.innerHTML = `<a class="auth-pill" href="/login.html">
      <div class="auth-avatar">?</div>登入
    </a>`;
  } else {
    const initial = (user.email || 'U')[0].toUpperCase();
    bar.innerHTML = `<div class="auth-pill" id="auth-menu-btn" role="button" tabindex="0" aria-label="帳號選單">
      <div class="auth-avatar">${initial}</div>我的帳號
    </div>`;

    const menuBtn = bar.querySelector('#auth-menu-btn');
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var existing = document.getElementById('auth-dropdown');
      if (existing) { existing.remove(); return; }

      var dropdown = document.createElement('div');
      dropdown.id = 'auth-dropdown';
      dropdown.innerHTML = `
        <a href="/account.html">我的帳號</a>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item dropdown-signout" id="auth-signout-btn">登出</div>
      `;
      document.body.appendChild(dropdown);

      dropdown.querySelector('#auth-signout-btn').addEventListener('click', async function() {
        dropdown.remove();
        await supabase.auth.signOut();
        window.location.href = '/';
      });

      setTimeout(function() {
        document.addEventListener('click', function() {
          var d = document.getElementById('auth-dropdown');
          if (d) d.remove();
        }, { once: true });
      }, 10);
    });
  }

  document.body.appendChild(bar);

  window.__signOut = async function() {
    await supabase.auth.signOut();
    window.location.href = '/';
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthBar);
} else {
  initAuthBar();
}
