// 测试RTC API调用
const testRTCApi = async () => {
  const RTC_PROXY_HOST = 'http://localhost:3001';
  
  try {
    console.log('测试获取场景配置...');
    
    const response = await fetch(`${RTC_PROXY_HOST}/getScenes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('API响应:', JSON.stringify(result, null, 2));
    
    // 检查数据结构
    if (result.Result && result.Result.scenes) {
      console.log('场景数据在Result字段中');
      const scenes = result.Result.scenes;
      if (scenes.length > 0) {
        console.log('第一个场景:', JSON.stringify(scenes[0], null, 2));
      }
    } else if (result.scenes) {
      console.log('场景数据在根级别');
      const scenes = result.scenes;
      if (scenes.length > 0) {
        console.log('第一个场景:', JSON.stringify(scenes[0], null, 2));
      }
    } else {
      console.log('未找到场景数据');
    }
    
  } catch (error) {
    console.error('测试失败:', error);
  }
};

// 在浏览器控制台中运行
if (typeof window !== 'undefined') {
  window.testRTCApi = testRTCApi;
  console.log('测试函数已加载，请在控制台运行: testRTCApi()');
} else {
  console.log('请在浏览器环境中运行此脚本');
} 