@echo off
echo ================================
echo Completing Git Setup
echo ================================
echo.

echo 1. Checking current Git status...
"C:\Program Files\Git\bin\git.exe" status
echo.

echo 2. Adding all changes...
"C:\Program Files\Git\bin\git.exe" add .
echo.

echo 3. Committing changes...
"C:\Program Files\Git\bin\git.exe" commit -m "Complete project setup with Git tools"
echo.

echo 4. Setting up credential helper...
"C:\Program Files\Git\bin\git.exe" config --global credential.helper store
echo.

echo 5. Setup complete!
echo.
echo To push to GitHub:
echo 1. Run: "C:\Program Files\Git\bin\git.exe" push origin main
echo 2. Enter your GitHub username and password when prompted
echo 3. For subsequent pushes, credentials will be stored
echo.