@echo off
setlocal
call "%~dp0Invoke-PowerShell.cmd" "%~dp0..\tasks\Run-Android.ps1" %*
exit /b %ERRORLEVEL%
