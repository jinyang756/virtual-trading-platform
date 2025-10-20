@echo off
echo ================================
echo Checking Git Push Status
echo ================================
echo.

echo Checking local branch status...
"C:\Program Files\Git\bin\git.exe" branch -v
echo.

echo Checking remote repository status...
"C:\Program Files\Git\bin\git.exe" remote -v
echo.

echo Checking commit history...
"C:\Program Files\Git\bin\git.exe" log --oneline -5
echo.

echo If push is taking too long, you can:
echo 1. Check network connection
echo 2. Try again later
echo 3. Or contact GitHub support
echo.