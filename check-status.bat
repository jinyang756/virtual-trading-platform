@echo off
echo ================================
echo Checking Git Status
echo ================================
echo.

echo Current branch status:
"C:\Program Files\Git\bin\git.exe" status

echo.
echo Recent commits:
"C:\Program Files\Git\bin\git.exe" log --oneline -5

echo.
echo Remote information:
"C:\Program Files\Git\bin\git.exe" remote -v

echo.
echo Branch information:
"C:\Program Files\Git\bin\git.exe" branch -v

echo.
pause