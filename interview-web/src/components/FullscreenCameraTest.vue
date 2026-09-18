<template>
  <FullscreenCamera ref="cameraRef">
    <!-- 测试控制面板 -->
    <div class="test-controls">
      <div class="control-panel">
        <h1 class="test-title">全屏摄像头测试</h1>
        <p class="test-subtitle">测试微信风格的全屏摄像头背景</p>
        
        <div class="control-buttons">
          <button 
            @click="enableCamera"
            class="test-btn enable-btn"
          >
            开启摄像头
          </button>
          <button 
            @click="disableCamera"
            class="test-btn disable-btn"
          >
            关闭摄像头
          </button>
          <button 
            @click="toggleCamera"
            class="test-btn toggle-btn"
          >
            切换摄像头
          </button>
        </div>
        
        <div class="status-info">
          <div class="status-item">
            <span class="status-label">摄像头状态:</span>
            <span class="status-value" :class="{ 'active': isCameraEnabled }">
              {{ isCameraEnabled ? '已开启' : '已关闭' }}
            </span>
          </div>
          <div class="status-item">
            <span class="status-label">浏览器支持:</span>
            <span class="status-value" :class="{ 'active': browserSupport }">
              {{ browserSupport ? '支持' : '不支持' }}
            </span>
          </div>
          <div class="status-item">
            <span class="status-label">权限状态:</span>
            <span class="status-value">{{ permissionStatus }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 功能说明
    <div class="feature-info">
      <div class="info-panel">
        <h3>功能特性</h3>
        <ul class="feature-list">
          <li>✅ 全屏摄像头背景，类似微信聊天</li>
          <li>✅ 右上角AI面试官头像</li>
          <li>✅ 右下角摄像头控制按钮</li>
          <li>✅ 毛玻璃效果控制面板</li>
          <li>✅ 响应式设计，支持移动端</li>
          <li>✅ 完善的错误处理和状态反馈</li>
        </ul>
      </div>
    </div> -->
    
    <!-- 返回按钮 -->
    <button
      @click="$emit('go-back')"
      class="back-button"
    >
      ← 返回
    </button>
  </FullscreenCamera>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FullscreenCamera from './FullscreenCamera.vue';

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
/* 测试控制面板样式 */
.test-controls {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  max-width: 400px;
}

.control-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.test-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px 0;
  text-align: center;
}

.test-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
  text-align: center;
}

.control-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.test-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.test-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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

.status-info {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  padding: 12px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.status-value {
  font-size: 12px;
  color: #999;
  font-weight: 600;
}

.status-value.active {
  color: #52c41a;
}

/* 功能说明样式 */
.feature-info {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  max-width: 300px;
}

.info-panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.info-panel h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
  text-align: center;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  font-size: 12px;
  color: #666;
  margin-bottom: 6px;
  padding-left: 0;
}

.feature-list li:last-child {
  margin-bottom: 0;
}

/* 返回按钮样式 */
.back-button {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  color: #666;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  font-size: 14px;
}

.back-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .test-controls {
    top: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
  }
  
  .control-panel {
    padding: 16px;
  }
  
  .test-title {
    font-size: 20px;
  }
  
  .feature-info {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .info-panel {
    padding: 12px;
  }
  
  .back-button {
    bottom: 10px;
    left: 10px;
    padding: 10px 16px;
    font-size: 12px;
  }
}
</style> 