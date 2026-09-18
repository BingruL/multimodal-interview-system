// 测试字幕显示和跳转功能
console.log('=== 字幕显示和跳转功能测试 ===');

// 模拟字幕数据
const mockSubtitles = [
  { text: '您好，我是AI面试官，很高兴见到您。', user: 'AI', timestamp: '14:30:15' },
  { text: '您好，我是应聘者，很高兴参加这次面试。', user: 'User', timestamp: '14:30:20' },
  { text: '请简单介绍一下您的技术背景和工作经验。', user: 'AI', timestamp: '14:30:25' },
  { text: '我有3年的前端开发经验，主要使用Vue.js和React技术栈。', user: 'User', timestamp: '14:30:30' },
  { text: '很好，请详细说明一下您在项目中遇到的技术难点。', user: 'AI', timestamp: '14:30:35' }
];

// 模拟分析结果
const mockAnalysisResult = {
  feedbackData: {
    keyIssues: ['技术深度有待提升', '沟通能力良好', '项目经验丰富'],
    improvementSuggestions: ['建议深入学习系统设计', '继续保持团队协作精神', '可以尝试更多技术栈']
  },
  radarChartScores: [85, 80, 75, 90, 70],
  learningRecommendations: {
    professional_knowledge: [
      { title: 'Vue.js高级教程', link: 'https://example.com/vue' },
      { title: 'React性能优化', link: 'https://example.com/react' }
    ],
    communication_skills: [
      { title: '技术演讲技巧', link: 'https://example.com/speech' }
    ]
  }
};

console.log('模拟字幕数据:', mockSubtitles);
console.log('模拟分析结果:', mockAnalysisResult);

// 测试字幕显示功能
function testSubtitleDisplay() {
  console.log('\n--- 测试字幕显示功能 ---');
  
  // 检查字幕数据结构
  mockSubtitles.forEach((subtitle, index) => {
    console.log(`字幕 ${index + 1}:`, {
      id: `subtitle-${Date.now()}-${index}`,
      text: subtitle.text,
      user: subtitle.user,
      timestamp: subtitle.timestamp,
      isComplete: true
    });
  });
  
  console.log('字幕显示测试完成');
}

// 测试跳转功能
function testNavigation() {
  console.log('\n--- 测试跳转功能 ---');
  
  // 模拟事件发送
  console.log('发送 analysis-complete 事件');
  console.log('事件数据:', mockAnalysisResult);
  
  // 模拟页面跳转
  console.log('准备跳转到报告页面');
  console.log('跳转参数:', {
    feedbackData: mockAnalysisResult.feedbackData,
    radarChartScores: mockAnalysisResult.radarChartScores,
    learningRecommendations: mockAnalysisResult.learningRecommendations
  });
  
  console.log('跳转功能测试完成');
}

// 测试字幕开关功能
function testSubtitleToggle() {
  console.log('\n--- 测试字幕开关功能 ---');
  
  const subtitleEnabled = true;
  console.log('字幕开关状态:', subtitleEnabled);
  
  if (subtitleEnabled) {
    console.log('字幕已启用，应该显示字幕内容');
    console.log('字幕历史数量:', mockSubtitles.length);
    console.log('当前字幕:', '正在说话中...');
  } else {
    console.log('字幕已关闭，不显示字幕内容');
  }
  
  console.log('字幕开关测试完成');
}

// 执行测试
testSubtitleDisplay();
testNavigation();
testSubtitleToggle();

console.log('\n=== 测试完成 ===');
console.log('请检查浏览器控制台输出，确认功能正常');

// 提供调试建议
console.log('\n=== 调试建议 ===');
console.log('1. 检查字幕是否正确显示在对话区域');
console.log('2. 检查字幕开关是否正常工作');
console.log('3. 检查分析完成后是否正确跳转到Report.vue');
console.log('4. 检查控制台是否有错误信息');
console.log('5. 检查网络请求是否正常');

// 模拟实时字幕更新
let subtitleIndex = 0;
const realtimeSubtitleInterval = setInterval(() => {
  if (subtitleIndex < mockSubtitles.length) {
    const subtitle = mockSubtitles[subtitleIndex];
    console.log(`实时字幕更新 ${subtitleIndex + 1}:`, subtitle.text);
    subtitleIndex++;
  } else {
    clearInterval(realtimeSubtitleInterval);
    console.log('实时字幕更新完成');
  }
}, 2000); 