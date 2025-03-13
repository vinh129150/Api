@echo off
title Porry's Shared API
chcp 65001 >nul
cls
color 0E

echo ======================================
echo     Porry - discord.gg/R7S9tTh6Uy       
echo ======================================
echo.

if not exist .env (
    color 0C
    echo [X] Error: .env file not found! Run setup.bat first.
    pause
    exit /b
)


echo [!] Launching the API...
node index.js
if %errorlevel% neq 0 (
    color 0C
    echo [X] Bot failed to start! Check your setup.
    pause
    exit /b
)

pause
