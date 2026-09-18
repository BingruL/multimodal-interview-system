<template>
  <div class="fullscreen-camera-container">
    <!-- 全屏摄像头背景 -->
    <div class="camera-background" v-if="isCameraEnabled">
      <video 
        ref="videoElement" 
        autoplay 
        playsinline
        muted
        class="camera-video"
      ></video>
    </div>
    
    <!-- 摄像头关闭时的背景 -->
    <div class="camera-placeholder" v-if="!isCameraEnabled">
      <div class="placeholder-content">
        <svg class="camera-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 7V17C23 18.1046 22.1046 19 21 19H3C1.89543 19 1 18.1046 1 17V7C1 5.89543 1.89543 5 3 5H7L9 3H15L17 5H21C22.1046 5 23 5.89543 23 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
        </svg>
        <p class="placeholder-text">摄像头已关闭</p>
      </div>
    </div>
    
    <!-- AI面试官头像 - 右上角 -->
    <div class="ai-interviewer-avatar">
      <div class="avatar-container">
        <div class="avatar-image">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="8" r="5" stroke="currentColor" stroke-width="2"/>
            <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="avatar-status">
          <span class="status-dot"></span>
        </div>
        <div class="avatar-info">
          <span class="ai-name">AI面试官</span>
          <span class="ai-status">在线</span>
        </div>
      </div>
    </div>
    
    <!-- 摄像头控制按钮 - 右下角 -->
    <div class="camera-controls">
      <button 
        @click="toggleCamera"
        :class="[
          'camera-toggle-btn',
          isCameraEnabled ? 'camera-on' : 'camera-off'
        ]"
        :disabled="isLoading"
      >
        <svg v-if="isCameraEnabled" class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8L22 12L18 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 8L2 12L6 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M14 6L10 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <svg v-else class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 7V17C23 18.1046 22.1046 19 21 19H3C1.89543 19 1 18.1046 1 17V7C1 5.89543 1.89543 5 3 5H7L9 3H15L17 5H21C22.1046 5 23 5.89543 23 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span class="btn-text">{{ isCameraEnabled ? '关闭摄像头' : '开启摄像头' }}</span>
      </button>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <span>正在{{ isCameraEnabled ? '关闭' : '开启' }}摄像头...</span>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-overlay">
      <div class="error-content">
        <svg class="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ errorMessage }}</span>
        <button @click="errorMessage = ''" class="error-close-btn">×</button>
      </div>
    </div>
    
    <!-- 内容插槽 - 用于放置聊天界面等 -->
    <div class="content-overlay">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 定义事件
const emit = defineEmits(['camera-status-changed']);

// 响应式数据
const videoElement = ref(null);
const isCameraEnabled = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const stream = ref(null);

// 检查浏览器是否支持摄像头
const checkCameraSupport = () => {
  return navigator.mediaDevices && navigator.mediaDevices.getUserMedia;
};

// 开启摄像头
const enableCamera = async () => {
  if (!checkCameraSupport()) {
    errorMessage.value = '您的浏览器不支持摄像头功能';
    return false;
  }

  try {
    isLoading.value = true;
    errorMessage.value = '';

    // 获取摄像头权限和视频流
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 },
        facingMode: 'user' // 使用前置摄像头
      },
      audio: false // 不获取音频
    });

    stream.value = mediaStream;
    
    // 先设置状态为true，让video元素渲染
    isCameraEnabled.value = true;
    
    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 将视频流绑定到video元素
    console.log('正在绑定视频流到video元素...');
    if (videoElement.value) {
      videoElement.value.srcObject = mediaStream;
    }
    
    // 简单等待一下让视频开始加载
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('摄像头开启成功');
    emit('camera-status-changed', true);
    return true;
  } catch (error) {
    console.error('开启摄像头失败:', error);
    
    if (error.name === 'NotAllowedError') {
      errorMessage.value = '摄像头权限被拒绝，请在浏览器设置中允许摄像头访问';
    } else if (error.name === 'NotFoundError') {
      errorMessage.value = '未找到摄像头设备';
    } else if (error.name === 'NotReadableError') {
      errorMessage.value = '摄像头被其他应用程序占用';
    } else {
      errorMessage.value = '开启摄像头失败: ' + error.message;
    }
    
    return false;
  } finally {
    isLoading.value = false;
  }
};

