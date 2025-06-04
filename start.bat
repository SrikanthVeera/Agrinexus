@echo off
echo AgroTech Nexus Application Launcher
echo ===================================

:menu
echo.
echo Choose an option:
echo 1. Start application (backend and frontend)
echo 2. Set up OpenAI API key
echo 3. Configure database
echo 4. Check database connection
echo 5. Exit
echo.
set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto start_app
if "%choice%"=="2" goto setup_openai
if "%choice%"=="3" goto setup_db
if "%choice%"=="4" goto check_db
if "%choice%"=="5" goto end
goto menu

:start_app
echo.
echo Starting AgroTech Nexus application...

echo Starting backend server...
start cmd /k "cd backend && npm start"

echo Starting frontend...
start cmd /k "cd frontend && npm start"

echo Both servers are starting. Please wait a moment...
echo Backend will be available at http://localhost:5001
echo Frontend will be available at http://localhost:3000
goto end

:setup_openai
echo.
echo Setting up OpenAI API key...
node setup-openai.js
pause
goto menu

:setup_db
echo.
echo Configuring database...
node setup-db.js
pause
goto menu

:check_db
echo.
echo Checking database...
cd backend && node checkDb.js
pause
goto menu

:end
echo.
echo Thank you for using AgroTech Nexus!