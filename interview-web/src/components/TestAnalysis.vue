<template>
  <div class="test-analysis-container">
    <!-- 背景渐变 -->
    <div class="background-gradient"></div>
    
    <!-- 主要内容 -->
    <div class="main-content">
      <div class="content-card">
        <!-- 标题区域 -->
        <div class="title-section">
          <h1 class="main-title">测试分析功能</h1>
        </div>
        
        <!-- 模拟聊天记录 -->
        <div class="section">
          <h2 class="section-title">模拟聊天记录</h2>
          <div class="chat-history">
            <div v-for="(message, index) in testChatHistory" :key="index" class="message-item">
              <span class="message-number">{{ index + 1 }}:</span> 
              <span class="message-text">{{ message }}</span>
            </div>
          </div>
        </div>
        
        <!-- 参数设置 -->
        <div class="section">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">选择领域:</label>
              <select v-model="selectedDomain" class="form-select">
                <option value="人工智能">人工智能</option>
                <option value="大数据">大数据</option>
                <option value="物联网">物联网</option>
              </select>
            </div>
            
            <div class="form-group">
              <label class="form-label">选择岗位:</label>
              <input v-model="selectedRole" type="text" class="form-input" placeholder="输入岗位名称">
            </div>
          </div>
        </div>
        
        <!-- 测试按钮 -->
        <div class="test-buttons-section">
          <button 
            @click="testSparkAnalysis" 
            :disabled="isAnalyzing"
            class="test-button spark-btn"
          >
            <svg v-if="isAnalyzing" class="loading-spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
              </circle>
            </svg>
            <svg v-else class="button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ isAnalyzing ? '分析中...' : '测试星火API分析' }}
          </button>
          
          <button 
            @click="testMockAnalysis" 
            :disabled="isAnalyzing"
            class="test-button mock-btn"
          >
            <svg v-if="isAnalyzing" class="loading-spinner" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
              </circle>
            </svg>
            <svg v-else class="button-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H15M9 15H15M9 7H15M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ isAnalyzing ? '分析中...' : '测试静态数据分析' }}
          </button>
        </div>
        
        <!-- 分析结果 -->
        <div v-if="analysisResult" class="results-section">
          <h3 class="results-title">分析结果</h3>
          
          <!-- 雷达图分数 -->
          <div class="result-card">
            <h4 class="result-subtitle">雷达图分数</h4>
            
            <!-- 可视化雷达图 -->
            <div class="radar-chart-section">
              <RadarChart 
                :scores="analysisResult.radarChartScores" 
                :labels="radarLabels"
                :size="320"
              />
            </div>
            
            <!-- 分数详情 -->
            <div class="scores-details">
              <div class="scores-grid">
                <div v-for="(score, index) in analysisResult.radarChartScores" :key="index" class="score-item">
                  <span class="score-label">{{ radarLabels[index] }}:</span>
                  <span class="score-value">{{ score }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 关键问题定位 -->
          <div class="result-card issues-card">
            <h4 class="result-subtitle">关键问题定位</h4>
            <ul class="issues-list">
              <li v-for="(issue, index) in analysisResult.feedbackData.keyIssues" :key="index" class="issue-item">
                {{ issue }}
              </li>
            </ul>
          </div>
          
          <!-- 改进建议 -->
          <div class="result-card suggestions-card">
            <h4 class="result-subtitle">改进建议</h4>
            <ul class="suggestions-list">
              <li v-for="(suggestion, index) in analysisResult.feedbackData.improvementSuggestions" :key="index" class="suggestion-item">
                {{ suggestion }}
              </li>
            </ul>
          </div>
          
          <!-- 学习推荐 -->
          <div v-if="Object.keys(analysisResult.learningRecommendations).length > 0" class="result-card recommendations-card">
            <h4 class="result-subtitle">学习推荐</h4>
            <div v-for="(items, category) in analysisResult.learningRecommendations" :key="category" class="recommendation-category">
              <h5 class="category-title">{{ category }}</h5>
              <ul class="recommendations-list">
                <li v-for="(item, index) in items" :key="index" class="recommendation-item">
                  <a :href="item.link" target="_blank" class="recommendation-link">{{ item.title }}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- 返回按钮 -->
        <div class="back-section">
          <button @click="$emit('go-back')" class="back-button">
            <svg class="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            返回
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { analyzeInterview, mockAnalyzeInterview } from '../utils/apiService.js';
import RadarChart from './RadarChart.vue';

const emits = defineEmits(['go-back']);

const testChatHistory = ref([
  "我有三年的机器学习开发经验，主要专注于深度学习模型的训练和优化。",
  "在之前的项目中，我使用了TensorFlow和PyTorch来构建神经网络模型。",
  "我熟悉卷积神经网络和循环神经网络的原理和应用。",
  "在数据预处理方面，我有丰富的经验，包括数据清洗、特征工程和数据增强。",
  "我曾经参与过一个计算机视觉项目，使用CNN进行图像分类，准确率达到了95%。"
]);

const selectedDomain = ref('人工智能');
const selectedRole = ref('算法工程师');
const isAnalyzing = ref(false);
const analysisResult = ref(null);

const radarLabels = ['专业知识', '岗位技能', '语言表达', '逻辑思维', '抗压应变'];

const testSparkAnalysis = async () => {
  try {
    isAnalyzing.value = true;
    
    const params = {
      chatHistory: testChatHistory.value,
      domain: selectedDomain.value,
      role: selectedRole.value,
      useStaticData: false,  // 使用星火API
      includeMultimodal: false
    };
    
    console.log('测试星火API分析...');
    const result = await analyzeInterview(params);
    analysisResult.value = result;
    
  } catch (error) {
    console.error('星火API测试失败:', error);
    alert('星火API测试失败: ' + error.message);
  } finally {
    isAnalyzing.value = false;
  }
};

const testMockAnalysis = async () => {
  try {
    isAnalyzing.value = true;
    
    const params = {
      chatHistory: testChatHistory.value,
      domain: selectedDomain.value,
      role: selectedRole.value,
      useStaticData: true,  // 使用静态数据
      includeMultimodal: false
    };
    
    console.log('测试静态数据分析...');
    const result = await analyzeInterview(params);
    analysisResult.value = result;
    
  } catch (error) {
    console.error('静态数据分析测试失败:', error);
    alert('静态数据分析测试失败: ' + error.message);
  } finally {
    isAnalyzing.value = false;
  }
};
</script>

<style scoped>
/* 容器样式 */
.test-analysis-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

/* 背景渐变 */
.background-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: 1;
}

