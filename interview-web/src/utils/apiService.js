import axios from 'axios';

// API基础URL，可以根据环境配置
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 获取可用的面试领域
 * @returns {Promise} 领域列表
 */
export const getAvailableDomains = async () => {
  try {
    const response = await apiClient.get('/domains');
    return response.data.domains;
  } catch (error) {
    console.error('获取领域列表失败:', error);
    // 返回默认领域列表
    return ['人工智能', '大数据', '物联网'];
  }
};

/**
 * 获取指定领域下的岗位列表
 * @param {string} domain - 面试领域
 * @returns {Promise} 岗位列表
 */
export const getDomainRoles = async (domain) => {
  try {
    const response = await apiClient.get(`/roles/${domain}`);
    return response.data.roles;
  } catch (error) {
    console.error('获取岗位列表失败:', error);
    // 返回默认岗位列表
    const defaultRoles = {
      '人工智能': ['算法工程师', '数据科学家', 'AI产品经理'],
      '大数据': ['大数据工程师', '数据分析师', '数据架构师'],
      '物联网': ['嵌入式工程师', 'IoT架构师', '硬件工程师']
    };
    return defaultRoles[domain] || [];
  }
};

/**
 * 获取指定领域和岗位的面试问题
 * @param {string} domain - 面试领域
 * @param {string} role - 面试岗位
 * @returns {Promise} 面试问题列表
 */
export const getInterviewQuestions = async (domain, role) => {
  try {
    const response = await apiClient.get(`/questions/${domain}/${role}`);
    return response.data.questions;
  } catch (error) {
    console.error('获取面试问题失败:', error);
    // 返回默认问题
    return getDefaultQuestions(domain, role);
  }
};

/**
 * 分析面试语音聊天记录（使用星火API）
 * @param {Object} params - 分析参数
 * @param {Array} params.chatHistory - 聊天记录数组
 * @param {string} params.domain - 面试领域
 * @param {string} params.role - 面试岗位
 * @param {boolean} params.useStaticData - 是否使用静态数据
 * @param {boolean} params.includeMultimodal - 是否包含多模态分析
 * @returns {Promise} 分析结果
 */
export const analyzeInterview = async (params) => {
  try {
    console.log('正在调用分析接口...', params);
    
    // 验证必要参数
    if (!params.chatHistory || !Array.isArray(params.chatHistory) || params.chatHistory.length === 0) {
      throw new Error('聊天记录不能为空');
    }
    
    if (!params.domain || !params.role) {
      throw new Error('面试领域和岗位不能为空');
    }
    
    // 确保所有必要字段都存在
    const requestData = {
      chatHistory: params.chatHistory,
      domain: params.domain,
      role: params.role,
      useStaticData: params.useStaticData !== undefined ? params.useStaticData : false,
      includeMultimodal: params.includeMultimodal !== undefined ? params.includeMultimodal : false
    };
    
    console.log('发送请求数据:', requestData);
    const response = await apiClient.post('/analyze-interview', requestData);
    
    // 检查是否有错误
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    
    return response.data;
  } catch (error) {
    console.error('分析失败:', error);
    
    // 如果是网络错误或服务器错误，使用备用分析方法
    if (error.response && error.response.status >= 400) {
      console.log('服务器错误，使用备用分析方法...');
      return await mockAnalyzeInterview(params);
    }
    
    // 如果是参数错误，直接抛出
    throw error;
  }
};

/**
 * 多模态分析接口
 * @param {Object} params - 分析参数
 * @param {string} params.textContent - 文本内容
 * @param {string} params.domain - 面试领域
 * @param {string} params.role - 面试岗位
 * @param {string} params.videoData - Base64编码的视频数据
 * @param {string} params.audioData - Base64编码的音频数据
 * @returns {Promise} 多模态分析结果
 */
export const analyzeMultimodal = async (params) => {
  try {
    console.log('正在进行多模态分析...', params);
    const response = await apiClient.post('/analyze-multimodal', params);
    return response.data;
  } catch (error) {
    console.error('多模态分析失败:', error);
    throw error;
  }
};

/**
 * 健康检查接口
 * @returns {Promise} 服务状态
 */
