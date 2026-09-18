#!/usr/bin/env python3
"""
简单的API调试脚本
"""

import requests
import json

def debug_analyze_request():
    """调试分析请求"""
    
    # 测试数据
    test_data = {
        "chatHistory": [
            "我有三年的机器学习开发经验，主要专注于深度学习模型的训练和优化。",
            "在之前的项目中，我使用了TensorFlow和PyTorch来构建神经网络模型。"
        ],
        "domain": "人工智能",
        "role": "算法工程师",
        "useStaticData": True,
        "includeMultimodal": False
    }
    
    print("发送请求数据:")
    print(json.dumps(test_data, indent=2, ensure_ascii=False))
    print("\n" + "="*50)
    
    try:
        response = requests.post(
            "http://localhost:8000/analyze-interview",
            json=test_data,
            headers={"Content-Type": "application/json"}
        )
        
        print(f"响应状态码: {response.status_code}")
        print(f"响应头: {dict(response.headers)}")
        print(f"响应内容: {response.text}")
        
        if response.status_code == 200:
            result = response.json()
            print("\n✅ 分析成功!")
            print(f"雷达图分数: {result.get('radarChartScores', [])}")
        else:
            print(f"\n❌ 请求失败: {response.status_code}")
            
    except Exception as e:
        print(f"❌ 请求异常: {e}")

if __name__ == "__main__":
    debug_analyze_request() 