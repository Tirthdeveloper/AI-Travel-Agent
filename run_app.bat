@echo off
title VoyageAI Travel Agent
echo ============================================================
echo   Starting VoyageAI AI Travel Agent...
echo   Opening in your web browser: http://127.0.0.1:8000
echo ============================================================
timeout /t 2 /nobreak >nul
start http://127.0.0.1:8000
python app.py
pause