// 关闭摄像头
const disableCamera = () => {
  try {
    if (stream.value) {
      // 停止所有视频轨道
      stream.value.getTracks().forEach(track => {
        track.stop();
      });
      stream.value = null;
    }
    
    // 清除video元素的srcObject
    if (videoElement.value) {
      videoElement.value.srcObject = null;
    }
    
    isCameraEnabled.value = false;
    emit('camera-status-changed', false);
    errorMessage.value = '';
  } catch (error) {
    console.error('关闭摄像头失败:', error);
    errorMessage.value = '关闭摄像头失败: ' + error.message;
  }
};

// 切换摄像头状态
const toggleCamera = async () => {
  if (isLoading.value) return;
  
  if (isCameraEnabled.value) {
    disableCamera();
  } else {
    await enableCamera();
  }
};

// 组件挂载时自动开启摄像头（可选）
onMounted(() => {
  // 如果需要自动开启摄像头，取消下面的注释
  // enableCamera();
});

// 组件卸载时关闭摄像头
onUnmounted(() => {
  disableCamera();
});

// 暴露方法给父组件
defineExpose({
  enableCamera,
  disableCamera,
  toggleCamera,
  isCameraEnabled: () => isCameraEnabled.value
});
</script>

<style scoped>
.fullscreen-camera-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
}

.camera-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8) contrast(1.1);
}

.camera-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: white;
}

.camera-icon {
  width: 80px;
  height: 80px;
  color: rgba(255, 255, 255, 0.7);
}

.placeholder-text {
  font-size: 18px;
  margin: 0;
  font-weight: 500;
}

/* AI面试官头像 - 右上角 */
.ai-interviewer-avatar {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.avatar-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-image {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.avatar-image svg {
  width: 24px;
  height: 24px;
}

.avatar-status {
  position: relative;
}

.status-dot {
  width: 12px;
  height: 12px;
  background: #52c41a;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.avatar-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ai-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.ai-status {
  font-size: 12px;
  color: #52c41a;
  font-weight: 500;
}

/* 摄像头控制按钮 - 右下角 */
.camera-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
}

.camera-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.camera-toggle-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.camera-toggle-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.camera-on {
  background: rgba(255, 77, 79, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.camera-off {
  background: rgba(82, 196, 26, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn-text {
  font-weight: 500;
}

/* 加载状态 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.95);
  padding: 24px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误提示 */
.error-overlay {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(255, 242, 240, 0.95);
  border: 1px solid rgba(255, 204, 199, 0.8);
  border-radius: 12px;
  color: #cf1322;
  font-size: 14px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.error-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.error-close-btn {
  background: none;
  border: none;
  color: #cf1322;
  font-size: 18px;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.error-close-btn:hover {
  background: rgba(207, 19, 34, 0.1);
}

/* 内容插槽 */
.content-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: none;
}

.content-overlay > * {
  pointer-events: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-interviewer-avatar {
    top: 10px;
    right: 10px;
    padding: 8px;
  }
  
  .avatar-container {
    gap: 8px;
  }
  
  .avatar-image {
    width: 40px;
    height: 40px;
  }
  
  .avatar-image svg {
    width: 20px;
    height: 20px;
  }
  
  .ai-name {
    font-size: 12px;
  }
  
  .ai-status {
    font-size: 10px;
  }
  
  .camera-controls {
    bottom: 10px;
    right: 10px;
  }
  
  .camera-toggle-btn {
    padding: 10px 16px;
    font-size: 12px;
  }
  
  .btn-icon {
    width: 16px;
    height: 16px;
  }
}
</style> 