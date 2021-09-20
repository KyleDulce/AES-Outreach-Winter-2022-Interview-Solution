@echo off
echo "Checking Enviroment"
if exist ".\build" (
    echo "Starting Server"
    npm run soft-start
) else (
    echo "Enviroment was not setup. Run 'First-Time-Start.bat'"
)
PAUSE