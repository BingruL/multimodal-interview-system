# 星火API集成说明

## 概述
本系统已集成讯飞星火认知大模型API，用于智能分析面试语音聊天记录，生成专业的面试评测报告。

## 星火API集成架构

### 1. 后端分析器 (`analysis-api/spark_analyzer.py`)
- **功能**: 封装星火API调用逻辑
- **特点**: 
  - 使用WebSocket连接星火API
  - 详细的提示词工程确保输出格式正确
  - 自动重试和错误处理机制
  - 备用分析方法保证系统稳定性

### 2. 提示词工程
为了确保星火API输出正确格式的分析结果，我们设计了详细的提示词：

```
你是一位专业的面试官和职业发展顾问，请对以下面试对话记录进行全面分析。

**面试信息：**
- 面试领域：{domain}
- 应聘岗位：{role}
- 对话记录：{formatted_chat}

**分析要求：**
请严格按照以下JSON格式输出分析结果，不要添加任何其他内容：

{
    "scores": {
        "professional_knowledge": 85,
        "job_skill_match": 80,
        "language_expression": 75,
        "logical_thinking": 90,
        "stress_resistance": 70
    },
    "key_issues": [
        "具体问题描述1",
        "具体问题描述2"
    ],
    "improvement_suggestions": [
        "具体改进建议1",
        "具体改进建议2"
    ],
    "learning_recommendations": {
        "professional_knowledge": [
            {"title": "推荐课程名称", "link": "https://example.com/course1"}
        ]
    }
}
```

### 3. 评分维度详解

#### 专业知识掌握 (professional_knowledge)
- **评估标准**: 对面试领域专业知识的掌握程度
- **考察要点**: 
  - 专业术语使用准确性
  - 技术概念理解深度
  - 行业发展趋势了解
  - 实际应用经验

#### 岗位技能匹配度 (job_skill_match)
- **评估标准**: 技能与目标岗位的匹配程度
- **考察要点**:
  - 岗位核心技能掌握
  - 工作经验相关性
  - 项目经历匹配度
  - 发展潜力评估

#### 语言表达能力 (language_expression)
- **评估标准**: 回答的清晰度、逻辑性和表达技巧
- **考察要点**:
  - 语言组织能力
  - 表达清晰度
  - 回答完整性
  - 沟通技巧

#### 逻辑思维能力 (logical_thinking)
- **评估标准**: 思维的条理性和分析能力
- **考察要点**:
  - 问题分析能力
  - 解决方案逻辑性
  - 思维结构化程度
  - 推理能力

#### 抗压应变能力 (stress_resistance)
- **评估标准**: 在面试压力下的表现
- **考察要点**:
  - 回答稳定性
  - 应变反应速度
  - 压力下的表现
  - 自信心展现

## 系统特性

### 1. 智能分析
- **深度理解**: 基于大语言模型的语义分析
- **多维评估**: 五个维度全面评估候选人能力
- **个性化反馈**: 根据具体表现给出针对性建议

### 2. 稳定性保障
- **双重保障**: 星火API + 本地备用分析
- **错误处理**: 完善的异常处理机制
- **超时控制**: 30秒超时保护
- **格式验证**: 严格的输出格式验证

### 3. 详细反馈
- **关键问题定位**: 具体指出表现问题并提供证据
- **改进建议**: 可操作的具体改进方案
- **学习推荐**: 基于弱项的个性化学习资源推荐

## 使用流程

### 1. 面试对话收集
- 用户通过语音与AI面试官进行实时对话
- 系统自动收集语音转文字的对话记录
- 记录包含完整的问答内容

### 2. 智能分析处理
- 用户点击"结束面试"触发分析
- 系统调用星火API进行深度分析
- 生成结构化的评测报告

### 3. 报告展示
- 雷达图展示五维能力评分
- 详细列出关键问题和改进建议
- 提供个性化学习资源推荐

## 技术实现

### 1. WebSocket连接
```python
ws = websocket.WebSocketApp(
    ws_url,
    on_message=self.on_message,
    on_error=self.on_error,
    on_close=self.on_close,
    on_open=self.on_open
)
```

### 2. 消息处理
```python
def on_message(self, ws, message):
    data = json.loads(message)
    choices = data["payload"]["choices"]
    status = choices["status"]
    text = choices['text'][0]
    
    if 'content' in text and text['content']:
        content = text["content"]
        self.analysis_result += content
    
    if status == 2:  # 分析完成
        self.analysis_complete = True
        ws.close()
```

### 3. 结果解析
```python
def parse_analysis_result(self):
    result_text = self.analysis_result.strip()
    json_start = result_text.find('{')
    json_end = result_text.rfind('}') + 1
    
    if json_start != -1 and json_end > json_start:
        json_text = result_text[json_start:json_end]
        analysis_data = json.loads(json_text)
        return self.format_analysis_result(analysis_data)
```

## 测试验证

### 1. 单元测试
运行测试脚本验证功能：
```bash
cd analysis-api
python test_spark_analyzer.py
```

### 2. 集成测试
- 启动后端服务
- 进行完整面试流程
- 验证分析结果格式和内容

### 3. 性能测试
- 分析响应时间 < 30秒
- 系统稳定性测试
- 并发处理能力测试

## 优化建议

### 1. 提示词优化
- 根据不同领域定制专业提示词
- 增加更多评估维度
- 优化输出格式稳定性

### 2. 性能优化
- 实现连接池管理
- 增加缓存机制
- 优化超时处理

### 3. 功能扩展
- 支持多轮对话分析
- 增加情感分析维度
- 实现历史对比功能

## 注意事项

1. **API密钥安全**: 确保星火API密钥的安全性
2. **网络连接**: 确保服务器能够访问星火API
3. **依赖管理**: 安装必要的Python依赖包
4. **错误监控**: 监控API调用失败情况
5. **数据隐私**: 确保面试数据的隐私安全

## 故障排除

### 1. 连接失败
- 检查API密钥是否正确
- 验证网络连接状态
- 确认星火API服务状态

### 2. 分析超时
- 检查网络延迟
- 优化提示词长度
- 调整超时时间设置

### 3. 格式错误
- 验证提示词格式
- 检查JSON解析逻辑
- 启用备用分析方法

通过以上集成，系统现在具备了真正的AI智能分析能力，能够提供专业、准确、个性化的面试评测服务。 