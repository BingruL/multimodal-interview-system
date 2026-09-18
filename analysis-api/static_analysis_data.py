"""
静态分析数据模块 - 提供丰富的预设分析结果
用于在AI分析失败或需要快速测试时提供多样化的分析结果
"""

import random
from typing import Dict, List, Any

class StaticAnalysisData:
    """静态分析数据管理器"""
    
    def __init__(self):
        # 预定义的面试场景
        self.interview_scenarios = {
            '人工智能': {
                '算法工程师': {
                    'questions': [
                        "请介绍一下你在机器学习方面的经验",
                        "你如何解决过拟合问题？",
                        "请描述一个你参与过的深度学习项目",
                        "你对Transformer架构有什么理解？",
                        "如何评估一个机器学习模型的性能？"
                    ],
                    'keywords': ['算法', '机器学习', '深度学习', '神经网络', 'AI', '模型', '训练', '优化', '过拟合', 'Transformer']
                },
                '数据科学家': {
                    'questions': [
                        "请介绍一下你的数据分析经验",
                        "你使用过哪些数据可视化工具？",
                        "如何处理缺失数据？",
                        "请描述一个数据挖掘项目",
                        "你对A/B测试有什么了解？"
                    ],
                    'keywords': ['数据分析', '可视化', '数据挖掘', '统计', 'A/B测试', 'Python', 'R', 'SQL']
                },
                'AI产品经理': {
                    'questions': [
                        "请介绍一下你对AI产品的理解",
                        "如何评估一个AI产品的价值？",
                        "请描述一个AI产品从0到1的过程",
                        "如何处理AI产品的伦理问题？",
                        "你对AI产品的发展趋势有什么看法？"
                    ],
                    'keywords': ['产品管理', '用户体验', '商业模式', '伦理', '趋势', '需求分析']
                }
            },
            '大数据': {
                '大数据工程师': {
                    'questions': [
                        "请介绍一下你的大数据处理经验",
                        "你使用过哪些大数据技术栈？",
                        "如何优化Hadoop作业性能？",
                        "请描述一个数据仓库项目",
                        "你对实时数据处理有什么了解？"
                    ],
                    'keywords': ['Hadoop', 'Spark', '数据仓库', 'ETL', '实时处理', '分布式计算']
                },
                '数据分析师': {
                    'questions': [
                        "请介绍一下你的数据分析方法",
                        "你使用过哪些BI工具？",
                        "如何构建数据指标体系？",
                        "请描述一个数据分析项目",
                        "你对数据治理有什么了解？"
                    ],
                    'keywords': ['数据分析', 'BI工具', '指标体系', '数据治理', 'SQL', 'Python']
                },
                '数据架构师': {
                    'questions': [
                        "请介绍一下你的数据架构设计经验",
                        "如何设计一个数据湖架构？",
                        "请描述一个数据中台项目",
                        "你对数据安全有什么了解？",
                        "如何评估数据架构的性能？"
                    ],
                    'keywords': ['数据架构', '数据湖', '数据中台', '数据安全', '性能优化']
                }
            },
            '物联网': {
                '嵌入式工程师': {
                    'questions': [
                        "请介绍一下你的嵌入式开发经验",
                        "你使用过哪些RTOS？",
                        "如何优化嵌入式系统的功耗？",
                        "请描述一个物联网设备项目",
                        "你对传感器技术有什么了解？"
                    ],
                    'keywords': ['嵌入式', 'RTOS', '功耗优化', '传感器', '硬件设计', 'C/C++']
                },
                'IoT架构师': {
                    'questions': [
                        "请介绍一下你的IoT架构设计经验",
                        "如何设计一个物联网平台？",
                        "请描述一个大规模IoT部署项目",
                        "你对IoT安全有什么了解？",
                        "如何评估IoT系统的可扩展性？"
                    ],
                    'keywords': ['IoT架构', '平台设计', '安全', '可扩展性', '云平台']
                },
                '硬件工程师': {
                    'questions': [
                        "请介绍一下你的硬件设计经验",
                        "你使用过哪些PCB设计工具？",
                        "如何优化电路设计？",
                        "请描述一个硬件产品项目",
                        "你对EMC设计有什么了解？"
                    ],
                    'keywords': ['硬件设计', 'PCB', '电路设计', 'EMC', '元器件选型']
                }
            }
        }
        
        # 预定义的分析结果模板
        self.analysis_templates = {
            'excellent': {
                'scores': {
                    'professional_knowledge': 90,
                    'job_skill_match': 88,
                    'language_expression': 85,
                    'logical_thinking': 92,
                    'stress_resistance': 87
                },
                'key_issues': [
                    "整体表现优秀，专业知识掌握扎实",
                    "回答结构清晰，逻辑性强",
                    "能够很好地展示项目经验"
                ],
                'improvement_suggestions': [
                    "继续保持良好的面试表现",
                    "可以多关注行业前沿技术发展",
                    "建议在回答中加入更多量化指标"
                ]
            },
            'good': {
                'scores': {
                    'professional_knowledge': 78,
                    'job_skill_match': 75,
                    'language_expression': 72,
                    'logical_thinking': 80,
                    'stress_resistance': 70
                },
                'key_issues': [
                    "专业知识掌握较好，但深度有待加强",
                    "回答基本清晰，但结构可以更优化",
                    "项目经验描述较为完整"
                ],
                'improvement_suggestions': [
                    "建议深入学习相关专业知识",
                    "使用STAR结构组织回答，提高表达的条理性",
                    "多练习口语表达，增强自信心"
                ]
            },
            'average': {
                'scores': {
                    'professional_knowledge': 65,
                    'job_skill_match': 62,
                    'language_expression': 58,
                    'logical_thinking': 70,
                    'stress_resistance': 55
                },
                'key_issues': [
                    "专业知识掌握需要加强",
                    "语言表达能力有待提升，回答过于简短",
                    "逻辑思维不够清晰，缺乏结构化表达"
                ],
                'improvement_suggestions': [
                    "系统学习相关专业知识，关注行业发展趋势",
                    "练习结构化思维，使用STAR法则组织答案",
                    "多进行模拟面试，提升表达能力和自信心"
                ]
            },
            'needs_improvement': {
                'scores': {
                    'professional_knowledge': 45,
                    'job_skill_match': 40,
                    'language_expression': 35,
                    'logical_thinking': 50,
                    'stress_resistance': 30
                },
                'key_issues': [
                    "专业知识严重不足，需要系统学习",
                    "语言表达能力较差，回答过于简单",
                    "逻辑思维混乱，缺乏条理性",
                    "在压力下表现不佳，需要提升抗压能力"
                ],
                'improvement_suggestions': [
                    "制定系统的学习计划，从基础知识开始",
                    "参加相关培训课程，提升专业技能",
                    "多练习口语表达，学习面试技巧",
                    "进行压力面试训练，提升心理素质"
                ]
            }
        }
        
        # 学习推荐资源
        self.learning_resources = {
            'professional_knowledge': {
                '人工智能': [
                    {"title": "《深度学习》- Ian Goodfellow", "link": "https://example.com/deep-learning"},
                    {"title": "《机器学习》- 周志华", "link": "https://example.com/ml-zhou"},
                    {"title": "吴恩达深度学习课程", "link": "https://example.com/andrew-ng"},
                    {"title": "CS231n 计算机视觉课程", "link": "https://example.com/cs231n"}
                ],
                '大数据': [
                    {"title": "《大数据时代》- 维克托·迈尔-舍恩伯格", "link": "https://example.com/big-data"},
                    {"title": "Hadoop权威指南", "link": "https://example.com/hadoop-guide"},
                    {"title": "Spark快速大数据分析", "link": "https://example.com/spark-guide"},
                    {"title": "数据仓库工具箱", "link": "https://example.com/data-warehouse"}
                ],
                '物联网': [
                    {"title": "《物联网技术导论》", "link": "https://example.com/iot-intro"},
                    {"title": "嵌入式系统设计", "link": "https://example.com/embedded"},
                    {"title": "传感器技术与应用", "link": "https://example.com/sensors"},
                    {"title": "物联网安全技术", "link": "https://example.com/iot-security"}
                ]
            },
            'language_expression': [
                {"title": "《演讲技巧与沟通艺术》课程", "link": "https://example.com/speech-course"},
                {"title": "《有效沟通的七个习惯》", "link": "https://example.com/communication-habits"},
                {"title": "面试表达技巧训练营", "link": "https://example.com/interview-expression"},
                {"title": "STAR法则应用指南", "link": "https://example.com/star-method"}
            ],
            'logical_thinking': [
                {"title": "《批判性思维》课程", "link": "https://example.com/critical-thinking"},
                {"title": "《系统思考》- 彼得·圣吉", "link": "https://example.com/systems-thinking"},
                {"title": "结构化思维训练", "link": "https://example.com/structured-thinking"},
                {"title": "问题分析与解决技巧", "link": "https://example.com/problem-solving"}
            ],
            'stress_resistance': [
                {"title": "压力面试应对策略", "link": "https://example.com/stress-interview"},
                {"title": "《情商》- 丹尼尔·戈尔曼", "link": "https://example.com/emotional-intelligence"},
                {"title": "心理素质提升训练", "link": "https://example.com/psychological-training"},
                {"title": "面试心理调适技巧", "link": "https://example.com/interview-psychology"}
            ]
        }
    
    def get_random_analysis_result(self, domain: str, role: str, chat_history: List[str]) -> Dict[str, Any]:
        """根据聊天记录生成随机但合理的分析结果"""
        
        # 分析聊天记录特征
        total_messages = len(chat_history)
        total_words = sum(len(msg.split()) for msg in chat_history)
        avg_words_per_message = total_words / max(total_messages, 1)
        
        # 关键词匹配分析
        domain_keywords = self._get_domain_keywords(domain)
        keyword_matches = self._count_keyword_matches(chat_history, domain_keywords)
        
        # 根据特征选择分析模板
        if keyword_matches >= 5 and avg_words_per_message >= 15:
            template = 'excellent'
        elif keyword_matches >= 3 and avg_words_per_message >= 10:
            template = 'good'
        elif keyword_matches >= 1 and avg_words_per_message >= 5:
            template = 'average'
        else:
            template = 'needs_improvement'
        
        # 获取基础模板
        base_result = self.analysis_templates[template].copy()
        
        # 根据具体情况进行微调
        adjusted_scores = self._adjust_scores(base_result['scores'], domain, role, chat_history)
        
        # 生成个性化的关键问题和建议
        key_issues = self._generate_key_issues(domain, role, adjusted_scores, chat_history)
        improvement_suggestions = self._generate_improvement_suggestions(domain, role, adjusted_scores, chat_history)
        
        # 生成学习推荐
        learning_recommendations = self._generate_learning_recommendations(domain, role, adjusted_scores)
        
        return {
            "feedbackData": {
                "keyIssues": key_issues,
                "improvementSuggestions": improvement_suggestions
            },
            "radarChartScores": [
                adjusted_scores['professional_knowledge'],
                adjusted_scores['job_skill_match'],
                adjusted_scores['language_expression'],
                adjusted_scores['logical_thinking'],
                adjusted_scores['stress_resistance']
            ],
            "learningRecommendations": learning_recommendations
        }
    
    def _get_domain_keywords(self, domain: str) -> List[str]:
        """获取领域关键词"""
        all_keywords = []
        if domain in self.interview_scenarios:
            for role_data in self.interview_scenarios[domain].values():
                all_keywords.extend(role_data['keywords'])
        return list(set(all_keywords))
    
    def _count_keyword_matches(self, chat_history: List[str], keywords: List[str]) -> int:
        """统计关键词匹配次数"""
        total_matches = 0
        for message in chat_history:
            message_lower = message.lower()
            for keyword in keywords:
                if keyword.lower() in message_lower:
                    total_matches += 1
        return total_matches
    
    def _adjust_scores(self, base_scores: Dict[str, int], domain: str, role: str, chat_history: List[str]) -> Dict[str, int]:
        """根据具体情况调整评分"""
        adjusted = base_scores.copy()
        
        # 基于聊天记录长度调整
        total_words = sum(len(msg.split()) for msg in chat_history)
        if total_words > 200:
            adjusted['language_expression'] = min(100, adjusted['language_expression'] + 10)
        elif total_words < 50:
            adjusted['language_expression'] = max(0, adjusted['language_expression'] - 15)
        
        # 基于关键词匹配调整专业知识
        domain_keywords = self._get_domain_keywords(domain)
        keyword_matches = self._count_keyword_matches(chat_history, domain_keywords)
        if keyword_matches > 3:
            adjusted['professional_knowledge'] = min(100, adjusted['professional_knowledge'] + 8)
        elif keyword_matches == 0:
            adjusted['professional_knowledge'] = max(0, adjusted['professional_knowledge'] - 10)
        
        # 基于回答数量调整抗压能力
        if len(chat_history) > 5:
            adjusted['stress_resistance'] = min(100, adjusted['stress_resistance'] + 5)
        
        return adjusted
    
    def _generate_key_issues(self, domain: str, role: str, scores: Dict[str, int], chat_history: List[str]) -> List[str]:
        """生成个性化的关键问题"""
        issues = []
        
        if scores['professional_knowledge'] < 70:
            issues.append(f"{domain}专业知识掌握需要加强，建议深入学习相关核心技术")
        
        if scores['language_expression'] < 70:
            issues.append("语言表达能力需要提升，回答过于简短或不够清晰")
            if len(chat_history) > 0:
                avg_length = sum(len(msg) for msg in chat_history) / len(chat_history)
                if avg_length < 50:
                    issues.append("回答内容过于简短，缺乏详细说明")
        
        if scores['logical_thinking'] < 75:
            issues.append("逻辑思维能力需要提升，回答缺乏条理性")
        
        if scores['stress_resistance'] < 65:
            issues.append("在压力情境下，应变能力有待提高")
        
        if not issues:
            issues.append("整体表现良好，继续保持")
        
        return issues
    
    def _generate_improvement_suggestions(self, domain: str, role: str, scores: Dict[str, int], chat_history: List[str]) -> List[str]:
        """生成个性化的改进建议"""
        suggestions = []
        
        if scores['professional_knowledge'] < 75:
            suggestions.append(f"建议深入学习{domain}相关专业知识，关注行业前沿技术发展")
        
        if scores['language_expression'] < 70:
            suggestions.append("使用STAR结构组织回答，提高表达的条理性和完整性")
            suggestions.append("多练习口语表达，注意语速和语调的控制")
        
        if scores['logical_thinking'] < 75:
            suggestions.append("练习结构化思维，使用逻辑框架组织答案")
            suggestions.append("在回答项目经验类问题时，建议使用STAR法则")
        
        if scores['stress_resistance'] < 70:
            suggestions.append("多进行模拟面试，尤其是压力面试，锻炼快速应变能力")
        
        if not suggestions:
            suggestions.append("继续保持良好的面试表现，注意与面试官的眼神交流")
        
        return suggestions
    
    def _generate_learning_recommendations(self, domain: str, role: str, scores: Dict[str, int]) -> Dict[str, List[Dict[str, str]]]:
        """生成学习推荐"""
        recommendations = {}
        
        # 专业知识推荐
        if scores['professional_knowledge'] < 80:
            if domain in self.learning_resources['professional_knowledge']:
                recommendations['professional_knowledge'] = random.sample(
                    self.learning_resources['professional_knowledge'][domain], 2
                )
        
        # 语言表达推荐
        if scores['language_expression'] < 75:
            recommendations['language_expression'] = random.sample(
                self.learning_resources['language_expression'], 2
            )
        
        # 逻辑思维推荐
        if scores['logical_thinking'] < 80:
            recommendations['logical_thinking'] = random.sample(
                self.learning_resources['logical_thinking'], 2
            )
        
        # 抗压能力推荐
        if scores['stress_resistance'] < 70:
            recommendations['stress_resistance'] = random.sample(
                self.learning_resources['stress_resistance'], 2
            )
        
        return recommendations
    
    def get_interview_questions(self, domain: str, role: str) -> List[str]:
        """获取面试问题"""
        if domain in self.interview_scenarios and role in self.interview_scenarios[domain]:
            return self.interview_scenarios[domain][role]['questions']
        return []
    
    def get_domain_roles(self, domain: str) -> List[str]:
        """获取领域下的岗位列表"""
        if domain in self.interview_scenarios:
            return list(self.interview_scenarios[domain].keys())
        return []
    
    def get_available_domains(self) -> List[str]:
        """获取可用的面试领域"""
        return list(self.interview_scenarios.keys())

# 创建全局静态数据管理器实例
static_analysis_data = StaticAnalysisData() 