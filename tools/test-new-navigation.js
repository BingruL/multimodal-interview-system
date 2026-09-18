// 测试新的分析结果显示方式
console.log('=== 测试新的分析结果显示方式 ===');

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

// 测试新的分析结果显示
function testNewAnalysisDisplay() {
  console.log('1. 测试新的分析结果显示方式');
  
  // 检查RealtimeInterview组件是否存在
  const interviewComponent = document.querySelector('[data-component="realtime-interview"]');
  if (interviewComponent) {
    console.log('✅ 找到RealtimeInterview组件');
  } else {
    console.log('❌ 未找到RealtimeInterview组件');
    return;
  }
  
  // 检查分析结果页面是否显示
  const analysisPage = document.querySelector('.analysis-result-page');
  if (analysisPage) {
    console.log('✅ 分析结果页面已显示');
  } else {
    console.log('❌ 分析结果页面未显示');
  }
  
  // 检查分析结果数据
  const analysisCard = document.querySelector('.analysis-result-card');
  if (analysisCard) {
    console.log('✅ 分析结果卡片已渲染');
    
    // 检查各个部分
    const title = analysisCard.querySelector('.analysis-title');
    if (title) {
      console.log('✅ 标题已显示:', title.textContent);
    }
    
    const radarChart = analysisCard.querySelector('[data-component="radar-chart"]');
    if (radarChart) {
      console.log('✅ 雷达图已渲染');
    } else {
      console.log('❌ 雷达图未渲染');
    }
    
    const issues = analysisCard.querySelectorAll('.issue-item');
    console.log('✅ 关键问题数量:', issues.length);
    
    const suggestions = analysisCard.querySelectorAll('.suggestion-item');
    console.log('✅ 改进建议数量:', suggestions.length);
    
    const recommendations = analysisCard.querySelectorAll('.recommendation-item');
    console.log('✅ 学习推荐数量:', recommendations.length);
    
  } else {
    console.log('❌ 分析结果卡片未渲染');
  }
  
  // 检查按钮
  const backBtn = document.querySelector('.back-btn');
  const homeBtn = document.querySelector('.home-btn');
  
  if (backBtn) {
    console.log('✅ 返回面试按钮已显示');
  }
  
  if (homeBtn) {
    console.log('✅ 返回首页按钮已显示');
  }
}

// 模拟设置分析结果
function simulateAnalysisResult() {
  console.log('2. 模拟设置分析结果');
  
  // 尝试通过全局变量设置
  if (window.analysisResult) {
    window.analysisResult.value = mockAnalysisResult;
    console.log('✅ 通过全局变量设置分析结果');
  }
  
  // 尝试通过组件实例设置
  const components = document.querySelectorAll('[data-component]');
  components.forEach(component => {
    if (component.__vueParentComponent) {
      const instance = component.__vueParentComponent.ctx;
      if (instance && instance.analysisResult) {
        instance.analysisResult = mockAnalysisResult;
        instance.showAnalysisResult = true;
        console.log('✅ 通过组件实例设置分析结果');
      }
    }
  });
  
  // 尝试触发测试按钮
  const testBtn = document.querySelector('button[onclick*="testAnalysisComplete"]');
  if (testBtn) {
    console.log('✅ 找到测试分析完成按钮');
    testBtn.click();
  } else {
    console.log('❌ 未找到测试分析完成按钮');
  }
}

// 检查页面状态
function checkPageState() {
  console.log('3. 检查页面状态');
  
  // 检查当前显示的页面
  const analysisPage = document.querySelector('.analysis-result-page');
  const interviewPage = document.querySelector('.interview-controls');
  
  if (analysisPage && analysisPage.style.display !== 'none') {
    console.log('📄 当前显示: 分析结果页面');
  } else if (interviewPage && interviewPage.style.display !== 'none') {
    console.log('📄 当前显示: 面试页面');
  } else {
    console.log('📄 当前显示: 未知页面');
  }
  
  // 检查调试信息
  const debugElement = document.querySelector('[style*="position: fixed; top: 10px; right: 10px"]');
  if (debugElement) {
    console.log('🔍 调试信息:', debugElement.textContent);
  }
}

// 测试返回功能
function testBackFunction() {
  console.log('4. 测试返回功能');
  
  const backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    console.log('✅ 找到返回按钮，点击测试');
    backBtn.click();
    
    // 延迟检查状态
    setTimeout(() => {
      const analysisPage = document.querySelector('.analysis-result-page');
      if (analysisPage && analysisPage.style.display === 'none') {
        console.log('✅ 返回功能正常，已回到面试页面');
      } else {
        console.log('❌ 返回功能异常，仍在分析结果页面');
      }
    }, 100);
  } else {
    console.log('❌ 未找到返回按钮');
  }
}

// 导出测试函数
window.testNewNavigation = {
  testDisplay: testNewAnalysisDisplay,
  simulate: simulateAnalysisResult,
  checkState: checkPageState,
  testBack: testBackFunction,
  mockData: mockAnalysisResult
};

console.log('新的导航测试脚本已加载，可以使用以下命令:');
console.log('- testNewNavigation.testDisplay() - 测试分析结果显示');
console.log('- testNewNavigation.simulate() - 模拟设置分析结果');
console.log('- testNewNavigation.checkState() - 检查页面状态');
console.log('- testNewNavigation.testBack() - 测试返回功能');
console.log('- testNewNavigation.mockData - 查看模拟数据'); 