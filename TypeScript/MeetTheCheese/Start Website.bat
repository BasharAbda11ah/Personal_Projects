@echo off
setlocal
title Meet The Cheese - local website
rem Starts the local development server for this website. It does not install or change anything.
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  Node.js was not found on this computer.
  echo  Install the LTS version from https://nodejs.org , then double-click this file again.
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo  npm was not found. Reinstall Node.js LTS from https://nodejs.org , then try again.
  echo.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo.
  echo  The website's dependencies are not installed yet.
  echo  Open a terminal in this folder and run:   npm install
  echo  Then double-click this file again.
  echo.
  pause
  exit /b 1
)

echo.
echo  Starting the Meet The Cheese website...
echo  When you see "Local: http://localhost:5173", open that address in your browser.
echo  (If port 5173 is busy, use the address shown below instead.)
echo  Keep this window open while you use the site. Press Ctrl+C to stop.
echo.
call npm run dev
echo.
pause
