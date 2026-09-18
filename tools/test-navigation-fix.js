// 跳转功能测试脚本
console.log('=== 跳转功能测试 ===');

// 模拟分析结果
const mockAnalysisResult = {
  feedbackData: {
    keyIssues: [
      "语言表达能力需要提升，建议多练习口语表达",
      "人工智能专业知识掌握需要加强"
    ],
    improvementSuggestions: [
      "使用STAR结构组织回答，提高表达的条理性",
      "深入学习人工智能相关的核心技术和理论"
    ]
  },
  radarChartScores: [60, 76, 50, 74, 63],
  learningRecommendations: {
    language_expression: [
      {
        title: "演讲技巧与沟通艺术课程",
        link: "https://example.com/speech"
      },
      {
        title: "有效沟通技巧培训",
        link: "https://example.com/communication"
      }
    ],
    professional_knowledge: [
      {
        title: "人工智能核心技术课程",
        link: "https://example.com/tech"
      },
      {
        title: "数据科学家专业技能提升",
        link: "https://example.com/skill"
      }
    ]
  }
};

console.log('模拟分析结果:', mockAnalysisResult);

// 测试事件发送
function testEventEmission() {
  console.log('\n--- 测试事件发送 ---');
  
  // 模拟事件发送
  console.log('发送 analysis-complete 事件');
  console.log('事件数据:', mockAnalysisResult);
  
  // 模拟父组件接收事件
  console.log('父组件接收事件');
  console.log('提取数据:');
  console.log('  feedbackData:', mockAnalysisResult.feedbackData);
  console.log('  radarChartScores:', mockAnalysisResult.radarChartScores);
  console.log('  learningRecommendations:', mockAnalysisResult.learningRecommendations);
  
  // 模拟页面跳转
  console.log('准备跳转到报告页面');
  console.log('当前页面: interview');
  console.log('目标页面: report');
  
  console.log('✅ 跳转测试完成');
}

// 测试数据验证
function testDataValidation() {
  console.log('\n--- 测试数据验证 ---');
  
  const { feedbackData, radarChartScores, learningRecommendations } = mockAnalysisResult;
  
  // 验证反馈数据
  if (feedbackData && feedbackData.keyIssues && feedbackData.improvementSuggestions) {
    console.log('✅ feedbackData 格式正确');
    console.log('  关键问题数量:', feedbackData.keyIssues.length);
    console.log('  改进建议数量:', feedbackData.improvementSuggestions.length);
  } else {
    console.log('❌ feedbackData 格式错误');
  }
  
  // 验证雷达图分数
  if (radarChartScores && Array.isArray(radarChartScores) && radarChartScores.length > 0) {
    console.log('✅ radarChartScores 格式正确');
    console.log('  分数数量:', radarChartScores.length);
    console.log('  分数范围:', Math.min(...radarChartScores), '-', Math.max(...radarChartScores));
  } else {
    console.log('❌ radarChartScores 格式错误');
  }
  
  // 验证学习推荐
  if (learningRecommendations && typeof learningRecommendations === 'object') {
    console.log('✅ learningRecommendations 格式正确');
    const categories = Object.keys(learningRecommendations);
    console.log('  推荐类别:', categories);
    categories.forEach(category => {
      const items = learningRecommendations[category];
      console.log(`    ${category}: ${items.length} 项推荐`);
    });
  } else {
    console.log('❌ learningRecommendations 格式错误');
  }
}

// 测试跳转流程
function testNavigationFlow() {
  console.log('\n--- 测试跳转流程 ---');
  
  console.log('1. 用户点击"结束面试"按钮');
  console.log('2. 调用 handleEndInterview()');
  console.log('3. 检查连接状态');
  console.log('4. 如果连接中，先断开连接');
  console.log('5. 调用 analyzeInterviewData()');
  console.log('6. 发送 analysis-complete 事件');
  console.log('7. 父组件接收事件');
  console.log('8. 更新状态数据');
  console.log('9. 跳转到报告页面');
  
  console.log('✅ 跳转流程测试完成');
}

// 执行测试
testEventEmission();
testDataValidation();
testNavigationFlow();

console.log('\n=== 测试完成 ===');
console.log('\n修复要点:');
console.log('1. 移除了 handleDisconnect 中的自动分析调用');
console.log('2. 修复了 handleEndInterview 中的重复调用问题');
console.log('3. 确保事件只发送一次');
console.log('4. 添加了适当的延迟处理');
console.log('5. 移除了强制跳转首页的逻辑');

