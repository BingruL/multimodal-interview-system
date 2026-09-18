@echo off
echo ========================================
echo 雷达图标签位置修复验证脚本
echo ========================================
echo.

echo 1. 检查RadarChart组件模板结构...
findstr /n "label-labels" "interview-web\src\components\RadarChart.vue"
if %errorlevel% equ 0 (
    echo ✓ 文字标签容器已分离
) else (
    echo ✗ 文字标签容器未分离
)

findstr /n "score-labels" "interview-web\src\components\RadarChart.vue"
if %errorlevel% equ 0 (
    echo ✓ 数值标签容器已分离
) else (
    echo ✗ 数值标签容器未分离
)

echo.
echo 2. 检查位置计算函数...
findstr /n "getLabelPosition" "interview-web\src\components\RadarChart.vue"
if %errorlevel% equ 0 (
    echo ✓ 文字标签位置函数存在
) else (
    echo ✗ 文字标签位置函数缺失
)

findstr /n "getScorePosition" "interview-web\src\components\RadarChart.vue"
if %errorlevel% equ 0 (
    echo ✓ 数值标签位置函数存在
) else (
    echo ✗ 数值标签位置函数缺失
)

echo.
echo 3. 检查半径设置...
findstr /n "size / 2 + 40" "interview-web\src\components\RadarChart.vue"
if %errorlevel% equ 0 (
    echo ✓ 文字标签半径设置正确 (size/2 + 40)
) else (
    echo ✗ 文字标签半径设置错误
)

findstr /n "size / 2 + 20" "interview-web\src\components\RadarChart.vue"
if %errorlevel% equ 0 (
    echo ✓ 数值标签半径设置正确 (size/2 + 20)
) else (
    echo ✗ 数值标签半径设置错误
)

echo.
echo 4. 检查CSS样式...
findstr /n ".label-labels" "interview-web\src\components\RadarChart.vue"
if %errorlevel% equ 0 (
    echo ✓ 文字标签样式已定义
) else (
    echo ✗ 文字标签样式未定义
)

findstr /n ".score-item" "interview-web\src\components\RadarChart.vue"
if %errorlevel% equ 0 (
    echo ✓ 数值标签样式已定义
) else (
    echo ✗ 数值标签样式未定义
)

echo.
echo 5. 检查测试脚本...
if exist "tools\test-label-position.js" (
    echo ✓ 标签位置测试脚本存在
) else (
    echo ✗ 标签位置测试脚本不存在
)

echo.
echo ========================================
echo 验证完成
echo ========================================
echo.
echo 修复内容总结：
echo 1. ✓ 分离文字标签和数值标签容器
echo 2. ✓ 创建独立的位置计算函数
echo 3. ✓ 文字标签使用较大半径 (size/2 + 40)
echo 4. ✓ 数值标签使用较小半径 (size/2 + 20)
echo 5. ✓ 更新CSS样式支持新结构
echo.
echo 下一步操作：
echo 1. 启动前端应用
echo 2. 进入面试分析页面
echo 3. 查看雷达图标签位置
echo 4. 运行测试脚本验证：复制 test-label-position.js 内容到控制台
echo 5. 确认数值标签与数据点正确对齐
echo.
pause 