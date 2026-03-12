@echo off
setlocal

if "%~1"=="" (
  echo Missing PowerShell script path.
  exit /b 1
)

set "SCRIPT_PATH=%~1"
shift
set "SCRIPT_ARGS="

:collect_args
if "%~1"=="" goto run_script
set "SCRIPT_ARGS=%SCRIPT_ARGS% "%~1""
shift
goto collect_args

:run_script

set "POWERSHELL_EXE="

if exist "%ProgramFiles%\PowerShell\7\pwsh.exe" (
  set "POWERSHELL_EXE=%ProgramFiles%\PowerShell\7\pwsh.exe"
)

if not defined POWERSHELL_EXE if exist "%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe" (
  set "POWERSHELL_EXE=%SystemRoot%\System32\WindowsPowerShell\v1.0\powershell.exe"
)

if not defined POWERSHELL_EXE (
  echo PowerShell executable was not found.
  exit /b 1
)

"%POWERSHELL_EXE%" -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_PATH%" %SCRIPT_ARGS%
exit /b %ERRORLEVEL%
