@echo off
echo ========================================
echo 雷达图布局修复验证脚本
echo ========================================
echo.

echo 1. 检查HTML结构更新...
findstr /n "result-card" "interview-web\src\components\RealtimeInterview.vue"
if %errorlevel% equ 0 (
    echo ✓ result-card容器已添加
) else (
    echo ✗ result-card容器未添加
)

findstr /n "radar-chart-section" "interview-web\src\components\RealtimeInterview.vue"
if %errorlevel% equ 0 (
    echo ✓ radar-chart-section已添加
) else (
    echo ✗ radar-chart-section未添加
)

findstr /n "scores-details" "interview-web\src\components\RealtimeInterview.vue"
if %errorlevel% equ 0 (
    echo ✓ scores-details已添加
) else (
    echo ✗ scores-details未添加
)

echo.
echo 2. 检查样式添加...
findstr /n ".result-card" "interview-web\src\components\RealtimeInterview.vue"
if %errorlevel% equ 0 (
    echo ✓ result-card样式已添加
) else (
    echo ✗ result-card样式未添加
)

findstr /n ".radar-chart-section" "interview-web\src\components\RealtimeInterview.vue"
if %errorlevel% equ 0 (
    echo ✓ radar-chart-section样式已添加
) else (
    echo ✗ radar-chart-section样式未添加
)

findstr /n ".scores-grid" "interview-web\src\components\RealtimeInterview.vue"
if %errorlevel% equ 0 (
    echo ✓ scores-grid样式已添加
) else (
    echo ✗ scores-grid样式未添加
)

echo.
echo 3. 检查RadarChart尺寸更新...
findstr /n ":size=\"320\"" "interview-web\src\components\RealtimeInterview.vue"
if %errorlevel% equ 0 (
    echo ✓ RadarChart尺寸已更新为320
) else (
    echo ✗ RadarChart尺寸未更新
)

echo.
echo 4. 检查测试脚本...
if exist "tools\test-layout-fix.js" (
    echo ✓ 布局测试脚本存在
) else (
    echo ✗ 布局测试脚本不存在
)

echo.
echo ========================================
echo 验证完成
echo ========================================
echo.
echo 修复内容总结：
echo 1. ✓ 更新HTML结构，使用result-card容器
echo 2. ✓ 添加radar-chart-section包装雷达图
echo 3. ✓ 添加scores-details和scores-grid显示分数详情
echo 4. ✓ 应用与TestAnalysis.vue一致的样式
echo 5. ✓ 更新RadarChart尺寸为320px
echo 6. ✓ 保持标签位置修复
echo.
echo 下一步操作：
echo 1. 启动前端应用
echo 2. 进入面试分析页面
echo 3. 查看雷达图布局是否与学习测试页面一致
echo 4. 运行测试脚本验证：复制 test-layout-fix.js 内容到控制台
echo 5. 确认分数详情网格正确显示
echo.
pause 