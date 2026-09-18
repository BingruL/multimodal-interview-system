<template>
  <div class="camera-test-container">
    <!-- 背景渐变 -->
    <div class="background-gradient"></div>
    
    <!-- 主要内容 -->
    <div class="main-content">
      <div class="content-card">
        <!-- 标题区域 -->
        <div class="title-section">
          <h1 class="main-title">摄像头功能测试</h1>
          <p class="subtitle">测试独立摄像头组件的功能</p>
        </div>
        
        <!-- 摄像头组件区域 -->
        <div class="camera-section">
          <SimpleCamera ref="cameraRef" />
        </div>
        
        <!-- 控制按钮 -->
        <div class="controls-section">
          <h3 class="section-title">摄像头控制</h3>
          <div class="control-buttons">
            <button 
              @click="enableCamera"
              class="control-button enable-btn"
            >
              <svg class="button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23 7V17C23 18.1046 22.1046 19 21 19H3C1.89543 19 1 18.1046 1 17V7C1 5.89543 1.89543 5 3 5H7L9 3H15L17 5H21C22.1046 5 23 5.89543 23 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
              </svg>
              开启摄像头
            </button>
            <button 
              @click="disableCamera"
              class="control-button disable-btn"
            >
              <svg class="button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8L22 12L18 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 8L2 12L6 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 6L10 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              关闭摄像头
            </button>
            <button 
              @click="toggleCamera"
              class="control-button toggle-btn"
            >
              <svg class="button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M8 21H5C3.89543 21 3 20.1046 3 19V16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              切换摄像头
            </button>
          </div>
        </div>
        
        <!-- 状态信息 -->
        <div class="status-section">
          <h3 class="section-title">摄像头状态</h3>
          <div class="status-grid">
            <div class="status-item">
              <span class="status-label">是否开启:</span>
              <span class="status-value" :class="{ 'active': isCameraEnabled }">
                {{ isCameraEnabled ? '是' : '否' }}
              </span>
            </div>
            <div class="status-item">
              <span class="status-label">浏览器支持:</span>
              <span class="status-value" :class="{ 'active': browserSupport }">
                {{ browserSupport ? '是' : '否' }}
              </span>
            </div>
            <div class="status-item">
              <span class="status-label">权限状态:</span>
              <span class="status-value">{{ permissionStatus }}</span>
            </div>
          </div>
        </div>
        
        <!-- 返回按钮 -->
        <div class="back-section">
          <button @click="$emit('go-back')" class="back-button">
            <svg class="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            返回
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SimpleCamera from './SimpleCamera.vue';

const emits = defineEmits(['go-back']);

const cameraRef = ref(null);
const isCameraEnabled = ref(false);
const browserSupport = ref(false);
const permissionStatus = ref('未知');

// 检查浏览器支持
const checkBrowserSupport = () => {
  browserSupport.value = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

// 检查权限状态
const checkPermissionStatus = async () => {
  try {
    if (!browserSupport.value) {
      permissionStatus.value = '浏览器不支持';
      return;
    }
    
    const result = await navigator.permissions.query({ name: 'camera' });
    permissionStatus.value = result.state;
  } catch (error) {
    permissionStatus.value = '无法检查权限';
  }
};

// 开启摄像头
const enableCamera = async () => {
  if (cameraRef.value) {
    const success = await cameraRef.value.enableCamera();
    if (success) {
      isCameraEnabled.value = true;
    }
  }
};

// 关闭摄像头
const disableCamera = () => {
  if (cameraRef.value) {
    cameraRef.value.disableCamera();
    isCameraEnabled.value = false;
  }
};

// 切换摄像头
const toggleCamera = () => {
  if (cameraRef.value) {
    cameraRef.value.toggleCamera();
    // 更新状态
    setTimeout(() => {
      isCameraEnabled.value = cameraRef.value.isCameraEnabled();
    }, 100);
  }
};

onMounted(() => {
  checkBrowserSupport();
  checkPermissionStatus();
});
</script>

<style scoped>
/* 容器样式 */
.camera-test-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

/* 背景渐变 */
.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1;
}

/* 主要内容 */
.main-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1000px;
}

/* 内容卡片 */
.content-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 标题区域 */
.title-section {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.25rem;
  color: #666;
  font-weight: 500;
  margin: 0;
}

/* 摄像头区域 */
.camera-section {
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
}

/* 控制区域 */
.controls-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 24px;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.control-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.control-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.button-icon {
  width: 20px;
  height: 20px;
}

.enable-btn {
  background: rgba(82, 196, 26, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.disable-btn {
  background: rgba(255, 77, 79, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.toggle-btn {
  background: rgba(24, 144, 255, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 状态区域 */
.status-section {
  margin-bottom: 40px;
}

.status-grid {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.status-value {
  font-weight: 600;
  color: #999;
  font-size: 1rem;
}

.status-value.active {
  color: #52c41a;
}

/* 返回按钮 */
.back-section {
  text-align: center;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.1);
  color: #333;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.back-icon {
  width: 18px;
  height: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .camera-test-container {
    padding: 16px;
  }
  
  .content-card {
    padding: 24px;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .control-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .control-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .content-card {
    padding: 20px;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}
</style> 