export const healthCheck = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('健康检查失败:', error);
    return { status: 'unhealthy', error: error.message };
  }
};

/**
 * 测试静态分析功能
 * @returns {Promise} 测试结果
 */
export const testStaticAnalysis = async () => {
  try {
    const response = await apiClient.get('/test-static-analysis');
    return response.data;
  } catch (error) {
    console.error('静态分析测试失败:', error);
    throw error;
  }
};

/**
 * 模拟API调用（用于开发测试）
 * @param {Object} params - 分析参数
 * @returns {Promise} 模拟分析结果
 */
export const mockAnalyzeInterview = async (params) => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const { chatHistory, domain, role } = params;
  
  // 基于聊天记录生成模拟分析结果
  const totalMessages = chatHistory.length;
  const totalWords = chatHistory.reduce((sum, msg) => sum + msg.split(' ').length, 0);
  const averageWordsPerMessage = totalMessages > 0 ? totalWords / totalMessages : 0;
  
  // 分析关键词和专业术语
  const professionalKeywords = {
    '人工智能': ['算法', '机器学习', '深度学习', '神经网络', 'AI', '模型', '数据', '训练'],
    '大数据': ['Hadoop', 'Spark', '数据仓库', '数据挖掘', '数据分析', '数据处理', 'ETL'],
    '物联网': ['传感器', '嵌入式', 'RTOS', '通信协议', '硬件', '设备', '物联网']
  };
  
  const domainKeywords = professionalKeywords[domain] || [];
  const keywordCount = chatHistory.reduce((count, msg) => {
    return count + domainKeywords.reduce((kCount, keyword) => {
      return kCount + (msg.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0);
    }, 0);
  }, 0);
  
  // 基础评分（基于更复杂的分析逻辑）
  const baseScores = {
    professionalKnowledge: Math.min(95, Math.max(40, 60 + keywordCount * 5 + totalWords / 15)),
    jobSkillMatch: Math.min(95, Math.max(50, 70 + totalMessages * 2 + keywordCount * 3)),
    languageExpression: Math.min(95, Math.max(30, 50 + averageWordsPerMessage * 2 + totalWords / 10)),
    logicalThinking: Math.min(95, Math.max(45, 65 + totalMessages * 2 + (averageWordsPerMessage > 10 ? 10 : 0))),
    stressResistance: Math.min(95, Math.max(40, 60 + totalMessages + (totalWords > 100 ? 15 : 0)))
  };
  
  // 生成关键问题和建议
  const keyIssues = [];
  const improvementSuggestions = [];
  const learningRecs = {};
  
  // 根据评分生成反馈
  if (baseScores.languageExpression < 70) {
    keyIssues.push("语言表达能力需要提升，回答过于简短或不够清晰");
    keyIssues.push("语速偏快，语调偏低，未能传递出信心");
    improvementSuggestions.push("建议多练习口语表达，使用STAR结构组织回答");
    improvementSuggestions.push("尝试放慢语速，注意语调的抑扬顿挫，增强表达的自信心");
    learningRecs.languageExpression = [
      { title: "《演讲技巧与沟通艺术》课程", link: "https://example.com/speech-course" },
      { title: "《有效沟通的七个习惯》书籍", link: "https://example.com/communication-book" }
    ];
  }
  
  if (baseScores.professionalKnowledge < 80) {
    keyIssues.push("专业知识掌握程度有待加强");
    improvementSuggestions.push(`建议深入学习${domain}相关专业知识，多关注行业前沿技术`);
    learningRecs.professionalKnowledge = [
      { title: `${domain}专业知识进阶课程`, link: "https://example.com/professional-course" },
      { title: `${role}技能提升指南`, link: "https://example.com/skill-guide" }
    ];
  }
  
  if (baseScores.logicalThinking < 80) {
    keyIssues.push("逻辑思维能力需要提升，回答缺乏条理性");
    keyIssues.push("在描述项目经历时，STAR结构不够清晰");
    improvementSuggestions.push("建议练习结构化思维，使用逻辑框架组织答案");
    improvementSuggestions.push("在回答项目经验类问题时，建议使用STAR法则（情境、任务、行动、结果）");
    learningRecs.logicalThinking = [
      { title: "批判性思维训练营", link: "https://example.com/critical-thinking" },
      { title: "系统设计面试指南", link: "https://example.com/system-design" }
    ];
  }
  
  if (baseScores.stressResistance < 75) {
    keyIssues.push("在压力情境下，应变能力有待提高");
    improvementSuggestions.push("多进行模拟面试，尤其是压力面试，锻炼快速应变能力");
    learningRecs.stressResistance = [
      { title: "压力面试应对策略", link: "https://example.com/stress-interview" },
      { title: "情商与逆商提升", link: "https://example.com/eq-resilience" }
    ];
  }
  
  // 确保至少有一些反馈
  if (keyIssues.length === 0) {
    keyIssues.push("总体表现良好，继续保持");
  }
  if (improvementSuggestions.length === 0) {
    improvementSuggestions.push("继续保持良好的面试表现");
    improvementSuggestions.push("注意与镜头保持眼神交流，展现积极的沟通意愿");
  }
  
  return {
    feedbackData: {
      keyIssues,
      improvementSuggestions
    },
    radarChartScores: Object.values(baseScores),
    learningRecommendations: learningRecs
  };
};

