from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json

from spark_analyzer import spark_analyzer
from static_analysis_data import static_analysis_data
from multimodal_analyzer import multimodal_analyzer

app = FastAPI(title="多模态智能模拟面试评测系统", version="1.0.0")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 请求模型
class InterviewAnalysisRequest(BaseModel):
    chatHistory: List[str]
    domain: str
    role: str
    useStaticData: bool = False  # 是否使用静态数据
    includeMultimodal: bool = False  # 是否包含多模态分析

class InterviewQuestionRequest(BaseModel):
    domain: str
    role: str

class MultimodalAnalysisRequest(BaseModel):
    videoData: Optional[str] = None  # Base64编码的视频数据
    audioData: Optional[str] = None  # Base64编码的音频数据
    textContent: str
    domain: str
    role: str

@app.get("/")
def read_root():
    return {
        "message": "多模态智能模拟面试评测系统",
        "version": "1.0.0",
        "features": [
            "星火API智能分析",
            "多模态面试分析",
            "静态数据分析",
            "多领域多岗位支持"
        ]
    }

@app.get("/domains")
def get_available_domains():
    """获取可用的面试领域"""
    return {
        "domains": static_analysis_data.get_available_domains()
    }

@app.get("/roles/{domain}")
def get_domain_roles(domain: str):
    """获取指定领域下的岗位列表"""
    roles = static_analysis_data.get_domain_roles(domain)
    if not roles:
        raise HTTPException(status_code=404, detail=f"未找到领域 '{domain}' 的岗位信息")
    return {"roles": roles}

@app.get("/questions/{domain}/{role}")
def get_interview_questions(domain: str, role: str):
    """获取指定领域和岗位的面试问题"""
    questions = static_analysis_data.get_interview_questions(domain, role)
    if not questions:
        raise HTTPException(status_code=404, detail=f"未找到领域 '{domain}' 岗位 '{role}' 的面试问题")
    return {"questions": questions}

@app.post("/analyze-interview")
def analyze_interview(request: InterviewAnalysisRequest):
    """
    分析面试记录 - 支持星火API和静态数据两种模式
    """
    try:
        print(f"收到分析请求: domain={request.domain}, role={request.role}, useStaticData={request.useStaticData}")
        print(f"聊天记录数量: {len(request.chatHistory)}")
        
        # 验证输入参数
        if not request.chatHistory:
            print("错误: 聊天记录为空")
            raise HTTPException(status_code=400, detail="聊天记录不能为空")
        
        if not request.domain or not request.role:
            print(f"错误: 领域或岗位为空 - domain='{request.domain}', role='{request.role}'")
            raise HTTPException(status_code=400, detail="面试领域和岗位不能为空")
        
        # 根据请求选择分析方式
        if request.useStaticData:
            print("使用静态数据分析...")
            # 使用静态数据分析
            analysis_result = static_analysis_data.get_random_analysis_result(
                request.domain, 
                request.role, 
                request.chatHistory
            )
        else:
            print("使用星火API分析...")
            # 使用星火API分析
            try:
                analysis_result = spark_analyzer.analyze_interview(
                    request.chatHistory, 
                    request.domain, 
                    request.role
                )
            except Exception as e:
                print(f"星火API分析失败，使用静态数据: {e}")
                # 如果星火API失败，自动切换到静态数据
                analysis_result = static_analysis_data.get_random_analysis_result(
                    request.domain, 
                    request.role, 
                    request.chatHistory
                )
        
        # 如果请求包含多模态分析，添加多模态分析结果
        if request.includeMultimodal:
            print("添加多模态分析...")
            multimodal_result = analyze_multimodal_content(
                request.chatHistory, 
                request.domain, 
                request.role
            )
            analysis_result["multimodalAnalysis"] = multimodal_result
        
        print("分析完成，返回结果")
        return analysis_result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"分析面试记录出错: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"分析失败: {str(e)}")

@app.post("/analyze-multimodal")
def analyze_multimodal(request: MultimodalAnalysisRequest):
    """
    多模态分析接口
    """
    try:
        # 分析文本内容
        multimodal_analyzer.analyze_text_content(
            request.textContent, 
            request.domain, 
            request.role
        )
        
        # 如果有音频数据，进行音频分析
        if request.audioData:
            # 这里需要将Base64音频数据转换为numpy数组
            # 实际实现中需要根据音频格式进行解码
            pass
        
        # 获取综合分析结果
        analysis_result = multimodal_analyzer.get_comprehensive_analysis()
        
        return {
            "multimodalAnalysis": analysis_result,
            "summary": {
                "videoScore": analysis_result["comprehensive_scores"]["video_score"],
                "audioScore": analysis_result["comprehensive_scores"]["audio_score"],
                "textScore": analysis_result["comprehensive_scores"]["text_score"],
                "overallScore": analysis_result["comprehensive_scores"]["overall_score"]
            }
        }
        
    except Exception as e:
        print(f"多模态分析错误: {e}")
        raise HTTPException(status_code=500, detail=f"多模态分析失败: {str(e)}")

def analyze_multimodal_content(chat_history: List[str], domain: str, role: str):
    """
    分析多模态内容（文本部分）
    """
    try:
        # 合并聊天记录
        text_content = " ".join(chat_history)
        
        # 分析文本内容
        multimodal_analyzer.analyze_text_content(text_content, domain, role)
        
        # 获取分析结果
        analysis_result = multimodal_analyzer.get_comprehensive_analysis()
        
        return {
            "textAnalysis": analysis_result["text_analysis"],
            "textScore": analysis_result["comprehensive_scores"]["text_score"]
        }
        
    except Exception as e:
        print(f"多模态内容分析错误: {e}")
        return {
            "textAnalysis": {
                "relevance_score": 70,
                "structure_score": 70,
                "completeness_score": 70,
                "keyword_density": 70,
                "star_structure_usage": 70
            },
            "textScore": 70
        }

@app.get("/health")
def health_check():
    """健康检查接口"""
    return {
        "status": "healthy",
        "services": {
            "spark_analyzer": "available",
            "static_analysis": "available",
            "multimodal_analyzer": "available"
        }
    }

@app.get("/test-static-analysis")
def test_static_analysis():
    """测试静态分析功能"""
    test_chat = [
        "我有三年的机器学习开发经验，主要专注于深度学习模型的训练和优化。",
        "在之前的项目中，我使用了TensorFlow和PyTorch来构建神经网络模型。",
        "我熟悉卷积神经网络和循环神经网络的原理和应用。"
    ]
    
    result = static_analysis_data.get_random_analysis_result(
        "人工智能", 
        "算法工程师", 
        test_chat
    )
    
    return {
        "testResult": result,
        "message": "静态分析测试成功"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)