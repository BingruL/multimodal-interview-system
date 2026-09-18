<template>
  <div class="camera-container">
    <!-- 摄像头视频显示区域 -->
    <div class="video-container" v-if="isCameraEnabled">
      <video 
        ref="videoElement" 
        autoplay 
        playsinline
        muted
        class="camera-video"
      ></video>
      <div class="camera-overlay">
        <div class="camera-status">
          <span class="status-dot"></span>
          摄像头已开启
        </div>
      </div>
    </div>
    
    <!-- 摄像头关闭时的占位区域 -->
    <div class="camera-placeholder" v-else>
      <div class="placeholder-content">
        <svg class="camera-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23 7V17C23 18.1046 22.1046 19 21 19H3C1.89543 19 1 18.1046 1 17V7C1 5.89543 1.89543 5 3 5H7L9 3H15L17 5H21C22.1046 5 23 5.89543 23 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
        </svg>
        <p class="placeholder-text">摄像头已关闭</p>
      </div>
    </div>
    
    <!-- 摄像头控制按钮 -->
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
      
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-indicator">
        <div class="loading-spinner"></div>
        <span>正在{{ isCameraEnabled ? '关闭' : '开启' }}摄像头...</span>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-message">
      <svg class="error-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

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
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user' // 使用前置摄像头
      },
      audio: false // 不获取音频
    });

    stream.value = mediaStream;
    
    // 将视频流绑定到video元素
    if (videoElement.value) {
      videoElement.value.srcObject = mediaStream;
    }
    
    isCameraEnabled.value = true;
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
.camera-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 400px;
}

.video-container {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}

.camera-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #52c41a;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.camera-placeholder {
  width: 100%;
  height: 300px;
  border-radius: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #666;
}

.camera-icon {
  width: 48px;
  height: 48px;
  color: #999;
}

.placeholder-text {
  font-size: 14px;
  margin: 0;
}

.camera-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.camera-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
}

.camera-toggle-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.camera-toggle-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.camera-on {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  color: white;
}

.camera-off {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  color: white;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn-text {
  font-weight: 500;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  color: #cf1322;
  font-size: 12px;
  max-width: 100%;
}

.error-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .camera-container {
    max-width: 100%;
  }
  
  .video-container,
  .camera-placeholder {
    height: 250px;
  }
  
  .camera-toggle-btn {
    min-width: 140px;
    padding: 10px 20px;
  }
}
</style> 