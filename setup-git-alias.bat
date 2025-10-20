@echo off
echo ================================
echo Setting up Git Aliases
echo ================================
echo.

echo Creating Git aliases...
"C:\Program Files\Git\bin\git.exe" config --global alias.st status
"C:\Program Files\Git\bin\git.exe" config --global alias.co checkout
"C:\Program Files\Git\bin\git.exe" config --global alias.br branch
"C:\Program Files\Git\bin\git.exe" config --global alias.ci commit
"C:\Program Files\Git\bin\git.exe" config --global alias.ps push
"C:\Program Files\Git\bin\git.exe" config --global alias.pl pull
echo.

echo Git aliases created:
echo   git st    = git status
echo   git co    = git checkout
echo   git br    = git branch
echo   git ci    = git commit
echo   git ps    = git push
echo   git pl    = git pull
echo.

echo Setup complete!