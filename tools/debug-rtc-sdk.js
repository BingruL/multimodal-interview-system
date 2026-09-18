// 详细调试RTC SDK
const debugRTCLoading = async () => {
  try {
    console.log('=== 开始详细调试RTC SDK ===');
    
    // 1. 测试动态导入
    console.log('1. 测试动态导入...');
    const rtcModule = await import('@volcengine/rtc');
    console.log('RTC模块:', rtcModule);
    
    const VERTC = rtcModule.default;
    console.log('VERTC默认导出:', VERTC);
    
    // 2. 检查主要方法
    console.log('2. 检查主要方法...');
    console.log('createEngine:', typeof VERTC.createEngine);
    console.log('destroyEngine:', typeof VERTC.destroyEngine);
    
    // 3. 检查常量
    console.log('3. 检查常量...');
    console.log('MediaType:', VERTC.MediaType);
    console.log('RoomProfileType:', VERTC.RoomProfileType);
    console.log('events:', VERTC.events);
    
    // 4. 检查具体常量值
    if (VERTC.MediaType) {
      console.log('MediaType.AUDIO:', VERTC.MediaType.AUDIO);
      console.log('MediaType.VIDEO:', VERTC.MediaType.VIDEO);
    }
    
    if (VERTC.RoomProfileType) {
      console.log('RoomProfileType.chat:', VERTC.RoomProfileType.chat);
      console.log('RoomProfileType.live:', VERTC.RoomProfileType.live);
    }
    
    if (VERTC.events) {
      console.log('events.onError:', VERTC.events.onError);
      console.log('events.onUserJoined:', VERTC.events.onUserJoined);
      console.log('events.onUserLeave:', VERTC.events.onUserLeave);
    }
    
    // 5. 测试创建引擎
    console.log('4. 测试创建引擎...');
    try {
      const testEngine = VERTC.createEngine('test-app-id');
      console.log('引擎创建成功:', testEngine);
      
      // 检查引擎方法
      console.log('引擎方法:');
      console.log('- joinRoom:', typeof testEngine.joinRoom);
      console.log('- leaveRoom:', typeof testEngine.leaveRoom);
      console.log('- startAudioCapture:', typeof testEngine.startAudioCapture);
      console.log('- stopAudioCapture:', typeof testEngine.stopAudioCapture);
      console.log('- publishStream:', typeof testEngine.publishStream);
      console.log('- unpublishStream:', typeof testEngine.unpublishStream);
      console.log('- on:', typeof testEngine.on);
      
      // 清理测试引擎
      VERTC.destroyEngine(testEngine);
      console.log('测试引擎已清理');
      
    } catch (engineError) {
      console.error('引擎创建失败:', engineError);
    }
    
    // 6. 测试AI降噪扩展
    console.log('5. 测试AI降噪扩展...');
    try {
      const ainrModule = await import('@volcengine/rtc/extension-ainr');
      console.log('AI降噪扩展:', ainrModule);
      console.log('AI降噪默认导出:', ainrModule.default);
    } catch (ainrError) {
      console.warn('AI降噪扩展导入失败:', ainrError);
    }
    
    console.log('=== RTC SDK调试完成 ===');
    return true;
    
  } catch (error) {
    console.error('RTC SDK调试失败:', error);
    return false;
  }
};

// 在浏览器控制台中运行
if (typeof window !== 'undefined') {
  window.debugRTCLoading = debugRTCLoading;
  console.log('RTC SDK调试函数已加载，请在控制台运行: debugRTCLoading()');
} else {
  console.log('请在浏览器环境中运行此脚本');
} 