/**
 * 获取默认面试问题
 * @param {string} domain - 面试领域
 * @param {string} role - 面试岗位
 * @returns {Array} 默认问题列表
 */
const getDefaultQuestions = (domain, role) => {
  const questions = {
    '人工智能': {
      '算法工程师': [
        '请介绍一下你在机器学习方面的经验',
        '你如何解决过拟合问题？',
        '请描述一个你参与过的深度学习项目',
        '你对Transformer架构有什么理解？',
        '如何评估一个机器学习模型的性能？'
      ],
      '数据科学家': [
        '请介绍一下你的数据分析经验',
        '你使用过哪些数据可视化工具？',
        '如何处理缺失数据？',
        '请描述一个数据挖掘项目',
        '你对A/B测试有什么了解？'
      ],
      'AI产品经理': [
        '请介绍一下你对AI产品的理解',
        '如何评估一个AI产品的价值？',
        '请描述一个AI产品从0到1的过程',
        '如何处理AI产品的伦理问题？',
        '你对AI产品的发展趋势有什么看法？'
      ]
    },
    '大数据': {
      '大数据工程师': [
        '请介绍一下你的大数据处理经验',
        '你使用过哪些大数据技术栈？',
        '如何优化Hadoop作业性能？',
        '请描述一个数据仓库项目',
        '你对实时数据处理有什么了解？'
      ],
      '数据分析师': [
        '请介绍一下你的数据分析方法',
        '你使用过哪些BI工具？',
        '如何构建数据指标体系？',
        '请描述一个数据分析项目',
        '你对数据治理有什么了解？'
      ],
      '数据架构师': [
        '请介绍一下你的数据架构设计经验',
        '如何设计一个数据湖架构？',
        '请描述一个数据中台项目',
        '你对数据安全有什么了解？',
        '如何评估数据架构的性能？'
      ]
    },
    '物联网': {
      '嵌入式工程师': [
        '请介绍一下你的嵌入式开发经验',
        '你使用过哪些RTOS？',
        '如何优化嵌入式系统的功耗？',
        '请描述一个物联网设备项目',
        '你对传感器技术有什么了解？'
      ],
      'IoT架构师': [
        '请介绍一下你的IoT架构设计经验',
        '如何设计一个物联网平台？',
        '请描述一个大规模IoT部署项目',
        '你对IoT安全有什么了解？',
        '如何评估IoT系统的可扩展性？'
      ],
      '硬件工程师': [
        '请介绍一下你的硬件设计经验',
        '你使用过哪些PCB设计工具？',
        '如何优化电路设计？',
        '请描述一个硬件产品项目',
        '你对EMC设计有什么了解？'
      ]
    }
  };
  
  return questions[domain]?.[role] || ['请介绍一下你的相关经验'];
};

export default {
  getAvailableDomains,
  getDomainRoles,
  getInterviewQuestions,
  analyzeInterview,
  analyzeMultimodal,
  healthCheck,
  testStaticAnalysis,
  mockAnalyzeInterview
}; 