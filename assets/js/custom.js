function updateSidebarState() {
  const isHome =
    window.location.pathname === '/' ||
    window.location.pathname === '/index.html';
  const isSmallScreen = window.innerWidth < 992; // 기준: lg

  // 조건 정리
  const shouldShowSidebar = !isHome && !isSmallScreen;

  if (shouldShowSidebar) {
    document.body.setAttribute('sidebar-display', '');
  } else {
    document.body.removeAttribute('sidebar-display');
  }
}

document.addEventListener('DOMContentLoaded', updateSidebarState);
window.addEventListener('resize', updateSidebarState); // 반응형 대응
