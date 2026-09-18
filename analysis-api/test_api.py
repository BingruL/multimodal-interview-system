#!/usr/bin/env python3
"""
API测试脚本 - 用于调试和分析接口问题
"""

import requests
import json
import sys

# API基础URL
BASE_URL = "http://localhost:8000"

def test_health_check():
    """测试健康检查接口"""
    print("🔍 测试健康检查接口...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ 健康检查失败: {e}")
        return False

def test_domains():
    """测试获取领域接口"""
    print("\n🔍 测试获取领域接口...")
    try:
        response = requests.get(f"{BASE_URL}/domains")
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ 获取领域失败: {e}")
        return False

def test_roles():
    """测试获取岗位接口"""
    print("\n🔍 测试获取岗位接口...")
    try:
        response = requests.get(f"{BASE_URL}/roles/人工智能")
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ 获取岗位失败: {e}")
        return False

def test_questions():
    """测试获取面试问题接口"""
    print("\n🔍 测试获取面试问题接口...")
    try:
        response = requests.get(f"{BASE_URL}/questions/人工智能/算法工程师")
        print(f"状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ 获取面试问题失败: {e}")
        return False

def test_static_analysis():
    """测试静态分析接口"""
    print("\n🔍 测试静态分析接口...")
    try:
        response = requests.get(f"{BASE_URL}/test-static-analysis")
        print(f"状态码: {response.status_code}")
        print(f"响应: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ 静态分析测试失败: {e}")
        return False

def test_analyze_interview_valid():
    """测试有效的面试分析请求"""
    print("\n🔍 测试有效的面试分析请求...")
    
    # 有效的请求数据
    valid_data = {
        "chatHistory": [
            "我有三年的机器学习开发经验，主要专注于深度学习模型的训练和优化。",
            "在之前的项目中，我使用了TensorFlow和PyTorch来构建神经网络模型。",
            "我熟悉卷积神经网络和循环神经网络的原理和应用。"
        ],
        "domain": "人工智能",
        "role": "算法工程师",
        "useStaticData": True,
        "includeMultimodal": False
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/analyze-interview",
            json=valid_data,
            headers={"Content-Type": "application/json"}
        )
        print(f"状态码: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ 分析成功!")
            result = response.json()
            print(f"雷达图分数: {result.get('radarChartScores', [])}")
            print(f"关键问题数量: {len(result.get('feedbackData', {}).get('keyIssues', []))}")
            print(f"改进建议数量: {len(result.get('feedbackData', {}).get('improvementSuggestions', []))}")
        else:
            print(f"❌ 分析失败: {response.text}")
            
        return response.status_code == 200
    except Exception as e:
        print(f"❌ 请求失败: {e}")
        return False

def test_analyze_interview_invalid():
    """测试无效的面试分析请求"""
    print("\n🔍 测试无效的面试分析请求...")
    
    # 测试各种无效情况
    invalid_cases = [
        {
            "name": "空聊天记录",
            "data": {
                "chatHistory": [],
                "domain": "人工智能",
                "role": "算法工程师"
            }
        },
        {
            "name": "缺少领域",
            "data": {
                "chatHistory": ["测试回答"],
                "role": "算法工程师"
            }
        },
        {
            "name": "缺少岗位",
            "data": {
                "chatHistory": ["测试回答"],
                "domain": "人工智能"
            }
        },
        {
            "name": "错误的字段名",
            "data": {
                "chat_history": ["测试回答"],  # 应该是chatHistory
                "domain": "人工智能",
                "role": "算法工程师"
            }
        }
    ]
    
    for case in invalid_cases:
        print(f"\n测试: {case['name']}")
        try:
            response = requests.post(
                f"{BASE_URL}/analyze-interview",
                json=case['data'],
                headers={"Content-Type": "application/json"}
            )
            print(f"状态码: {response.status_code}")
            print(f"响应: {response.text}")
            
            if response.status_code == 400:
                print("✅ 正确返回400错误")
            else:
                print("❌ 应该返回400错误")
                
        except Exception as e:
            print(f"❌ 请求异常: {e}")

def test_cors():
    """测试CORS配置"""
    print("\n🔍 测试CORS配置...")
    try:
        response = requests.options(f"{BASE_URL}/analyze-interview")
        print(f"OPTIONS状态码: {response.status_code}")
        print(f"CORS头: {dict(response.headers)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ CORS测试失败: {e}")
        return False

def main():
    """主测试函数"""
    print("🚀 开始API测试...")
    print("=" * 50)
    
    # 测试基础接口
    tests = [
        ("健康检查", test_health_check),
        ("获取领域", test_domains),
        ("获取岗位", test_roles),
        ("获取面试问题", test_questions),
        ("静态分析测试", test_static_analysis),
        ("CORS配置", test_cors),
        ("有效面试分析", test_analyze_interview_valid),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name} 通过")
            else:
                print(f"❌ {test_name} 失败")
        except Exception as e:
            print(f"❌ {test_name} 异常: {e}")
    
    print("\n" + "=" * 50)
    print(f"测试结果: {passed}/{total} 通过")
    
    # 测试无效请求
    test_analyze_interview_invalid()
    
    print("\n🔧 调试建议:")
    print("1. 确保后端服务正在运行 (python main.py)")
    print("2. 检查请求参数格式是否正确")
    print("3. 查看后端日志获取详细错误信息")
    print("4. 使用浏览器开发者工具检查网络请求")

if __name__ == "__main__":
    main() 