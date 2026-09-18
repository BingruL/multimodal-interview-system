<template>
  <div class="ability-analysis-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="$emit('go-back')">
          <span class="back-icon">←</span>
          返回首页
        </button>
        <h1 class="page-title">📈 能力分析</h1>
        <div class="breadcrumb">首页 / 能力分析</div>
      </div>
      <div class="header-right">
        <div class="analysis-date">
          <span class="date-label">最后更新：</span>
          <span class="date-value">{{ formatDate(lastUpdateDate) }}</span>
        </div>
      </div>
    </div>

    <!-- 综合能力概览 -->
    <div class="overview-section">
      <div class="overview-card">
        <h2 class="section-title">🎯 综合能力评估</h2>
        <div class="overall-score">
          <div class="score-circle">
            <div class="score-inner">
              <span class="score-number">{{ overallScore }}</span>
              <span class="score-label">分</span>
            </div>
          </div>
          <div class="score-description">
            <h3 class="score-level">{{ getScoreLevel(overallScore) }}</h3>
            <p class="score-text">{{ getScoreDescription(overallScore) }}</p>
          </div>
        </div>
      </div>
      
      <div class="quick-stats">
        <div class="stat-card">
          <div class="stat-icon">🏆</div>
          <div class="stat-content">
            <div class="stat-number">{{ strongestSkill.score }}%</div>
            <div class="stat-label">最强技能</div>
            <div class="stat-detail">{{ strongestSkill.name }}</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <div class="stat-number">+{{ improvementRate }}%</div>
            <div class="stat-label">近期提升</div>
            <div class="stat-detail">相比上月</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🎯</div>
          <div class="stat-content">
            <div class="stat-number">{{ completedGoals }}/{{ totalGoals }}</div>
            <div class="stat-label">目标完成</div>
            <div class="stat-detail">本月进度</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 技能雷达图 -->
    <div class="radar-section">
      <div class="card">
        <h2 class="section-title">🕸️ 技能雷达图</h2>
        <div class="radar-container">
          <div class="radar-chart" ref="radarChart">
            <!-- 雷达图背景网格 -->
            <svg viewBox="0 0 300 300" class="radar-svg">
              <!-- 背景同心圆 -->
              <g class="radar-grid">
                <circle cx="150" cy="150" r="120" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                <circle cx="150" cy="150" r="90" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                <circle cx="150" cy="150" r="60" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                <circle cx="150" cy="150" r="30" fill="none" stroke="#e5e7eb" stroke-width="1"/>
              </g>
              
              <!-- 轴线 -->
              <g class="radar-axes">
                <line x1="150" y1="30" x2="150" y2="270" stroke="#e5e7eb" stroke-width="1"/>
                <line x1="30" y1="150" x2="270" y2="150" stroke="#e5e7eb" stroke-width="1"/>
                <line x1="67" y1="67" x2="233" y2="233" stroke="#e5e7eb" stroke-width="1"/>
                <line x1="233" y1="67" x2="67" y2="233" stroke="#e5e7eb" stroke-width="1"/>
              </g>
              
              <!-- 数据多边形 -->
              <polygon 
                :points="radarPoints" 
                fill="rgba(59, 130, 246, 0.2)" 
                stroke="#3b82f6" 
                stroke-width="2"
              />
              
              <!-- 数据点 -->
              <circle 
                v-for="(point, index) in radarPointsArray" 
                :key="index"
                :cx="point.x" 
                :cy="point.y" 
                r="4" 
                fill="#3b82f6"
              />
            </svg>
          </div>
          
          <div class="radar-legend">
            <div 
              v-for="(skill, index) in skillsData" 
              :key="skill.name"
              class="legend-item"
            >
              <div class="legend-color" :style="{ backgroundColor: getSkillColor(index) }"></div>
              <span class="legend-label">{{ skill.name }}</span>
              <span class="legend-value">{{ skill.score }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详细技能分析 -->
    <div class="skills-section">
      <div class="card">
        <h2 class="section-title">💪 技能详细分析</h2>
        <div class="skills-grid">
          <div 
            v-for="skill in skillsData" 
            :key="skill.name"
            class="skill-card"
          >
            <div class="skill-header">
              <div class="skill-info">
                <h3 class="skill-name">{{ skill.name }}</h3>
                <div class="skill-category">{{ skill.category }}</div>
              </div>
              <div class="skill-score" :class="getSkillScoreClass(skill.score)">
                {{ skill.score }}%
              </div>
            </div>
            
            <div class="skill-progress">
              <div class="progress-bar">
                <div 
                  class="progress-fill" 
                  :style="{ width: skill.score + '%', backgroundColor: getSkillColor(skillsData.indexOf(skill)) }"
                ></div>
              </div>
            </div>
            
            <div class="skill-details">
              <div class="skill-trend">
                <span class="trend-label">趋势：</span>
                <span class="trend-value" :class="skill.trend > 0 ? 'trend-up' : 'trend-down'">
                  {{ skill.trend > 0 ? '↗' : '↘' }} {{ Math.abs(skill.trend) }}%
                </span>
              </div>
              <div class="skill-level">
                <span class="level-label">水平：</span>
                <span class="level-value">{{ getSkillLevel(skill.score) }}</span>
              </div>
            </div>
            
            <div class="skill-suggestions">
              <h4 class="suggestions-title">提升建议：</h4>
              <ul class="suggestions-list">
                <li v-for="suggestion in skill.suggestions" :key="suggestion">
                  {{ suggestion }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习路径推荐 -->
    <div class="learning-section">
      <div class="card">
        <h2 class="section-title">🎓 个性化学习路径</h2>
        <div class="learning-paths">
          <div 
            v-for="path in learningPaths" 
            :key="path.id"
            class="learning-path"
          >
            <div class="path-header">
              <div class="path-icon">{{ path.icon }}</div>
              <div class="path-info">
                <h3 class="path-title">{{ path.title }}</h3>
                <div class="path-description">{{ path.description }}</div>
              </div>
              <div class="path-priority" :class="'priority-' + path.priority">
                {{ getPriorityText(path.priority) }}
              </div>
            </div>
            
            <div class="path-content">
              <div class="path-steps">
                <div 
                  v-for="(step, index) in path.steps" 
                  :key="index"
                  class="step-item"
                >
                  <div class="step-number">{{ index + 1 }}</div>
                  <div class="step-content">
                    <div class="step-title">{{ step.title }}</div>
                    <div class="step-duration">{{ step.duration }}</div>
                  </div>
                </div>
              </div>
              
              <div class="path-actions">
                <button class="start-learning-btn" @click="startLearningPath(path)">
                  开始学习
                </button>
                <button class="view-details-btn" @click="viewPathDetails(path)">
                  查看详情
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue';

defineEmits(['go-back']);

// 响应式数据
const lastUpdateDate = ref(new Date());
const overallScore = ref(85);
const improvementRate = ref(12);
const completedGoals = ref(7);
const totalGoals = ref(10);

// 技能数据
const skillsData = ref([
  {
    name: '技术能力',
    category: '专业技能',
    score: 88,
    trend: 5,
    suggestions: ['深入学习新技术栈', '参与开源项目', '阅读技术文档']
  },
  {
    name: '沟通表达',
    category: '软技能',
    score: 82,
    trend: 8,
    suggestions: ['参加演讲训练', '多参与团队讨论', '练习技术分享']
  },
  {
    name: '问题解决',
    category: '思维能力',
    score: 90,
    trend: 3,
    suggestions: ['练习算法题', '参与复杂项目', '学习设计模式']
  },
  {
    name: '团队协作',
    category: '软技能',
    score: 85,
    trend: 6,
    suggestions: ['参与跨部门项目', '学习项目管理', '提升领导力']
  },
  {
    name: '学习能力',
    category: '成长能力',
    score: 92,
    trend: 4,
    suggestions: ['建立知识体系', '定期总结反思', '分享学习心得']
  },
  {
    name: '抗压能力',
    category: '心理素质',
    score: 78,
    trend: -2,
    suggestions: ['学习压力管理', '培养兴趣爱好', '保持工作生活平衡']
  }
]);

// 学习路径数据
const learningPaths = ref([
  {
    id: 1,
    icon: '🚀',
    title: '前端技术进阶',
    description: '提升前端开发技能，掌握最新技术栈',
    priority: 'high',
    steps: [
      { title: 'Vue 3 深入学习', duration: '2周' },
      { title: 'TypeScript 实战', duration: '1周' },
      { title: '性能优化技巧', duration: '1周' },
      { title: '项目实战练习', duration: '2周' }
    ]
  },
  {
    id: 2,
    icon: '💬',
    title: '沟通技巧提升',
    description: '改善沟通表达能力，提高团队协作效率',
    priority: 'medium',
    steps: [
      { title: '演讲技巧训练', duration: '1周' },
      { title: '会议主持练习', duration: '1周' },
      { title: '跨部门沟通', duration: '2周' }
    ]
  },
  {
    id: 3,
    icon: '🧠',
    title: '算法思维强化',
    description: '提升逻辑思维和问题解决能力',
    priority: 'medium',
    steps: [
      { title: '数据结构复习', duration: '1周' },
      { title: '算法题练习', duration: '2周' },
      { title: '系统设计学习', duration: '2周' }
    ]
  },
  {
    id: 4,
    icon: '🎯',
    title: '压力管理训练',
    description: '提高抗压能力，保持工作效率',
    priority: 'low',
    steps: [
      { title: '时间管理技巧', duration: '1周' },
      { title: '冥想放松练习', duration: '1周' },
      { title: '工作生活平衡', duration: '1周' }
    ]
  }
]);

// 计算属性
const strongestSkill = computed(() => {
  return skillsData.value.reduce((max, skill) => 
    skill.score > max.score ? skill : max
  );
});

// 雷达图计算
const radarPoints = computed(() => {
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;
  
  const points = skillsData.value.map((skill, index) => {
    const angle = (index * 60 - 90) * Math.PI / 180; // 6个技能，每个60度
    const radius = (skill.score / 100) * maxRadius;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return `${x},${y}`;
  });
  
  return points.join(' ');
});

const radarPointsArray = computed(() => {
  const centerX = 150;
  const centerY = 150;
  const maxRadius = 120;
  
  return skillsData.value.map((skill, index) => {
    const angle = (index * 60 - 90) * Math.PI / 180;
    const radius = (skill.score / 100) * maxRadius;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y };
  });
});

// 方法
const formatDate = (date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getScoreLevel = (score) => {
  if (score >= 90) return '优秀';
  if (score >= 80) return '良好';
  if (score >= 70) return '中等';
  if (score >= 60) return '及格';
  return '需提升';
};

const getScoreDescription = (score) => {
  if (score >= 90) return '您的综合能力表现优异，继续保持！';
  if (score >= 80) return '您的能力水平良好，还有进步空间。';
  if (score >= 70) return '您的能力处于中等水平，建议重点提升。';
  if (score >= 60) return '您的能力刚刚及格，需要加强练习。';
  return '您的能力需要大幅提升，建议制定学习计划。';
};

const getSkillScoreClass = (score) => {
  if (score >= 90) return 'score-excellent';
  if (score >= 80) return 'score-good';
  if (score >= 70) return 'score-average';
  return 'score-poor';
};

const getSkillLevel = (score) => {
  if (score >= 90) return '专家级';
  if (score >= 80) return '熟练';
  if (score >= 70) return '中级';
  if (score >= 60) return '初级';
  return '入门';
};

const getSkillColor = (index) => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  return colors[index % colors.length];
};

const getPriorityText = (priority) => {
  const texts = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  };
  return texts[priority] || '普通';
};

