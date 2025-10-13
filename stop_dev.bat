@echo off
echo Stopping Laravel server...
taskkill /F /FI "WINDOWTITLE eq Laravel*" /T > nul 2>&1

echo Stopping React frontend...
taskkill /F /FI "WINDOWTITLE eq Frontend*" /T > nul 2>&1

echo Development servers stopped.
