# 独立摄像头功能使用说明

## 功能概述

本项目已集成独立的摄像头功能，与Coze API完全分离，提供类似微信的摄像头开关体验。

## 主要特性

### ✅ 已实现功能
- **独立摄像头控制**: 完全独立的摄像头组件，不依赖Coze API
- **开启/关闭切换**: 类似微信的摄像头开关按钮
- **实时视频显示**: 摄像头开启时显示实时视频画面
- **权限管理**: 自动处理摄像头权限请求
- **错误处理**: 完善的错误提示和状态反馈
- **响应式设计**: 支持移动端和桌面端

### 🎯 使用场景
- 面试过程中展示用户形象
- 录制面试视频（可扩展）
- 实时视频分析（可扩展）

## 组件结构

### 1. SimpleCamera.vue
独立摄像头组件，提供以下功能：
- 摄像头开启/关闭
- 实时视频显示
- 状态指示器
- 错误处理

### 2. FullscreenCamera.vue
全屏摄像头背景组件，类似微信聊天界面：
- 全屏摄像头背景
- 右上角AI面试官头像
- 右下角摄像头控制按钮
- 毛玻璃效果控制面板
- 内容插槽支持

### 3. CameraTest.vue
摄像头功能测试页面，用于验证摄像头功能。

### 4. FullscreenCameraTest.vue
全屏摄像头测试页面，用于验证全屏摄像头功能。

### 5. RealtimeInterview.vue
集成全屏摄像头组件的面试页面。

## 使用方法

### 1. 基本使用
```vue
<template>
  <SimpleCamera ref="cameraRef" />
</template>

<script setup>
import SimpleCamera from './SimpleCamera.vue';

const cameraRef = ref(null);

// 开启摄像头
const enableCamera = async () => {
  await cameraRef.value.enableCamera();
};

// 关闭摄像头
const disableCamera = () => {
  cameraRef.value.disableCamera();
};

// 切换摄像头状态
const toggleCamera = () => {
  cameraRef.value.toggleCamera();
};
</script>
```

### 2. 全屏摄像头使用
```vue
<template>
  <FullscreenCamera ref="cameraRef">
    <!-- 在这里放置您的聊天界面或其他内容 -->
    <div class="chat-interface">
      <!-- 聊天内容 -->
    </div>
  </FullscreenCamera>
</template>

<script setup>
import FullscreenCamera from './FullscreenCamera.vue';

const cameraRef = ref(null);

// 控制摄像头
const toggleCamera = () => {
  cameraRef.value.toggleCamera();
};
</script>
```

### 3. 在面试页面中使用
全屏摄像头组件已集成到 `RealtimeInterview.vue` 中：
- 摄像头作为全屏背景
- 右上角显示AI面试官头像
- 右下角有摄像头控制按钮
- 毛玻璃效果的控制面板
- 支持在面试过程中随时开启/关闭

## 技术实现

### 核心技术
- **WebRTC getUserMedia API**: 获取摄像头视频流
- **HTML5 Video Element**: 显示实时视频
- **Vue 3 Composition API**: 组件状态管理

### 权限处理
```javascript
// 获取摄像头权限
const mediaStream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 640 },
    height: { ideal: 480 },
    facingMode: 'user' // 前置摄像头
  },
  audio: false // 不获取音频
});
```

### 错误处理
- `NotAllowedError`: 权限被拒绝
- `NotFoundError`: 未找到摄像头设备
- `NotReadableError`: 摄像头被占用
- 浏览器不支持摄像头功能

## 浏览器兼容性

### 支持的浏览器
- ✅ Chrome 53+
- ✅ Firefox 36+
- ✅ Safari 11+
- ✅ Edge 79+

### 移动端支持
- ✅ iOS Safari 11+
- ✅ Android Chrome 53+
- ✅ Android Firefox 36+

## 测试步骤

### 1. 启动项目
```bash
cd interview-web
npm run serve
```

### 2. 测试摄像头功能
1. 访问 `http://localhost:8080`
2. 点击"测试摄像头功能"按钮
3. 在测试页面中：
   - 点击"开启摄像头"测试权限请求
   - 点击"关闭摄像头"测试关闭功能
   - 点击"切换摄像头"测试切换功能

### 3. 测试全屏摄像头功能
1. 访问 `http://localhost:8080`
2. 点击"测试全屏摄像头"按钮
3. 在测试页面中：
   - 体验微信风格的全屏摄像头背景
   - 查看右上角AI面试官头像
   - 测试右下角摄像头控制按钮
   - 体验毛玻璃效果的控制面板

### 4. 在面试中使用
1. 选择面试领域和岗位
2. 进入面试页面
3. 体验全屏摄像头背景效果
4. 使用右下角按钮控制摄像头

## 常见问题

### Q: 摄像头无法开启
**A:** 检查以下几点：
1. 浏览器是否支持 `getUserMedia` API
2. 是否允许了摄像头权限
3. 摄像头是否被其他应用占用
4. 设备是否有摄像头

### Q: 权限被拒绝怎么办
**A:** 
1. 在浏览器地址栏点击摄像头图标
2. 选择"允许"摄像头访问
3. 刷新页面重试

### Q: 移动端摄像头不工作
**A:**
1. 确保使用HTTPS协议（本地开发除外）
2. 检查移动端浏览器是否支持
3. 确认设备摄像头权限

### Q: 视频画面模糊
**A:**
1. 检查摄像头分辨率设置
2. 调整视频容器大小
3. 检查网络连接质量

## 扩展功能

### 可扩展的功能
- **视频录制**: 添加录制功能
- **截图功能**: 添加拍照功能
- **滤镜效果**: 添加美颜等效果
- **多摄像头切换**: 支持前后摄像头切换
- **视频分析**: 集成AI视频分析

### 示例：添加录制功能
```javascript
// 在SimpleCamera组件中添加录制功能
const startRecording = () => {
  const mediaRecorder = new MediaRecorder(stream.value);
  const chunks = [];
  
  mediaRecorder.ondataavailable = (event) => {
    chunks.push(event.data);
  };
  
  mediaRecorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    // 处理录制的视频
  };
  
  mediaRecorder.start();
};
```

## 注意事项

1. **隐私保护**: 确保用户明确知道摄像头被使用
2. **性能优化**: 及时释放摄像头资源
3. **错误处理**: 提供友好的错误提示
4. **移动端适配**: 注意移动端的特殊需求
5. **浏览器兼容**: 测试不同浏览器的兼容性

## 更新日志

### v1.0.0 (2025-07-03)
- ✅ 实现基础摄像头功能
- ✅ 集成到面试页面
- ✅ 添加测试页面
- ✅ 完善错误处理
- ✅ 响应式设计支持

### v1.1.0 (2025-07-03)
- ✅ 实现全屏摄像头背景功能
- ✅ 添加AI面试官头像显示
- ✅ 毛玻璃效果控制面板
- ✅ 微信风格的界面设计
- ✅ 全屏摄像头测试页面 