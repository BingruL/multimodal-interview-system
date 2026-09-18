// 雷达图布局修复测试脚本
console.log('=== 雷达图布局修复测试 ===');

// 测试数据
const testScores = [53, 40, 20, 50, 30];
const testLabels = ['专业知识', '岗位技能', '语言表达', '逻辑思维', '抗压应变'];

console.log('测试数据:', testScores);
console.log('标签:', testLabels);

// 检查布局结构
const checkLayout = () => {
  const elements = {
    'result-card': document.querySelector('.result-card'),
    'radar-chart-section': document.querySelector('.radar-chart-section'),
    'scores-details': document.querySelector('.scores-details'),
    'scores-grid': document.querySelector('.scores-grid')
  };
  
  console.log('\n布局元素检查:');
  Object.entries(elements).forEach(([name, element]) => {
    console.log(`${element ? '✓' : '✗'} ${name}: ${element ? '存在' : '缺失'}`);
  });
  
  return elements;
};

// 检查数据绑定
const checkData = () => {
  const scoreItems = document.querySelectorAll('.scores-grid .score-item');
  console.log(`\n分数项目数量: ${scoreItems.length}`);
  
  scoreItems.forEach((item, index) => {
    const label = item.querySelector('.score-label');
    const value = item.querySelector('.score-value');
    console.log(`项目${index + 1}: ${label?.textContent} ${value?.textContent}`);
  });
};

// 执行检查
if (typeof window !== 'undefined') {
  checkLayout();
  checkData();
  console.log('\n=== 修复完成 ===');
  console.log('布局现在应该与学习测试页面一致');
} else {
  console.log('请在浏览器控制台中运行');
} 