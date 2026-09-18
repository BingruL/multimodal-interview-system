// RTC断开连接测试脚本
console.log('=== RTC断开连接测试 ===');

// 模拟RTC引擎状态
const mockRTCEngine = {
  getConnectionState: () => 'CONNECTED',
  stopAudioCapture: async () => {
    console.log('✅ 音频捕获已停止');
  },
  unpublishStream: (mediaType) => {
    console.log('✅ 音频流已取消发布, mediaType:', mediaType);
  },
  leaveRoom: async () => {
    console.log('✅ 已离开房间');
  }
};

// 模拟VERTC对象
const mockVERTC = {
  MediaType: {
    AUDIO: 1
  },
  destroyEngine: (engine) => {
    console.log('✅ RTC引擎已销毁');
  }
};

// 测试安全清理函数
async function testSafeCleanup() {
  console.log('\n--- 测试正常断开 ---');
  
  const rtcEngine = mockRTCEngine;
  const VERTC = mockVERTC;
  
  try {
    const state = rtcEngine.getConnectionState();
    console.log('RTC引擎状态:', state);
    
    if (state === 'CONNECTED' || state === 3) {
      await rtcEngine.stopAudioCapture();
      rtcEngine.unpublishStream(VERTC.MediaType?.AUDIO || 1);
      await rtcEngine.leaveRoom();
    }
    
    VERTC.destroyEngine(rtcEngine);
    console.log('✅ 正常断开测试通过');
  } catch (error) {
    console.error('❌ 正常断开测试失败:', error);
  }
}

// 测试异常情况
async function testErrorHandling() {
  console.log('\n--- 测试异常处理 ---');
  
  const errorRTCEngine = {
    getConnectionState: () => {
      throw new Error('not connected');
    },
    stopAudioCapture: async () => {
      throw new Error('stopAudioCapture failed');
    },
    unpublishStream: () => {
      throw new Error('unpublishStream failed');
    },
    leaveRoom: async () => {
      throw new Error('leaveRoom failed');
    }
  };
  
  const VERTC = mockVERTC;
  
  try {
    const state = errorRTCEngine.getConnectionState();
    console.log('RTC引擎状态:', state);
  } catch (error) {
    console.log('⚠️ 获取状态失败 (预期):', error.message);
  }
  
  try {
    await errorRTCEngine.stopAudioCapture();
  } catch (error) {
    console.log('⚠️ 停止音频捕获失败 (预期):', error.message);
  }
  
  try {
    errorRTCEngine.unpublishStream(1);
  } catch (error) {
    console.log('⚠️ 取消发布失败 (预期):', error.message);
  }
  
  try {
    await errorRTCEngine.leaveRoom();
  } catch (error) {
    console.log('⚠️ 离开房间失败 (预期):', error.message);
  }
  
  try {
    VERTC.destroyEngine(errorRTCEngine);
    console.log('✅ 异常处理测试通过');
  } catch (error) {
    console.log('⚠️ 销毁引擎失败 (预期):', error.message);
  }
}

// 运行测试
async function runTests() {
  await testSafeCleanup();
  await testErrorHandling();
  console.log('\n=== 测试完成 ===');
}

runTests(); 