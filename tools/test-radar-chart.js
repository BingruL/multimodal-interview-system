// 雷达图功能测试脚本
console.log('=== 雷达图功能测试 ===');

// 测试数据
const testScores = [85, 80, 75, 90, 70];
const testLabels = ['专业知识', '岗位技能', '语言表达', '逻辑思维', '抗压应变'];

console.log('测试数据:');
console.log('分数:', testScores);
console.log('标签:', testLabels);

// 模拟RadarChart组件的props
const props = {
  scores: testScores,
  labels: testLabels,
  size: 300
};

console.log('Props:', props);

// 测试数据验证
console.log('数据验证:');
console.log('- scores是否为数组:', Array.isArray(props.scores));
console.log('- labels是否为数组:', Array.isArray(props.labels));
console.log('- scores长度:', props.scores.length);
console.log('- labels长度:', props.labels.length);
console.log('- scores和labels长度是否匹配:', props.scores.length === props.labels.length);

// 测试分数范围
const validScores = props.scores.every(score => 
  typeof score === 'number' && score >= 0 && score <= 100
);
console.log('- 分数是否在有效范围内(0-100):', validScores);

// 测试size参数
console.log('- size是否为有效数字:', typeof props.size === 'number' && props.size > 0);

// 模拟Canvas API测试
console.log('\n=== Canvas API 测试 ===');

// 检查是否在浏览器环境中
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  console.log('浏览器环境检测: 通过');
  
  // 创建测试canvas
  const testCanvas = document.createElement('canvas');
  testCanvas.width = props.size;
  testCanvas.height = props.size;
  
  const testCtx = testCanvas.getContext('2d');
  console.log('Canvas上下文获取:', !!testCtx);
  
  if (testCtx) {
    // 测试基本绘制功能
    testCtx.fillStyle = 'rgba(102, 126, 234, 0.3)';
    testCtx.beginPath();
    testCtx.arc(props.size/2, props.size/2, 50, 0, 2 * Math.PI);
    testCtx.fill();
    console.log('基本绘制测试: 通过');
  }
} else {
  console.log('浏览器环境检测: 失败 (可能不在浏览器中)');
}

// 测试角度计算
console.log('\n=== 角度计算测试 ===');
const numPoints = props.labels.length;
for (let i = 0; i < numPoints; i++) {
  const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
  const x = Math.cos(angle) * 100;
  const y = Math.sin(angle) * 100;
  console.log(`点${i} (${props.labels[i]}): 角度=${angle.toFixed(2)}, x=${x.toFixed(2)}, y=${y.toFixed(2)}`);
}

// 测试标签位置计算
console.log('\n=== 标签位置计算测试 ===');
const radius = props.size / 2 + 40;
for (let i = 0; i < numPoints; i++) {
  const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
  const x = Math.cos(angle) * radius + props.size / 2;
  const y = Math.sin(angle) * radius + props.size / 2;
  console.log(`标签${i} (${props.labels[i]}): x=${x.toFixed(2)}, y=${y.toFixed(2)}`);
}

console.log('\n=== 测试完成 ===');
console.log('如果所有测试都通过，雷达图应该能正常显示');
console.log('请检查浏览器控制台是否有RadarChart组件的调试信息'); 