// 测试Report页面跳转和数据填充的脚本
console.log('=== Report页面跳转测试脚本 ===');

// 模拟分析结果数据
const mockAnalysisResult = {
  feedbackData: {
    keyIssues: [
      '技术深度有待提升，建议深入学习相关技术原理',
      '项目经验描述不够具体，建议提供更多实际案例',
      '沟通表达需要改进，建议提高语言组织能力',
      '问题解决思路不够清晰，建议加强逻辑思维训练'
    ],
    improvementSuggestions: [
      '建议参加相关技术培训课程，提升专业技能',
      '建议多参与实际项目，积累项目经验',
      '建议参加演讲培训，提高表达能力',
      '建议学习结构化思维方法，提升分析能力'
    ]
  },
  radarChartScores: [75, 80, 65, 85, 70],
  learningRecommendations: {
    professional_knowledge: [
      '深入学习Vue.js源码和原理',
      '掌握前端性能优化技术'
    ],
    language_expression: [
      '参加技术分享会，提高表达能力',
      '学习结构化面试技巧'
    ]
  }
};

// 测试页面跳转功能
function testReportNavigation() {
  console.log('1. 开始测试Report页面跳转');
  
  // 检查当前页面状态
  const debugElement = document.querySelector('[style*="position: fixed; top: 10px; right: 10px"]');
  if (debugElement) {
    console.log('当前页面:', debugElement.textContent);
  }
  
  // 检查Vue应用实例
  if (window.__VUE_APP__) {
    console.log('2. 找到Vue应用实例');
    
    // 尝试通过全局变量访问
    if (window.currentPage) {
      console.log('3. 通过全局变量设置页面为report');
      window.currentPage.value = 'report';
      console.log('页面已设置为report');
    }
    
    // 尝试通过事件触发
    console.log('4. 发送analysis-complete事件');
    const event = new CustomEvent('analysis-complete', {
      detail: mockAnalysisResult
    });
    window.dispatchEvent(event);
    
  } else {
    console.log('2. 未找到Vue应用实例，尝试其他方式');
    
    // 尝试通过DOM元素触发
    const interviewComponent = document.querySelector('[data-component="realtime-interview"]');
    if (interviewComponent) {
      console.log('3. 通过DOM元素触发事件');
      const event = new CustomEvent('analysis-complete', {
        detail: mockAnalysisResult
      });
      interviewComponent.dispatchEvent(event);
    }
  }
  
  console.log('5. 测试完成，请检查页面是否跳转到Report');
}

// 检查Report组件数据
function checkReportData() {
  console.log('=== 检查Report组件数据 ===');
  
  // 检查Report组件是否渲染
  const reportComponent = document.querySelector('[data-component="report"]');
  if (reportComponent) {
    console.log('Report组件已渲染');
  } else {
    console.log('Report组件未渲染');
  }
  
  // 检查数据是否显示
  const radarChart = document.querySelector('[data-component="radar-chart"]');
  if (radarChart) {
    console.log('雷达图组件已渲染');
  } else {
    console.log('雷达图组件未渲染');
  }
  
  // 检查关键问题是否显示
  const keyIssues = document.querySelectorAll('li');
  console.log('找到的列表项数量:', keyIssues.length);
  
  // 检查按钮是否显示
  const buttons = document.querySelectorAll('button');
  console.log('找到的按钮数量:', buttons.length);
  
  // 检查标题是否显示
  const title = document.querySelector('h1');
  if (title) {
    console.log('页面标题:', title.textContent);
  }
}

// 手动设置页面状态
function forceSetPageToReport() {
  console.log('=== 强制设置页面为Report ===');
  
  // 方法1: 通过URL参数
  const url = new URL(window.location);
  url.searchParams.set('page', 'report');
  window.history.pushState({}, '', url);
  console.log('已设置URL参数');
  
  // 方法2: 通过localStorage
  localStorage.setItem('currentPage', 'report');
  console.log('已设置localStorage');
  
  // 方法3: 通过全局变量
  if (window.currentPage) {
    window.currentPage.value = 'report';
    console.log('已设置全局变量');
  }
  
  // 方法4: 触发页面刷新
  setTimeout(() => {
    console.log('3秒后刷新页面');
    window.location.reload();
  }, 3000);
}

// 验证数据格式
function validateAnalysisData() {
  console.log('=== 验证分析数据格式 ===');
  
  console.log('模拟分析结果:', mockAnalysisResult);
  
  // 检查必要字段
  const requiredFields = ['feedbackData', 'radarChartScores', 'learningRecommendations'];
  const missingFields = requiredFields.filter(field => !mockAnalysisResult[field]);
  
  if (missingFields.length > 0) {
    console.error('缺少必要字段:', missingFields);
  } else {
    console.log('所有必要字段都存在');
  }
  
  // 检查feedbackData结构
  if (mockAnalysisResult.feedbackData) {
    const feedbackFields = ['keyIssues', 'improvementSuggestions'];
    const missingFeedbackFields = feedbackFields.filter(field => !mockAnalysisResult.feedbackData[field]);
    
    if (missingFeedbackFields.length > 0) {
      console.error('feedbackData缺少字段:', missingFeedbackFields);
    } else {
      console.log('feedbackData结构完整');
    }
  }
  
  // 检查雷达图数据
  if (mockAnalysisResult.radarChartScores) {
    console.log('雷达图分数:', mockAnalysisResult.radarChartScores);
    console.log('分数数量:', mockAnalysisResult.radarChartScores.length);
  }
  
  // 检查学习推荐
  if (mockAnalysisResult.learningRecommendations) {
    console.log('学习推荐:', mockAnalysisResult.learningRecommendations);
  }
}

// 导出测试函数
window.testReport = {
  testReportNavigation,
  checkReportData,
  forceSetPageToReport,
  validateAnalysisData,
  mockAnalysisResult
};

console.log('Report测试函数已加载，可以使用以下命令:');
console.log('- testReport.testReportNavigation() - 测试页面跳转');
console.log('- testReport.checkReportData() - 检查Report组件数据');
console.log('- testReport.forceSetPageToReport() - 强制设置页面为Report');
console.log('- testReport.validateAnalysisData() - 验证分析数据格式');
console.log('- testReport.mockAnalysisResult - 查看模拟分析结果数据'); 