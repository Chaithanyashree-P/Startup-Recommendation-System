@echo off
title Gram Udyam AI Launcher (SDG 8 Full Stack)
cd /d "%~dp0"

echo ======================================================================
echo    GRAM UDYAM AI - RURAL ENTREPRENEURSHIP ADVISOR
echo    AI Engine + Live API Pipeline (Section 6 & 8 compliant)
echo ======================================================================
echo.

set PATH=%PATH%;C:\Program Files\nodejs;C:\Python314;C:\Python314\Scripts;%APPDATA%\Python\Python314\Scripts

echo [1/3] Starting FastAPI Backend on http://localhost:8000 ...
start "Gram Udyam AI Backend" cmd /k "cd /d "%~dp0" && "C:\Python314\python.exe" backend\main.py"

echo [2/3] Initializing servers...
timeout /t 3 /nobreak >nul

echo [3/3] Opening browser at http://localhost:3000 ...
start http://localhost:3000

echo.
echo Starting Next.js Frontend server...
call "C:\Program Files\nodejs\npm.cmd" run dev

if errorlevel 1 (
    echo.
    echo Next.js exited with an error. Press any key to close...
    pause >nul
)
