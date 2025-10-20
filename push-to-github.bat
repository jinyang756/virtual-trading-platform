@echo off
echo ================================
echo Pushing to GitHub Main Branch
echo ================================
echo.

echo Pushing changes to origin main...
"C:\Program Files\Git\bin\git.exe" push origin main
echo.

if %errorlevel% == 0 (
    echo Successfully pushed to GitHub!
    echo.
    echo Your code is now available on the main branch.
    echo.
    echo Showing recent commits:
    "C:\Program Files\Git\bin\git.exe" log --oneline -5
) else (
    echo Failed to push to GitHub.
    echo Please check your internet connection and GitHub credentials.
)
echo.
pause