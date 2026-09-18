<template>
  <div class="interview-records-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <button class="back-btn" @click="$emit('go-back')">
          <span class="back-icon">←</span>
          返回首页
        </button>
        <h1 class="page-title">📊 面试记录</h1>
        <div class="breadcrumb">首页 / 面试记录</div>
      </div>
      <div class="header-right">
        <div class="stats-summary">
          <div class="stat-item">
            <span class="stat-number">{{ totalInterviews }}</span>
            <span class="stat-label">总面试次数</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ averageScore }}%</span>
            <span class="stat-label">平均得分</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filters-section">
      <div class="filter-group">
        <label>面试类型：</label>
        <select v-model="selectedType" class="filter-select">
          <option value="">全部</option>
          <option value="tech">技术面试</option>
          <option value="hr">HR面试</option>
          <option value="management">管理面试</option>
          <option value="design">设计面试</option>
        </select>
      </div>
      <div class="filter-group">
        <label>时间范围：</label>
        <select v-model="selectedTimeRange" class="filter-select">
          <option value="">全部</option>
          <option value="week">最近一周</option>
          <option value="month">最近一月</option>
          <option value="quarter">最近三月</option>
        </select>
      </div>
      <div class="search-group">
        <input 
          v-model="searchKeyword" 
          type="text" 
          placeholder="搜索岗位或关键词..."
          class="search-input"
        >
      </div>
    </div>

    <!-- 面试记录列表 -->
    <div class="records-grid">
      <div 
        v-for="record in filteredRecords" 
        :key="record.id" 
        class="record-card"
        @click="viewRecordDetail(record)"
      >
        <div class="record-header">
          <div class="record-type">
            <span class="type-icon">{{ getTypeIcon(record.type) }}</span>
            <span class="type-name">{{ getTypeName(record.type) }}</span>
          </div>
          <div class="record-score" :class="getScoreClass(record.score)">
            {{ record.score }}分
          </div>
        </div>
        
        <div class="record-content">
          <h3 class="record-title">{{ record.position }}</h3>
          <div class="record-meta">
            <span class="record-date">📅 {{ formatDate(record.date) }}</span>
            <span class="record-duration">⏱️ {{ record.duration }}分钟</span>
          </div>
          <div class="record-tags">
            <span 
              v-for="tag in record.tags" 
              :key="tag" 
              class="record-tag"
            >
              {{ tag }}
            </span>
          </div>
        </div>
        
        <div class="record-footer">
          <div class="record-highlights">
            <div class="highlight-item">
              <span class="highlight-label">表现亮点：</span>
              <span class="highlight-text">{{ record.highlights[0] }}</span>
            </div>
          </div>
          <button class="view-detail-btn">
            查看详情 →
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredRecords.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <h3 class="empty-title">暂无面试记录</h3>
      <p class="empty-description">开始您的第一次AI模拟面试吧！</p>
      <button class="start-interview-btn" @click="$emit('go-back')">
        开始面试
      </button>
    </div>

    <!-- 分页 -->
    <div v-if="filteredRecords.length > 0" class="pagination">
      <button 
        v-for="page in totalPages" 
        :key="page"
        :class="['page-btn', { active: currentPage === page }]"
        @click="currentPage = page"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue';

defineEmits(['go-back']);

// 响应式数据
const selectedType = ref('');
const selectedTimeRange = ref('');
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(6);

// 模拟面试记录数据
const interviewRecords = ref([
  {
    id: 1,
    type: 'tech',
    position: '前端工程师',
    score: 85,
    date: new Date('2024-01-15'),
    duration: 45,
    tags: ['Vue.js', 'JavaScript', '项目经验'],
    highlights: ['技术基础扎实', '项目经验丰富'],
    improvements: ['算法能力需提升', '系统设计经验不足']
  },
  {
    id: 2,
    type: 'hr',
    position: 'HR专员',
    score: 92,
    date: new Date('2024-01-12'),
    duration: 30,
    tags: ['沟通能力', '团队协作', '抗压能力'],
    highlights: ['沟通表达清晰', '团队合作意识强'],
    improvements: ['职业规划需明确', '行业了解需加深']
  },
  {
    id: 3,
    type: 'tech',
    position: '后端工程师',
    score: 78,
    date: new Date('2024-01-10'),
    duration: 50,
    tags: ['Java', 'Spring', '数据库'],
    highlights: ['数据库设计能力强', '代码规范性好'],
    improvements: ['并发处理经验不足', '微服务架构需学习']
  },
  {
    id: 4,
    type: 'design',
    position: 'UI设计师',
    score: 88,
    date: new Date('2024-01-08'),
    duration: 40,
    tags: ['Figma', '用户体验', '视觉设计'],
    highlights: ['设计思维清晰', '用户体验意识强'],
    improvements: ['交互动效需提升', '设计系统化程度不够']
  },
  {
    id: 5,
    type: 'management',
    position: '项目经理',
    score: 90,
    date: new Date('2024-01-05'),
    duration: 35,
    tags: ['项目管理', '团队领导', '风险控制'],
    highlights: ['项目管理经验丰富', '团队协调能力强'],
    improvements: ['技术深度需加强', '跨部门沟通需提升']
  },
  {
    id: 6,
    type: 'tech',
    position: '算法工程师',
    score: 82,
    date: new Date('2024-01-03'),
    duration: 60,
    tags: ['机器学习', 'Python', '数据分析'],
    highlights: ['算法理论扎实', '数学基础好'],
    improvements: ['工程实践经验不足', '大数据处理需学习']
  }
]);

