<template>
  <div class="radar-chart-container">
    <canvas ref="canvas" class="radar-canvas"></canvas>
    
    <!-- 文字标签 -->
    <div class="label-labels">
      <div 
        v-for="(label, index) in labels" 
        :key="`label-${index}`"
        class="label-item"
        :style="getLabelPosition(index)"
      >
        <span class="label-text">{{ label }}</span>
      </div>
    </div>
    
    <!-- 数值标签 -->
    <div class="score-labels">
      <div 
        v-for="(score, index) in scores" 
        :key="`score-${index}`"
        class="score-item"
        :style="getScorePosition(index)"
      >
        <span class="score-value">{{ score }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

const props = defineProps({
  scores: {
    type: Array,
    required: true,
    default: () => [85, 80, 75, 90, 70]
  },
  labels: {
    type: Array,
    required: true,
    default: () => ['专业知识', '岗位技能', '语言表达', '逻辑思维', '抗压应变']
  },
  size: {
    type: Number,
    default: 300
  }
});

const canvas = ref(null);
let ctx = null;

// 计算标签位置
const getLabelPosition = (index) => {
  const angle = (index * 2 * Math.PI) / props.labels.length - Math.PI / 2;
  const radius = props.size / 2 + 40;
  const x = Math.cos(angle) * radius + props.size / 2;
  const y = Math.sin(angle) * radius + props.size / 2;
  
  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: 'translate(-50%, -50%)'
  };
};

// 计算数值标签位置（更靠近雷达图）
const getScorePosition = (index) => {
  const angle = (index * 2 * Math.PI) / props.labels.length - Math.PI / 2;
  const radius = props.size / 2 + 20; // 比文字标签更靠近雷达图
  const x = Math.cos(angle) * radius + props.size / 2;
  const y = Math.sin(angle) * radius + props.size / 2;
  
  return {
    left: `${x}px`,
    top: `${y}px`,
    transform: 'translate(-50%, -50%)'
  };
};

// 绘制雷达图
const drawRadarChart = () => {
  console.log('RadarChart - 开始绘制雷达图');
  console.log('RadarChart - scores:', props.scores);
  console.log('RadarChart - labels:', props.labels);
  console.log('RadarChart - size:', props.size);
  
  if (!ctx) {
    console.warn('RadarChart - ctx未初始化');
    return;
  }
  
  const centerX = props.size / 2;
  const centerY = props.size / 2;
  const maxRadius = props.size / 2 - 20;
  const numPoints = props.labels.length;
  
  console.log('RadarChart - 绘制参数:', { centerX, centerY, maxRadius, numPoints });
  
  // 清空画布
  ctx.clearRect(0, 0, props.size, props.size);
  
  // 绘制背景网格
  drawGrid(centerX, centerY, maxRadius, numPoints);
  
  // 绘制数据区域
  drawDataArea(centerX, centerY, maxRadius, numPoints);
  
  // 绘制数据点
  drawDataPoints(centerX, centerY, maxRadius, numPoints);
  
  console.log('RadarChart - 雷达图绘制完成');
};

// 绘制网格
const drawGrid = (centerX, centerY, maxRadius, numPoints) => {
  ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)';
  ctx.lineWidth = 1;
  
  // 绘制同心圆
  for (let i = 1; i <= 5; i++) {
    const radius = (maxRadius * i) / 5;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
  
  // 绘制放射线
  for (let i = 0; i < numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
    const x = centerX + Math.cos(angle) * maxRadius;
    const y = centerY + Math.sin(angle) * maxRadius;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
};

// 绘制数据区域
const drawDataArea = (centerX, centerY, maxRadius, numPoints) => {
  const points = [];
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
    const score = props.scores[i];
    const radius = (maxRadius * score) / 100;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    points.push({ x, y });
  }
  
  // 绘制填充区域
  ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  
  ctx.closePath();
  ctx.fill();
  
  // 绘制边框
  ctx.strokeStyle = 'rgba(102, 126, 234, 0.8)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  
  ctx.closePath();
  ctx.stroke();
};

// 绘制数据点
const drawDataPoints = (centerX, centerY, maxRadius, numPoints) => {
  ctx.fillStyle = 'rgba(102, 126, 234, 1)';
  
  for (let i = 0; i < numPoints; i++) {
    const angle = (i * 2 * Math.PI) / numPoints - Math.PI / 2;
    const score = props.scores[i];
    const radius = (maxRadius * score) / 100;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    // 绘制圆点
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // 绘制白色内圈
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'rgba(102, 126, 234, 1)';
  }
};

// 监听数据变化
watch(() => props.scores, () => {
  nextTick(() => {
    drawRadarChart();
  });
}, { deep: true });

onMounted(() => {
  console.log('RadarChart - 组件挂载');
  console.log('RadarChart - canvas ref:', canvas.value);
  
  if (canvas.value) {
    ctx = canvas.value.getContext('2d');
    canvas.value.width = props.size;
    canvas.value.height = props.size;
    console.log('RadarChart - canvas尺寸设置:', props.size, 'x', props.size);
    console.log('RadarChart - ctx获取成功:', !!ctx);
    drawRadarChart();
  } else {
    console.error('RadarChart - canvas ref未找到');
  }
});
</script>

<style scoped>
.radar-chart-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.radar-canvas {
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.label-labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.label-item {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.score-labels {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.score-item {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.label-text {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 8px;
  border-radius: 12px;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.score-value {
  font-size: 14px;
  font-weight: 700;
  color: #667eea;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 6px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .radar-chart-container {
    transform: scale(0.8);
  }
  
  .label-text {
    font-size: 10px;
    padding: 2px 6px;
  }
  
  .score-value {
    font-size: 12px;
    padding: 1px 4px;
  }
}

@media (max-width: 480px) {
  .radar-chart-container {
    transform: scale(0.7);
  }
}
</style>