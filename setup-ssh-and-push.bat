@echo off
echo ================================
echo Setting up SSH and Pushing to GitHub
echo ================================
echo.

echo 1. Generating SSH key...
echo Please enter your email address when prompted (or press Enter for default):
"C:\Program Files\Git\bin\ssh-keygen.exe" -t rsa -b 4096 -C "user@example.com"

echo.
echo 2. Starting ssh-agent...
"C:\Program Files\Git\bin\ssh-agent.exe" -s

echo.
echo 3. Adding SSH key to ssh-agent...
"C:\Program Files\Git\usr\bin\ssh-add.exe" ~/.ssh/id_rsa

echo.
echo 4. Changing remote URL to SSH...
"C:\Program Files\Git\bin\git.exe" remote set-url origin git@github.com:jinyang756/Debox-NFT-Sim.git

echo.
echo 5. Pushing to GitHub via SSH...
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
if %errorlevel% == 0 (
    echo Successfully pushed to GitHub via SSH!
    echo.
    echo Your code is now available on the main branch.
) else (
    echo Failed to push to GitHub via SSH.
    echo.
    echo Let's try one more time with HTTPS and stored credentials:
    echo.
    "C:\Program Files\Git\bin\git.exe" config --global credential.helper store
    "C:\Program Files\Git\bin\git.exe" push origin main
)

echo.
echo Setup complete!
pause