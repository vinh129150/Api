@echo off
title Porry's Shared API
chcp 65001 >nul
cls
color 0A

echo ======================================
echo     https://discord.gg/R7S9tTh6Uy          
echo ======================================
echo.


set /p TOKEN=Enter your Discord Token: 

set /p PORT=Enter the API Port (default 3000): 
if "%PORT%"=="" set PORT=3000
if %PORT% LSS 1024 (
    echo [X] Port must be 1024 or higher!
    goto portInput
)
if %PORT% GTR 65535 (
    echo [X] Port must be 65535 or lower!
    goto portInput
)


echo TOKEN=%TOKEN% > .env
echo PORT=%PORT% >> .env
echo [V] Token and Port saved to .env!
echo.


echo [!] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    color 0C
    echo [X] Installation failed. Check your npm setup!
    pause
    exit /b
)
color 0A
echo [V] Dependencies installed successfully!
echo.

echo ======================================
echo [V] Setup completed! Run start.bat to launch the bot.
echo ======================================
pause