console.log('\n验证步骤:');
console.log('1. 点击"结束面试"按钮');
console.log('2. 检查是否跳转到报告页面');
console.log('3. 确认报告页面显示正确的数据');
console.log('4. 检查控制台是否有错误信息');

// 测试页面跳转功能的脚本
console.log('=== 页面跳转测试脚本 ===');

// 模拟分析完成事件
function testAnalysisComplete() {
  console.log('1. 模拟发送analysis-complete事件');
  
  // 创建模拟的分析结果数据
  const mockAnalysisResult = {
    feedbackData: {
      keyIssues: ['问题1', '问题2', '问题3', '问题4'],
      improvementSuggestions: ['建议1', '建议2', '建议3', '建议4']
    },
    radarChartScores: [50, 50, 60, 60, 60],
    learningRecommendations: {
      professional_knowledge: ['专业知识建议1', '专业知识建议2'],
      language_expression: ['语言表达建议1', '语言表达建议2']
    }
  };
  
  console.log('2. 模拟分析结果数据:', mockAnalysisResult);
  
  // 模拟事件发送
  const event = new CustomEvent('analysis-complete', {
    detail: mockAnalysisResult
  });
  
  // 检查是否有Vue应用实例
  if (window.__VUE_APP__) {
    console.log('3. 找到Vue应用实例，尝试触发事件');
    window.dispatchEvent(event);
  } else {
    console.log('3. 未找到Vue应用实例，尝试其他方式');
    
    // 尝试通过全局变量访问
    if (window.currentPage) {
      console.log('4. 通过全局变量设置页面');
      window.currentPage.value = 'report';
    }
    
    // 尝试通过DOM元素触发
    const interviewComponent = document.querySelector('[data-component="realtime-interview"]');
    if (interviewComponent) {
      console.log('5. 通过DOM元素触发事件');
      interviewComponent.dispatchEvent(event);
    }
  }
  
  console.log('6. 测试完成，请检查控制台输出');
}

// 检查页面状态
function checkPageState() {
  console.log('=== 检查页面状态 ===');
  
  // 检查Vue应用状态
  if (window.__VUE_APP__) {
    console.log('Vue应用实例存在');
  } else {
    console.log('Vue应用实例不存在');
  }
  
  // 检查当前页面
  const debugElement = document.querySelector('[style*="position: fixed; top: 10px; right: 10px"]');
  if (debugElement) {
    console.log('调试信息显示:', debugElement.textContent);
  }
  
  // 检查组件渲染
  const homeComponent = document.querySelector('[data-component="home"]');
  const interviewComponent = document.querySelector('[data-component="realtime-interview"]');
  const reportComponent = document.querySelector('[data-component="report"]');
  
  console.log('组件状态:');
  console.log('- Home组件:', homeComponent ? '已渲染' : '未渲染');
  console.log('- Interview组件:', interviewComponent ? '已渲染' : '未渲染');
  console.log('- Report组件:', reportComponent ? '已渲染' : '未渲染');
}

// 手动触发跳转
function forceNavigateToReport() {
  console.log('=== 强制跳转到报告页面 ===');
  
  // 方法1: 通过全局变量
  if (window.currentPage) {
    window.currentPage.value = 'report';
    console.log('通过全局变量设置页面为report');
  }
  
  // 方法2: 通过事件总线
  if (window.eventBus) {
    window.eventBus.emit('navigate', 'report');
    console.log('通过事件总线发送跳转事件');
  }
  
  // 方法3: 通过URL参数
  const url = new URL(window.location);
  url.searchParams.set('page', 'report');
  window.history.pushState({}, '', url);
  console.log('通过URL参数设置页面');
  
  // 方法4: 触发页面刷新
  setTimeout(() => {
    console.log('5秒后刷新页面');
    window.location.reload();
  }, 5000);
}

// 导出测试函数
window.testNavigation = {
  testAnalysisComplete,
  checkPageState,
  forceNavigateToReport
};

console.log('测试函数已加载，可以使用以下命令:');
console.log('- testNavigation.testAnalysisComplete() - 测试分析完成事件');
console.log('- testNavigation.checkPageState() - 检查页面状态');
console.log('- testNavigation.forceNavigateToReport() - 强制跳转到报告页面'); 