// 计算属性
const filteredRecords = computed(() => {
  let filtered = interviewRecords.value;
  
  // 按类型筛选
  if (selectedType.value) {
    filtered = filtered.filter(record => record.type === selectedType.value);
  }
  
  // 按时间范围筛选
  if (selectedTimeRange.value) {
    const now = new Date();
    const timeRanges = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      quarter: 90 * 24 * 60 * 60 * 1000
    };
    const range = timeRanges[selectedTimeRange.value];
    filtered = filtered.filter(record => 
      now.getTime() - record.date.getTime() <= range
    );
  }
  
  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter(record => 
      record.position.toLowerCase().includes(keyword) ||
      record.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
  }
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filtered.slice(start, end);
});

const totalInterviews = computed(() => interviewRecords.value.length);
const averageScore = computed(() => {
  if (interviewRecords.value.length === 0) return 0;
  const total = interviewRecords.value.reduce((sum, record) => sum + record.score, 0);
  return Math.round(total / interviewRecords.value.length);
});

const totalPages = computed(() => {
  return Math.ceil(interviewRecords.value.length / pageSize.value);
});

// 方法
const getTypeIcon = (type) => {
  const icons = {
    tech: '💻',
    hr: '👥',
    management: '📋',
    design: '🎨'
  };
  return icons[type] || '📝';
};

const getTypeName = (type) => {
  const names = {
    tech: '技术面试',
    hr: 'HR面试',
    management: '管理面试',
    design: '设计面试'
  };
  return names[type] || '其他面试';
};

const getScoreClass = (score) => {
  if (score >= 90) return 'score-excellent';
  if (score >= 80) return 'score-good';
  if (score >= 70) return 'score-average';
  return 'score-poor';
};

const formatDate = (date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const viewRecordDetail = (record) => {
  console.log('查看面试记录详情:', record);
  // 这里可以实现跳转到详情页面的逻辑
};
</script>

<style scoped>
.interview-records-container {
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

.stats-summary {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
}

/* 筛选区域 */
.filters-section {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-group label {
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  min-width: 120px;
}

.search-group {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
}

/* 记录网格 */
.records-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.record-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f1f5f9;
}

.record-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.record-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-icon {
  font-size: 1.2rem;
}

.type-name {
  font-weight: 500;
  color: #64748b;
}

.record-score {
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

.record-content {
  margin-bottom: 16px;
}

.record-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.record-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 0.9rem;
  color: #64748b;
}

.record-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.record-tag {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
}

.record-footer {
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-highlights {
  flex: 1;
}

.highlight-item {
  font-size: 0.9rem;
}

.highlight-label {
  color: #64748b;
  font-weight: 500;
}

.highlight-text {
  color: #059669;
  margin-left: 4px;
}

.view-detail-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.view-detail-btn:hover {
  background: #2563eb;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.empty-description {
  color: #6b7280;
  margin-bottom: 24px;
}

.start-interview-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s ease;
}

.start-interview-btn:hover {
  background: #2563eb;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 30px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-btn:hover {
  background: #f3f4f6;
}

.page-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .interview-records-container {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .stats-summary {
    width: 100%;
    justify-content: space-around;
  }
  
  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    justify-content: space-between;
  }
  
  .records-grid {
    grid-template-columns: 1fr;
  }
  
  .record-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .view-detail-btn {
    width: 100%;
  }
}
</style>