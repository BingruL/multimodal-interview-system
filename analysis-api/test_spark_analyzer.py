#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
测试星火API分析器
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from spark_analyzer import SparkAnalyzer
import json

def test_spark_analyzer():
    """测试星火API分析器"""
    
    # 创建分析器实例
    analyzer = SparkAnalyzer()
    
    # 测试数据
    test_chat_history = [
        "我有三年的机器学习开发经验，主要专注于深度学习模型的训练和优化。",
        "在之前的项目中，我使用了TensorFlow和PyTorch来构建神经网络模型。",
        "我熟悉卷积神经网络和循环神经网络的原理和应用。",
        "在数据预处理方面，我有丰富的经验，包括数据清洗、特征工程和数据增强。",
        "我曾经参与过一个计算机视觉项目，使用CNN进行图像分类，准确率达到了95%。"
    ]
    
    test_domain = "人工智能"
    test_role = "算法工程师"
    
    print("开始测试星火API分析器...")
    print(f"测试数据:")
    print(f"  领域: {test_domain}")
    print(f"  岗位: {test_role}")
    print(f"  聊天记录: {len(test_chat_history)} 条")
    
    for i, msg in enumerate(test_chat_history):
        print(f"    {i+1}. {msg}")
    
    print("\n正在调用星火API进行分析...")
    
    try:
        # 调用分析器
        result = analyzer.analyze_interview(test_chat_history, test_domain, test_role)
        
        print("\n分析完成！")
        print("=" * 50)
        
        # 打印结果
        print("分析结果:")
        print(json.dumps(result, ensure_ascii=False, indent=2))
        
        # 验证结果结构
        if "feedbackData" in result and "radarChartScores" in result:
            print("\n✅ 结果结构验证通过")
            
            # 验证雷达图分数
            scores = result["radarChartScores"]
            if len(scores) == 5 and all(isinstance(s, (int, float)) for s in scores):
                print("✅ 雷达图分数格式正确")
                print(f"   专业知识: {scores[0]}")
                print(f"   岗位技能: {scores[1]}")
                print(f"   语言表达: {scores[2]}")
                print(f"   逻辑思维: {scores[3]}")
                print(f"   抗压应变: {scores[4]}")
            else:
                print("❌ 雷达图分数格式错误")
            
            # 验证反馈数据
            feedback = result["feedbackData"]
            if "keyIssues" in feedback and "improvementSuggestions" in feedback:
                print("✅ 反馈数据结构正确")
                print(f"   关键问题: {len(feedback['keyIssues'])} 个")
                print(f"   改进建议: {len(feedback['improvementSuggestions'])} 个")
            else:
                print("❌ 反馈数据结构错误")
                
        else:
            print("❌ 结果结构验证失败")
            
    except Exception as e:
        print(f"❌ 测试失败: {e}")
        import traceback
        traceback.print_exc()

def test_prompt_generation():
    """测试提示词生成"""
    
    analyzer = SparkAnalyzer()
    
    test_chat_history = [
        "我有三年的机器学习开发经验。",
        "我熟悉深度学习模型的训练和优化。"
    ]
    
    prompt = analyzer.create_analysis_prompt(test_chat_history, "人工智能", "算法工程师")
    
    print("生成的提示词:")
    print("=" * 50)
    print(prompt)
    print("=" * 50)

if __name__ == "__main__":
    print("星火API分析器测试")
    print("=" * 50)
    
    # 测试提示词生成
    print("\n1. 测试提示词生成...")
    test_prompt_generation()
    
    # 测试完整分析流程
    print("\n2. 测试完整分析流程...")
    test_spark_analyzer() 