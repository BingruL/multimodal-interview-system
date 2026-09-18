#!/usr/bin/env python3
"""
系统启动脚本 - 快速启动和测试多模态智能模拟面试评测系统
"""

import subprocess
import time
import requests
import json
import sys
import os

def check_python_dependencies():
    """检查Python依赖"""
    print("🔍 检查Python依赖...")
    
    required_packages = [
        'fastapi', 'uvicorn', 'requests', 'websockets', 
        'pydantic', 'python-multipart'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
            print(f"✅ {package}")
        except ImportError:
            missing_packages.append(package)
            print(f"❌ {package} - 未安装")
    
    if missing_packages:
        print(f"\n⚠️  缺少依赖包: {', '.join(missing_packages)}")
        print("请运行: pip install -r requirements.txt")
        return False
    
    print("✅ 所有Python依赖已安装")
    return True

def start_backend_server():
    """启动后端服务器"""
    print("\n🚀 启动后端服务器...")
    
    try:
        # 启动后端服务器
        process = subprocess.Popen([
            sys.executable, "main.py"
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # 等待服务器启动
        print("等待服务器启动...")
        time.sleep(3)
        
        # 检查服务器是否启动成功
        try:
            response = requests.get("http://localhost:8000/health", timeout=5)
            if response.status_code == 200:
                print("✅ 后端服务器启动成功")
                return process
            else:
                print(f"❌ 后端服务器响应异常: {response.status_code}")
                return None
        except requests.exceptions.RequestException as e:
            print(f"❌ 无法连接到后端服务器: {e}")
            return None
            
    except Exception as e:
        print(f"❌ 启动后端服务器失败: {e}")
        return None

def test_api_endpoints():
    """测试API端点"""
    print("\n🔍 测试API端点...")
    
    endpoints = [
        ("健康检查", "GET", "/health"),
        ("获取领域", "GET", "/domains"),
        ("获取岗位", "GET", "/roles/人工智能"),
        ("获取面试问题", "GET", "/questions/人工智能/算法工程师"),
        ("静态分析测试", "GET", "/test-static-analysis"),
    ]
    
    for name, method, path in endpoints:
        try:
            if method == "GET":
                response = requests.get(f"http://localhost:8000{path}", timeout=5)
            else:
                response = requests.post(f"http://localhost:8000{path}", timeout=5)
            
            if response.status_code == 200:
                print(f"✅ {name}")
            else:
                print(f"❌ {name} - {response.status_code}")
                
        except Exception as e:
            print(f"❌ {name} - {e}")

def test_analysis_api():
    """测试分析API"""
    print("\n🔍 测试分析API...")
    
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
    
    try:
        response = requests.post(
            "http://localhost:8000/analyze-interview",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ 分析API测试成功")
            print(f"   雷达图分数: {result.get('radarChartScores', [])}")
            print(f"   关键问题数量: {len(result.get('feedbackData', {}).get('keyIssues', []))}")
            print(f"   改进建议数量: {len(result.get('feedbackData', {}).get('improvementSuggestions', []))}")
        else:
            print(f"❌ 分析API测试失败: {response.status_code}")
            print(f"   错误信息: {response.text}")
            
    except Exception as e:
        print(f"❌ 分析API测试异常: {e}")

def show_frontend_instructions():
    """显示前端启动说明"""
    print("\n" + "="*60)
    print("🌐 前端启动说明")
    print("="*60)
    print("1. 打开新的终端窗口")
    print("2. 进入前端目录: cd ../interview-web")
    print("3. 安装依赖: npm install")
    print("4. 启动前端服务: npm run serve")
    print("5. 在浏览器中访问: http://localhost:8080")
    print("\n📋 测试步骤:")
    print("1. 点击'测试分析功能'")
    print("2. 选择领域和岗位")
    print("3. 点击'测试静态数据分析'或'测试星火API分析'")
    print("4. 查看分析结果")
    print("="*60)

def main():
    """主函数"""
    print("🚀 多模态智能模拟面试评测系统 - 启动脚本")
    print("="*60)
    
    # 检查依赖
    if not check_python_dependencies():
        return
    
    # 启动后端服务器
    server_process = start_backend_server()
    if not server_process:
        print("❌ 无法启动后端服务器，请检查错误信息")
        return
    
    try:
        # 测试API端点
        test_api_endpoints()
        
        # 测试分析API
        test_analysis_api()
        
        # 显示前端启动说明
        show_frontend_instructions()
        
        print("\n✅ 系统启动完成!")
        print("按 Ctrl+C 停止后端服务器")
        
        # 保持服务器运行
        server_process.wait()
        
    except KeyboardInterrupt:
        print("\n🛑 正在停止服务器...")
        server_process.terminate()
        server_process.wait()
        print("✅ 服务器已停止")
    except Exception as e:
        print(f"❌ 系统运行异常: {e}")
        server_process.terminate()
        server_process.wait()

if __name__ == "__main__":
    main() 