/* 主要内容 */
.main-content {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1000px;
}

/* 内容卡片 */
.content-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 标题区域 */
.title-section {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.02em;
}

/* 区域样式 */
.section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

/* 聊天记录 */
.chat-history {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.message-item {
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.message-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.message-number {
  font-weight: 600;
  color: #667eea;
  margin-right: 8px;
}

.message-text {
  color: #333;
  line-height: 1.5;
}

/* 表单样式 */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-select,
.form-input {
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.form-select:focus,
.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* 测试按钮 */
.test-buttons-section {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}

.test-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.test-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.test-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-icon {
  width: 20px;
  height: 20px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.spark-btn {
  background: rgba(24, 144, 255, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mock-btn {
  background: rgba(82, 196, 26, 0.9);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 结果区域 */
.results-section {
  margin-top: 40px;
}

.results-title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 32px;
}

.result-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.result-subtitle {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

/* 雷达图部分 */
.radar-chart-section {
  display: flex;
  justify-content: center;
  margin: 24px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 分数详情 */
.scores-details {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

/* 分数网格 */
.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.score-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
}

.score-label {
  font-weight: 600;
  color: #333;
}

.score-value {
  font-weight: 700;
  color: #667eea;
  font-size: 1.1em;
}

/* 列表样式 */
.issues-list,
.suggestions-list,
.recommendations-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.issue-item,
.suggestion-item,
.recommendation-item {
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  padding-left: 20px;
}

.issue-item:before,
.suggestion-item:before,
.recommendation-item:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

.issue-item:last-child,
.suggestion-item:last-child,
.recommendation-item:last-child {
  border-bottom: none;
}

.issues-card {
  border-left: 4px solid #ff4d4f;
}

.suggestions-card {
  border-left: 4px solid #52c41a;
}

.recommendations-card {
  border-left: 4px solid #1890ff;
}

.recommendation-category {
  margin-bottom: 20px;
}

.recommendation-category:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 12px;
}

.recommendation-link {
  color: #1890ff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.recommendation-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

/* 返回按钮 */
.back-section {
  text-align: center;
  margin-top: 32px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.1);
  color: #333;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.back-icon {
  width: 18px;
  height: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .test-analysis-container {
    padding: 16px;
  }
  
  .content-card {
    padding: 24px;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .test-buttons-section {
    flex-direction: column;
    align-items: center;
  }
  
  .test-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
  
  .scores-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .content-card {
    padding: 20px;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .results-title {
    font-size: 1.5rem;
  }
}
</style> 