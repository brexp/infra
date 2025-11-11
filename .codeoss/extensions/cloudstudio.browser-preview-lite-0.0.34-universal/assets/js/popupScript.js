
// 预览插件新页面打开提示逻辑
document.addEventListener('DOMContentLoaded', () => {
  const trigger = document.getElementById('openInBrowser');
  let popup = null;
  let autoShowTimer;

  // 创建提示框
  const createPopup = () => {
    if (popup) {
      return;
    }

    popup = document.createElement('div');
    popup.className = 'browser-popup';
    popup.innerHTML = '点击新标签页打开<div class="close-btn"></div>';
    document.body.appendChild(popup);

    // 添加关闭事件
    popup.querySelector('.close-btn').addEventListener('click', hidePopup);
  };

  // 显示提示框
  const showPopup = () => {
    if (!popup) {
      createPopup();
    }
    updatePosition();
    popup.classList.add('visible');
  };

  // 隐藏提示框
  const hidePopup = () => {
    if (popup) {
      popup.classList.remove('visible');
      setTimeout(() => {
        popup.remove();
        popup = null;
      }, 300);
    }
  };

  // 更新位置
  const updatePosition = () => {
    if (!popup) {
      return;
    }
    const rect = trigger.getBoundingClientRect();
    popup.style.left = `${rect.left}px`;
    popup.style.top = `${rect.bottom + window.scrollY + 8}px`;
  };

  // 自动显示逻辑
  const initAutoShow = () => {
    autoShowTimer = setTimeout(() => {
      showPopup();
      // 5秒后自动关闭
      setTimeout(hidePopup, 5000);
    }, 2000);
  };

  // 点击打开新标签页
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    window.open(trigger.href, '_blank');
    hidePopup();
  });

  // 窗口调整时更新位置
  window.addEventListener('resize', () => {
    if (popup && popup.classList.contains('visible')) {
      updatePosition();
    }
  });

  // 初始化自动显示
  initAutoShow();
});
