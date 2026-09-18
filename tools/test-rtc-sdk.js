// 测试RTC SDK加载
const testRTCLoading = async () => {
  try {
    console.log('开始测试RTC SDK加载...');
    
    // 测试动态导入
    const rtcModule = await import('@volcengine/rtc');
    console.log('RTC模块导入成功:', rtcModule);
    
    const VERTC = rtcModule.default;
    console.log('VERTC对象:', VERTC);
    console.log('createEngine方法:', typeof VERTC.createEngine);
    
    // 测试AI降噪扩展
    try {
      const ainrModule = await import('@volcengine/rtc/extension-ainr');
      console.log('AI降噪扩展导入成功:', ainrModule);
    } catch (ainrError) {
      console.warn('AI降噪扩展导入失败:', ainrError);
    }
    
    // 测试常量
    console.log('MediaType:', VERTC.MediaType);
    console.log('RoomProfileType:', VERTC.RoomProfileType);
    console.log('events:', VERTC.events);
    
    return true;
  } catch (error) {
    console.error('RTC SDK加载测试失败:', error);
    return false;
  }
};

// 在浏览器控制台中运行
if (typeof window !== 'undefined') {
  window.testRTCLoading = testRTCLoading;
  console.log('RTC SDK测试函数已加载，请在控制台运行: testRTCLoading()');
} else {
  console.log('请在浏览器环境中运行此脚本');
} 