const startLearningPath = (path) => {
  console.log('开始学习路径:', path.title);
  // 这里可以实现跳转到学习页面的逻辑
};

const viewPathDetails = (path) => {
  console.log('查看学习路径详情:', path.title);
  // 这里可以实现查看详情的逻辑
};
</script>

<style scoped>
.ability-analysis-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
  padding: 20px;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.header-left {
  flex: 1;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.back-btn:hover {
  background: #e2e8f0;
  color: #475569;
}

.back-icon {
  font-size: 16px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.breadcrumb {
  color: #64748b;
  font-size: 0.9rem;
}

.header-right {
  display: flex;
  align-items: center;
}

.analysis-date {
  text-align: right;
}

.date-label {
  color: #64748b;
  font-size: 0.9rem;
}

.date-value {
  display: block;
  color: #1e293b;
  font-weight: 500;
  margin-top: 4px;
}

/* 通用卡片样式 */
.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
}

/* 综合能力概览 */
.overview-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.overview-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.overall-score {
  display: flex;
  align-items: center;
  gap: 32px;
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(from 0deg, #3b82f6 0deg, #3b82f6 306deg, #e5e7eb 306deg, #e5e7eb 360deg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.score-inner {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.score-number {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
}

.score-label {
  font-size: 0.9rem;
  color: #64748b;
}

.score-description {
  flex: 1;
}

.score-level {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.score-text {
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

.quick-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 2rem;
  width: 48px;
  text-align: center;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
  display: block;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  display: block;
  margin: 4px 0;
}

.stat-detail {
  font-size: 0.8rem;
  color: #9ca3af;
}

/* 雷达图 */
.radar-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
  align-items: center;
}

.radar-chart {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.radar-svg {
  width: 100%;
  height: auto;
}

.radar-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-label {
  flex: 1;
  font-size: 0.9rem;
  color: #374151;
}

.legend-value {
  font-weight: 600;
  color: #1e293b;
}

/* 技能详细分析 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.skill-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.skill-info {
  flex: 1;
}

.skill-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.skill-category {
  font-size: 0.8rem;
  color: #64748b;
  background: #e2e8f0;
  padding: 2px 8px;
  border-radius: 4px;
  display: inline-block;
}

.skill-score {
  font-weight: 700;
  font-size: 1.1rem;
  padding: 4px 12px;
  border-radius: 20px;
}

.score-excellent {
  background: #dcfce7;
  color: #166534;
}

.score-good {
  background: #dbeafe;
  color: #1d4ed8;
}

.score-average {
  background: #fef3c7;
  color: #92400e;
}

.score-poor {
  background: #fee2e2;
  color: #dc2626;
}

.skill-progress {
  margin-bottom: 16px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.skill-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.trend-label, .level-label {
  color: #64748b;
}

.trend-value {
  margin-left: 4px;
  font-weight: 500;
}

.trend-up {
  color: #059669;
}

.trend-down {
  color: #dc2626;
}

.level-value {
  margin-left: 4px;
  font-weight: 500;
  color: #3b82f6;
}

.skill-suggestions {
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
}

.suggestions-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.suggestions-list {
  margin: 0;
  padding-left: 16px;
}

.suggestions-list li {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 4px;
}

/* 学习路径 */
.learning-paths {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.learning-path {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.path-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.path-icon {
  font-size: 2rem;
  width: 48px;
  text-align: center;
}

.path-info {
  flex: 1;
}

.path-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.path-description {
  font-size: 0.9rem;
  color: #64748b;
}

.path-priority {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.priority-high {
  background: #fee2e2;
  color: #dc2626;
}

.priority-medium {
  background: #fef3c7;
  color: #92400e;
}

.priority-low {
  background: #dcfce7;
  color: #166534;
}

.path-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.path-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}

.step-duration {
  font-size: 0.8rem;
  color: #64748b;
}

.path-actions {
  display: flex;
  gap: 12px;
}

.start-learning-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.3s ease;
  flex: 1;
}

.start-learning-btn:hover {
  background: #2563eb;
}

.view-details-btn {
  background: transparent;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  flex: 1;
}

.view-details-btn:hover {
  background: #3b82f6;
  color: white;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .ability-analysis-container {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .overview-section {
    grid-template-columns: 1fr;
  }
  
  .overall-score {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .radar-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
  
  .learning-paths {
    grid-template-columns: 1fr;
  }
  
  .path-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .path-actions {
    flex-direction: column;
  }
}
</style>