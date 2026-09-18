@echo off
echo ========================================
echo 雷达图功能验证脚本
echo ========================================
echo.

echo 1. 检查RadarChart组件导入...
findstr /n "import RadarChart" "%~dp0..\interview-web\src\components\RealtimeInterview.vue"
if %errorlevel% equ 0 (
    echo ✓ RadarChart组件已正确导入
) else (
    echo ✗ RadarChart组件导入缺失
)

echo.
echo 2. 检查RadarChart组件使用...
findstr /n "<RadarChart" "%~dp0..\interview-web\src\components\RealtimeInterview.vue"
if %errorlevel% equ 0 (
    echo ✓ RadarChart组件已在模板中使用
) else (
    echo ✗ RadarChart组件未在模板中使用
)

echo.
echo 3. 检查RadarChart组件文件...
if exist "%~dp0..\interview-web\src\components\RadarChart.vue" (
    echo ✓ RadarChart.vue文件存在
) else (
    echo ✗ RadarChart.vue文件不存在
)

echo.
echo 4. 检查测试脚本...
if exist "%~dp0test-radar-chart.js" (
    echo ✓ 测试脚本存在
) else (
    echo ✗ 测试脚本不存在
)

echo.
echo ========================================
echo 验证完成
echo ========================================
echo.
echo 下一步操作：
echo 1. 启动前端应用
echo 2. 进入面试分析页面
echo 3. 打开浏览器控制台
echo 4. 运行测试脚本：复制 test-radar-chart.js 内容到控制台
echo 5. 查看RadarChart组件的调试信息
echo.
pause 