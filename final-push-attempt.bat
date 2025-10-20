@echo off
echo ================================
echo Final Push Attempt to GitHub
echo ================================
echo.

echo 1. Setting up Git credentials...
git config --global credential.helper store

echo.
echo 2. Checking current remote URL...
git remote -v

echo.
echo 3. Adding all files...
git add .

echo.
echo 4. Committing any pending changes...
git commit -m "Final project updates and Git setup"

echo.
echo 5. Pushing to GitHub main branch...
echo Please enter your GitHub username and password when prompted
git push origin main

echo.
if %errorlevel% == 0 (
    echo.
    echo ********************************
    echo * SUCCESS!                     *
    echo * Your code has been pushed to *
    echo * the main branch on GitHub.   *
    echo ********************************
    echo.
    echo Latest commits:
    git log --oneline -5
) else (
    echo.
    echo ********************************
    echo * FAILED                       *
    echo * Unable to push to GitHub.    *
    echo *                              *
    echo * Please check:                *
    echo * 1. Your internet connection  *
    echo * 2. Your GitHub credentials   *
    echo * 3. Repository permissions    *
    echo ********************************
)

echo.
echo Press any key to exit...
pause >nul