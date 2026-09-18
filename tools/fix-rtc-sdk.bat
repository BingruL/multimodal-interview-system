@echo off
echo 正在修复RTC SDK加载问题...
echo.

cd /d "%~dp0..\interview-web"

echo 1. 清理node_modules...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo 2. 重新安装依赖...
npm install

echo 3. 检查RTC SDK版本...
npm list @volcengine/rtc

echo 4. 启动开发服务器...
echo 请在新窗口中运行: npm run start
echo.
echo 修复完成！请在浏览器中测试RTC功能。
pause 