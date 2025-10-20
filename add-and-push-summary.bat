@echo off
echo ================================
echo Adding and Pushing Summary Report
echo ================================
echo.

echo 1. Adding GIT_PUSH_SUMMARY.md to Git...
"C:\Program Files\Git\bin\git.exe" add GIT_PUSH_SUMMARY.md

echo.
echo 2. Committing the summary report...
"C:\Program Files\Git\bin\git.exe" commit -m "Add Git push summary report"

echo.
echo 3. Setting up SSH known hosts...
echo github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl >> "%USERPROFILE%\.ssh\known_hosts" 2>nul

echo.
echo 4. Pushing to GitHub main branch...
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
if %errorlevel% == 0 (
    echo ********************************
    echo * SUCCESS!                     *
    echo * Summary report has been      *
    echo * pushed to the main branch.   *
    echo ********************************
) else (
    echo ********************************
    echo * FAILED                       *
    echo * Unable to push summary.      *
    echo ********************************
)

echo.
pause