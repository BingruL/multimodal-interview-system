import _thread as thread
import base64
import datetime
import hashlib
import hmac
import json
from urllib.parse import urlparse
import ssl
from datetime import datetime
from time import mktime
from urllib.parse import urlencode
from wsgiref.handlers import format_date_time
import websocket
import time
import os
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

class SparkAnalyzer:
    def __init__(self):
        # 星火API配置
        self.appid = os.getenv("SPARK_APP_ID", "")
        self.api_secret = os.getenv("SPARK_API_SECRET", "")
        self.api_key = os.getenv("SPARK_API_KEY", "")
        self.domain = os.getenv("SPARK_DOMAIN", "x1")
        self.Spark_url = os.getenv("SPARK_URL", "wss://spark-api.xf-yun.com/v1/x1")
        
        # 分析结果存储
        self.analysis_result = ""
        self.analysis_complete = False
        
    def create_url(self):
        """生成星火API的WebSocket URL"""
        if not all((self.appid, self.api_secret, self.api_key)):
            raise RuntimeError("Spark credentials are not configured. Set SPARK_APP_ID, SPARK_API_KEY and SPARK_API_SECRET.")

        # 生成RFC1123格式的时间戳
        now = datetime.now()
        date = format_date_time(mktime(now.timetuple()))
        
        host = urlparse(self.Spark_url).netloc
        path = urlparse(self.Spark_url).path
        
        # 拼接字符串
        signature_origin = "host: " + host + "\n"
        signature_origin += "date: " + date + "\n"
        signature_origin += "GET " + path + " HTTP/1.1"
        
        # 进行hmac-sha256进行加密
        signature_sha = hmac.new(self.api_secret.encode('utf-8'), 
                               signature_origin.encode('utf-8'),
                               digestmod=hashlib.sha256).digest()
        
        signature_sha_base64 = base64.b64encode(signature_sha).decode(encoding='utf-8')
        
        authorization_origin = f'api_key="{self.api_key}", algorithm="hmac-sha256", headers="host date request-line", signature="{signature_sha_base64}"'
        
        authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode(encoding='utf-8')
        
        # 将请求的鉴权参数组合为字典
        v = {
            "authorization": authorization,
            "date": date,
            "host": host
        }
        # 拼接鉴权参数，生成url
        url = self.Spark_url + '?' + urlencode(v)
        return url
    
    def on_message(self, ws, message):
        """处理WebSocket消息"""
        try:
            data = json.loads(message)
            code = data['header']['code']
            
            if code != 0:
                print(f'请求错误: {code}, {data}')
                ws.close()
                return
            
            choices = data["payload"]["choices"]
            status = choices["status"]
            text = choices['text'][0]
            
            # 处理推理内容
            if 'reasoning_content' in text and text['reasoning_content']:
                reasoning_content = text["reasoning_content"]
                self.analysis_result += reasoning_content
            
            # 处理回复内容
            if 'content' in text and text['content']:
                content = text["content"]
                self.analysis_result += content
            
            # 检查是否完成
            if status == 2:
                self.analysis_complete = True
                ws.close()
                
        except Exception as e:
            print(f"处理消息错误: {e}")
            ws.close()
    
    def on_error(self, ws, error):
        """处理WebSocket错误"""
        print(f"WebSocket错误: {error}")
        self.analysis_complete = True
    
    def on_close(self, ws, close_status_code, close_msg):
        """处理WebSocket关闭"""
        self.analysis_complete = True
    
    def on_open(self, ws):
        """处理WebSocket连接打开"""
        thread.start_new_thread(self.run, (ws,))
    
    def run(self, ws, *args):
        """发送分析请求"""
        data = json.dumps(self.gen_params())
        ws.send(data)
    
    def gen_params(self):
        """生成请求参数"""
        data = {
            "header": {
                "app_id": self.appid,
                "uid": "interview_analyzer",
            },
            "parameter": {
                "chat": {
                    "domain": self.domain,
                    "temperature": 0.7,  # 降低温度以获得更稳定的输出
                    "max_tokens": 4096
                }
            },
            "payload": {
                "message": {
                    "text": [{"role": "user", "content": self.prompt}]
                }
            }
        }
        return data
    
    def create_analysis_prompt(self, chat_history, domain, role):
        """创建详细的分析提示词"""
        
        # 将聊天记录格式化
        formatted_chat = "\n".join([f"对话{i+1}: {msg}" for i, msg in enumerate(chat_history)])
        
        prompt = f"""
你是一位专业的面试官和职业发展顾问，请对以下面试对话记录进行全面分析。

**面试信息：**
- 面试领域：{domain}
- 应聘岗位：{role}
- 对话记录：
{formatted_chat}

**分析要求：**
请严格按照以下JSON格式输出分析结果，不要添加任何其他内容：

```json
{{
    "scores": {{
        "professional_knowledge": 85,
        "job_skill_match": 80,
        "language_expression": 75,
        "logical_thinking": 90,
        "stress_resistance": 70
    }},
    "key_issues": [
        "具体问题描述1",
        "具体问题描述2"
    ],
    "improvement_suggestions": [
        "具体改进建议1",
        "具体改进建议2"
    ],
    "learning_recommendations": {{
        "professional_knowledge": [
            {{"title": "推荐课程名称", "link": "https://example.com/course1"}},
            {{"title": "推荐书籍名称", "link": "https://example.com/book1"}}
        ],
        "language_expression": [
            {{"title": "表达技巧课程", "link": "https://example.com/speech1"}},
            {{"title": "沟通技巧培训", "link": "https://example.com/communication1"}}
        ]
    }}
}}
```

**评分标准（0-100分）：**
1. **专业知识掌握(professional_knowledge)**: 评估对{domain}领域专业知识的掌握程度
2. **岗位技能匹配度(job_skill_match)**: 评估技能与{role}岗位的匹配程度
3. **语言表达能力(language_expression)**: 评估回答的清晰度、逻辑性和表达技巧
4. **逻辑思维能力(logical_thinking)**: 评估思维的条理性和分析能力
5. **抗压应变能力(stress_resistance)**: 评估在面试压力下的表现

**关键问题定位要求：**
- 指出具体的表现问题
- 提供证据支撑（如"回答过于简短"、"缺乏具体例子"等）
- 每个问题描述要具体且可操作

**改进建议要求：**
- 提供具体可行的改进方案
- 建议要针对识别出的问题
- 包含具体的方法和技巧

**学习推荐要求：**
- 根据弱项推荐相关学习资源
- 推荐内容要与{domain}和{role}相关
- 提供具体的课程或资料名称

请确保输出的JSON格式完全正确，分数为整数，所有字段都必须包含。
"""
        return prompt
    
    def analyze_interview(self, chat_history, domain, role):
        """分析面试记录"""
        try:
            # 重置分析结果
            self.analysis_result = ""
            self.analysis_complete = False
            
            # 创建分析提示词
            self.prompt = self.create_analysis_prompt(chat_history, domain, role)
            
            # 创建WebSocket连接
            websocket.enableTrace(False)
            ws_url = self.create_url()
            ws = websocket.WebSocketApp(
                ws_url,
                on_message=self.on_message,
                on_error=self.on_error,
                on_close=self.on_close,
                on_open=self.on_open
            )
            
            # 启动WebSocket连接
            ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})
            
            # 等待分析完成
            timeout = 30  # 30秒超时
            start_time = time.time()
            while not self.analysis_complete and (time.time() - start_time) < timeout:
                time.sleep(0.1)
            
            if not self.analysis_complete:
                raise Exception("分析超时")
            
            # 解析分析结果
            return self.parse_analysis_result()
            
        except Exception as e:
            print(f"分析错误: {e}")
            # 返回默认分析结果
            return self.get_default_analysis(chat_history, domain, role)
    
    def parse_analysis_result(self):
        """解析星火API返回的分析结果"""
        try:
            # 尝试从结果中提取JSON
            result_text = self.analysis_result.strip()
            
            # 查找JSON块
            json_start = result_text.find('{')
            json_end = result_text.rfind('}') + 1
            
            if json_start != -1 and json_end > json_start:
                json_text = result_text[json_start:json_end]
                analysis_data = json.loads(json_text)
                
                # 验证数据结构
                if self.validate_analysis_data(analysis_data):
                    return self.format_analysis_result(analysis_data)
            
            # 如果解析失败，返回默认结果
            raise Exception("无法解析分析结果")
            
        except Exception as e:
            print(f"解析结果错误: {e}")
            print(f"原始结果: {self.analysis_result}")
            raise e
    
    def validate_analysis_data(self, data):
        """验证分析数据的结构"""
        required_fields = ['scores', 'key_issues', 'improvement_suggestions']
        
        for field in required_fields:
            if field not in data:
                return False
        
        # 验证分数字段
        score_fields = ['professional_knowledge', 'job_skill_match', 'language_expression', 
                       'logical_thinking', 'stress_resistance']
        
        if 'scores' not in data or not isinstance(data['scores'], dict):
            return False
        
        for score_field in score_fields:
            if score_field not in data['scores']:
                return False
        
        return True
    
    def format_analysis_result(self, data):
        """格式化分析结果"""
        scores = data['scores']
        
        return {
            "feedbackData": {
                "keyIssues": data.get('key_issues', []),
                "improvementSuggestions": data.get('improvement_suggestions', [])
            },
            "radarChartScores": [
                scores.get('professional_knowledge', 70),
                scores.get('job_skill_match', 70),
                scores.get('language_expression', 70),
                scores.get('logical_thinking', 70),
                scores.get('stress_resistance', 70)
            ],
            "learningRecommendations": data.get('learning_recommendations', {})
        }
    
    def get_default_analysis(self, chat_history, domain, role):
        """获取默认分析结果（当AI分析失败时）"""
        total_messages = len(chat_history)
        total_words = sum(len(msg.split()) for msg in chat_history)
        
        # 基础评分
        base_scores = [
            min(95, max(40, 60 + total_words // 10)),  # professional_knowledge
            min(95, max(50, 70 + total_messages * 2)),  # job_skill_match
            min(95, max(30, 50 + total_words // 8)),    # language_expression
            min(95, max(45, 65 + total_messages * 3)),  # logical_thinking
            min(95, max(40, 60 + total_messages))       # stress_resistance
        ]
        
        # 生成基础反馈
        key_issues = []
        improvement_suggestions = []
        learning_recs = {}
        
        if base_scores[2] < 70:  # language_expression
            key_issues.append("语言表达能力需要提升，建议多练习口语表达")
            improvement_suggestions.append("使用STAR结构组织回答，提高表达的条理性")
            learning_recs["language_expression"] = [
                {"title": "演讲技巧与沟通艺术课程", "link": "https://example.com/speech"},
                {"title": "有效沟通技巧培训", "link": "https://example.com/communication"}
            ]
        
        if base_scores[0] < 75:  # professional_knowledge
            key_issues.append(f"{domain}专业知识掌握需要加强")
            improvement_suggestions.append(f"深入学习{domain}相关的核心技术和理论")
            learning_recs["professional_knowledge"] = [
                {"title": f"{domain}核心技术课程", "link": "https://example.com/tech"},
                {"title": f"{role}专业技能提升", "link": "https://example.com/skill"}
            ]
        
        if not key_issues:
            key_issues.append("整体表现良好，继续保持")
        
        if not improvement_suggestions:
            improvement_suggestions.append("继续保持良好的面试表现，注意与面试官的眼神交流")
        
        return {
            "feedbackData": {
                "keyIssues": key_issues,
                "improvementSuggestions": improvement_suggestions
            },
            "radarChartScores": base_scores,
            "learningRecommendations": learning_recs
        }

# 创建全局分析器实例
spark_analyzer = SparkAnalyzer() 