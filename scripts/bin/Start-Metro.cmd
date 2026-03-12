@echo off
setlocal
call "%~dp0Invoke-PowerShell.cmd" "%~dp0..\tasks\Start-Metro.ps1" %*
exit /b %ERRORLEVEL%
