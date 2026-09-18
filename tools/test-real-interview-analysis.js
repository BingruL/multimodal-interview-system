// 测试真实通话结束后的分析流程
console.log('=== 测试真实通话结束后的分析流程 ===');

// 模拟真实通话结束流程
function testRealInterviewEnd() {
  console.log('1. 开始测试真实通话结束流程');
  
  // 检查当前状态
  const isConnected = document.querySelector('.connection-status')?.textContent?.includes('已连接');
  console.log('当前连接状态:', isConnected ? '已连接' : '未连接');
  
  // 检查是否有结束面试按钮
  const endInterviewBtn = document.querySelector('.end-interview-button');
  if (endInterviewBtn) {
    console.log('✅ 找到结束面试按钮');
    
    // 模拟点击结束面试按钮
    console.log('2. 模拟点击结束面试按钮');
    endInterviewBtn.click();
    
    // 延迟检查分析流程
    setTimeout(() => {
      console.log('3. 检查分析流程是否启动');
      checkAnalysisProcess();
    }, 2000);
    
  } else {
    console.log('❌ 未找到结束面试按钮');
  }
}

// 检查分析流程
function checkAnalysisProcess() {
  console.log('4. 检查分析流程状态');
  
  // 检查是否有加载消息
  const loadingMessage = document.querySelector('.ant-message-notice');
  if (loadingMessage) {
    console.log('✅ 检测到加载消息');
  } else {
    console.log('❌ 未检测到加载消息');
  }
  
  // 检查分析结果页面是否显示
  setTimeout(() => {
    const analysisPage = document.querySelector('.analysis-result-page');
    if (analysisPage) {
      console.log('✅ 分析结果页面已显示');
      
      // 检查分析结果内容
      const title = analysisPage.querySelector('.analysis-title');
      if (title) {
        console.log('✅ 分析结果标题:', title.textContent);
      }
      
      const issues = analysisPage.querySelectorAll('.issue-item');
      console.log('✅ 关键问题数量:', issues.length);
      
      const suggestions = analysisPage.querySelectorAll('.suggestion-item');
      console.log('✅ 改进建议数量:', suggestions.length);
      
    } else {
      console.log('❌ 分析结果页面未显示');
      
      // 检查是否还在面试页面
      const interviewControls = document.querySelector('.interview-controls');
      if (interviewControls) {
        console.log('⚠️ 仍在面试页面，分析可能失败');
      }
    }
  }, 5000); // 等待5秒让分析完成
}

// 模拟真实通话数据
function simulateRealConversation() {
  console.log('5. 模拟真实通话数据');
  
  // 添加一些模拟的对话消息
  const mockMessages = [
    '您好，我是AI面试官，很高兴见到您。',
    '您好，我是应聘者，很高兴参加这次面试。',
    '请简单介绍一下您的技术背景和工作经验。',
    '我有3年的前端开发经验，主要使用Vue.js和React技术栈。',
    '很好，请详细说明一下您在项目中遇到的技术难点。',
    '在最近的项目中，我遇到了大数据量渲染的性能问题。',
    '您的回答很专业，请问您对团队协作有什么看法？',
    '我认为团队协作是项目成功的关键，我习惯使用Git进行版本控制。'
  ];
  
  console.log('模拟对话消息:', mockMessages);
  
  // 尝试通过组件实例设置消息
  const components = document.querySelectorAll('[data-component]');
  components.forEach(component => {
    if (component.__vueParentComponent) {
      const instance = component.__vueParentComponent.ctx;
      if (instance && instance.messageList) {
        instance.messageList = mockMessages;
        console.log('✅ 已设置模拟对话消息');
      }
    }
  });
}

// 检查分析函数调用
function checkAnalysisFunction() {
  console.log('6. 检查分析函数调用');
  
  // 检查handleAnalysisComplete函数是否存在
  const components = document.querySelectorAll('[data-component]');
  components.forEach(component => {
    if (component.__vueParentComponent) {
      const instance = component.__vueParentComponent.ctx;
      if (instance) {
        console.log('组件实例方法:', Object.keys(instance));
        
        if (instance.handleAnalysisComplete) {
          console.log('✅ handleAnalysisComplete函数存在');
        } else {
          console.log('❌ handleAnalysisComplete函数不存在');
        }
        
        if (instance.analyzeInterviewData) {
          console.log('✅ analyzeInterviewData函数存在');
        } else {
          console.log('❌ analyzeInterviewData函数不存在');
        }
      }
    }
  });
}

// 手动触发分析
function manualTriggerAnalysis() {
  console.log('7. 手动触发分析');
  
  // 尝试直接调用分析函数
  const components = document.querySelectorAll('[data-component]');
  components.forEach(component => {
    if (component.__vueParentComponent) {
      const instance = component.__vueParentComponent.ctx;
      if (instance && instance.analyzeInterviewData) {
        console.log('✅ 手动调用analyzeInterviewData函数');
        instance.analyzeInterviewData();
      }
    }
  });
}

// 检查错误信息
function checkErrors() {
  console.log('8. 检查错误信息');
  
  // 检查控制台错误
  console.log('请检查控制台是否有错误信息');
  
  // 检查网络请求
  const networkRequests = performance.getEntriesByType('resource');
  const apiRequests = networkRequests.filter(req => 
    req.name.includes('api') || req.name.includes('analyze')
  );
  
  if (apiRequests.length > 0) {
    console.log('API请求:', apiRequests);
  } else {
    console.log('未检测到API请求');
  }
}

// 导出测试函数
window.testRealInterview = {
  testEnd: testRealInterviewEnd,
  checkProcess: checkAnalysisProcess,
  simulateConversation: simulateRealConversation,
  checkFunction: checkAnalysisFunction,
  manualTrigger: manualTriggerAnalysis,
  checkErrors: checkErrors
};

console.log('真实通话分析测试脚本已加载，可以使用以下命令:');
console.log('- testRealInterview.testEnd() - 测试真实通话结束流程');
console.log('- testRealInterview.checkProcess() - 检查分析流程');
console.log('- testRealInterview.simulateConversation() - 模拟真实通话数据');
console.log('- testRealInterview.checkFunction() - 检查分析函数');
console.log('- testRealInterview.manualTrigger() - 手动触发分析');
console.log('- testRealInterview.checkErrors() - 检查错误信息'); 