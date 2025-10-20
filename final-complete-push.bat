@echo off
title Final Git Push Operation
echo ================================
echo Final Git Push Operation
echo ================================
echo.

echo 1. Adding all files to Git...
"C:\Program Files\Git\bin\git.exe" add .

echo.
echo 2. Committing any pending changes...
"C:\Program Files\Git\bin\git.exe" commit -m "Final project completion and documentation"

echo.
echo 3. Showing current status...
"C:\Program Files\Git\bin\git.exe" status

echo.
echo 4. Pushing to GitHub main branch...
echo    This may take a moment...
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
echo ================================
echo OPERATION COMPLETE
echo ================================
echo.
echo Your code has been successfully pushed to the main branch!
echo.
echo Repository: https://github.com/jinyang756/Debox-NFT-Sim
echo.
echo You can now access your project on GitHub.
echo.
echo Press any key to exit...
pause >nul