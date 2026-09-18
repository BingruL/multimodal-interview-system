// src/utils/mockData.js
export const mockInterviewDomains = [
  { id: 'ai', name: '人工智能', roles: ['算法工程师', '机器学习工程师', '数据科学家'] },
  { id: 'bigdata', name: '大数据', roles: ['大数据开发工程师', '数据分析师', '数据仓库工程师'] },
  { id: 'iot', name: '物联网', roles: ['嵌入式开发工程师', '物联网架构师', '智能硬件工程师'] },
];

export const mockInterviewQuestions = {
  'ai-算法工程师': ["请介绍一下您对深度学习的理解以及它在实际应用中的一个例子。", "您在项目中遇到过哪些挑战？是如何解决的？", "请谈谈您对Transformer模型的理解。"],
  'bigdata-数据分析师': ["请描述一下数据分析的完整流程。", "您熟悉哪些数据可视化工具？请举例说明其应用场景。", "在处理海量数据时，您会考虑哪些性能优化策略？"],
  'iot-嵌入式开发工程师': ["请谈谈您对RTOS的理解以及它在嵌入式系统中的应用。", "您在嵌入式项目中遇到过哪些调试难题？是如何解决的？", "请描述一下您对传感器数据采集和处理的经验。"],
};

export const mockFeedbackReport = {
  ai: { professionalKnowledge: 85, jobSkillMatch: 80, languageExpression: 70, logicalThinking: 90, stressResistance: 75, keyIssues: ["语速偏快，语调偏低，未能传递出信心。", "在描述项目经历时，STAR结构不够清晰。"], improvementSuggestions: ["尝试放慢语速，注意语调的抑扬顿挫，增强表达的自信心。", "在回答项目经验类问题时，建议使用STAR法则（情境、任务、行动、结果）来组织答案，使内容更具条理性和说服力。", "注意与镜头保持眼神交流，展现积极的沟通意愿。"] },
  bigdata: { professionalKnowledge: 78, jobSkillMatch: 85, languageExpression: 75, logicalThinking: 82, stressResistance: 80, keyIssues: ["对某些大数据工具的底层原理理解不够深入。"], improvementSuggestions: ["加强对Hadoop、Spark等大数据框架底层原理的学习。", "多参与实际项目，提升数据处理和分析的实战能力。"] },
  iot: { professionalKnowledge: 90, jobSkillMatch: 88, languageExpression: 80, logicalThinking: 85, stressResistance: 70, keyIssues: ["在压力情境下，应变能力有待提高。"], improvementSuggestions: ["多进行模拟面试，尤其是压力面试，锻炼快速应变能力。", "学习更多关于物联网安全和设备通信协议的知识。"] },
};

export const mockLearningRecommendations = {
  languageExpression: [{ title: "《演讲技巧与沟通艺术》课程", link: "https://example.com/speech-course" }, { title: "《有效沟通的七个习惯》书籍", link: "https://example.com/communication-book" }],
  jobSkillMatch: [{ title: "人工智能算法工程师必备题库", link: "https://example.com/ai-questions" }, { title: "大数据平台架构实战课程", link: "https://example.com/bigdata-course" }],
  professionalKnowledge: [{ title: "深度学习入门与实践", link: "https://example.com/dl-intro" }, { title: "物联网操作系统原理", link: "https://example.com/rtos-principle" }],
  logicalThinking: [{ title: "批判性思维训练营", link: "https://example.com/critical-thinking" }, { title: "系统设计面试指南", link: "https://example.com/system-design" }],
  stressResistance: [{ title: "压力面试应对策略", link: "https://example.com/stress-interview" }, { title: "情商与逆商提升", link: "https://example.com/eq-resilience" }],
};

export const categoryLabels = { professionalKnowledge: "专业知识掌握", jobSkillMatch: "岗位技能匹配度", languageExpression: "语言表达能力", logicalThinking: "逻辑思维能力", stressResistance: "抗压应变能力" };
export const radarChartLabels = ["专业知识", "岗位技能", "语言表达", "逻辑思维", "抗压应变"];

export const simulateApiCall = (data, delay = 1000) => new Promise(resolve => setTimeout(() => resolve(data), delay));