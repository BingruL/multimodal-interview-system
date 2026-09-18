<template>
  <div class="mobile-nav" :class="{ 'nav-open': isNavOpen }">
    <!-- 移动端顶部导航栏 -->
    <div class="mobile-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">🎯</div>
          <h2 class="logo-text">AI面试官</h2>
        </div>
        
        <button class="menu-toggle" @click="toggleNav">
          <span class="hamburger" :class="{ 'active': isNavOpen }"></span>
        </button>
      </div>
    </div>
    
    <!-- 移动端侧边栏 -->
    <div class="mobile-sidebar" :class="{ 'sidebar-open': isNavOpen }">
      <div class="sidebar-overlay" @click="closeNav"></div>
      <div class="sidebar-content">
        <div class="user-info">
          <div class="user-avatar">👤</div>
          <div class="user-details">
            <div class="username">{{ currentUser?.username || '用户' }}</div>
            <div class="user-status">{{ currentUser?.isGuest ? '游客模式' : '已登录' }}</div>
          </div>
        </div>
        
        <nav class="mobile-nav-menu">
          <ul>
            <li :class="{ 'active': currentPage === 'home' }">
              <a @click="navigateTo('home')">
                <span class="nav-icon">🏠</span>
                <span class="nav-text">首页</span>
              </a>
            </li>
            <li>
              <a @click="navigateTo('interview-history')">
                <span class="nav-icon">📊</span>
                <span class="nav-text">面试记录</span>
              </a>
            </li>
            <li>
              <a @click="navigateTo('analysis')">
                <span class="nav-icon">📈</span>
                <span class="nav-text">能力分析</span>
              </a>
            </li>
            <li>
              <a @click="navigateTo('settings')">
                <span class="nav-icon">⚙️</span>
                <span class="nav-text">设置</span>
              </a>
            </li>
          </ul>
        </nav>
        
        <div class="sidebar-footer">
          <button class="logout-btn" @click="handleLogout">
            <span class="nav-icon">🚪</span>
            <span class="nav-text">退出登录</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  currentUser: Object,
  currentPage: String
});

const emits = defineEmits(['navigate', 'logout']);

const isNavOpen = ref(false);

const toggleNav = () => {
  isNavOpen.value = !isNavOpen.value;
};

const closeNav = () => {
  isNavOpen.value = false;
};

const navigateTo = (page) => {
  emits('navigate', page);
  closeNav();
};

const handleLogout = () => {
  emits('logout');
  closeNav();
};
</script>

<style scoped>
/* 移动端导航基础样式 */
.mobile-nav {
  position: relative;
  z-index: 1000;
}

/* 移动端顶部导航栏 */
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1001;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

/* 汉堡菜单按钮 */
.menu-toggle {
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.menu-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}

.hamburger {
  position: relative;
  width: 24px;
  height: 2px;
  background: white;
  transition: all 0.3s ease;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: white;
  transition: all 0.3s ease;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

.hamburger.active {
  background: transparent;
}

.hamburger.active::before {
  top: 0;
  transform: rotate(45deg);
}

.hamburger.active::after {
  bottom: 0;
  transform: rotate(-45deg);
}

/* 移动端侧边栏 */
.mobile-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1000;
  visibility: hidden;
  transition: visibility 0.3s ease;
}

.mobile-sidebar.sidebar-open {
  visibility: visible;
}

.sidebar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.sidebar-open .sidebar-overlay {
  opacity: 1;
}

.sidebar-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  backdrop-filter: blur(20px);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  padding-top: 60px;
}

.sidebar-open .sidebar-content {
  transform: translateX(0);
}

/* 用户信息区域 */
.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.user-details {
  flex: 1;
}

.username {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.user-status {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

/* 导航菜单 */
.mobile-nav-menu {
  flex: 1;
  padding: 16px 0;
}

.mobile-nav-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-nav-menu li {
  margin-bottom: 4px;
}

.mobile-nav-menu a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.mobile-nav-menu li.active a,
.mobile-nav-menu a:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-icon {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-weight: 500;
}

/* 侧边栏底部 */
.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 响应式设计 */
@media (min-width: 769px) {
  .mobile-nav {
    display: none;
  }
}

@media (max-width: 480px) {
  .sidebar-content {
    width: 100%;
  }
}
</style>