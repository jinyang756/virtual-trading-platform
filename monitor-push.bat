@echo off
echo ================================
echo Monitoring Git Push Progress
echo ================================
echo.

:loop
echo Checking push status at %date% %time%...
"C:\Program Files\Git\bin\git.exe" log --oneline -3
echo.
echo If the local and remote branches show the same commit, push is complete.
echo.
echo Press Ctrl+C to stop monitoring.
echo.
timeout /t 10 >nul
goto loop