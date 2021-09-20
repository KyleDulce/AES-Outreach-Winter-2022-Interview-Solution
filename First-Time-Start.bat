@echo off
echo "Checking Requirements"
where node
if %ERRORLEVEL% NEQ 0 (
    echo "node was not found" 
    echo "Install node or check enviroment variables"
    PAUSE
    EXIT
)
where npm
if %ERRORLEVEL% NEQ 0 (
    echo "npm was not found" 
    echo "This shouldnt theoretically appear but... uhhh reinstall node?"
    PAUSE
    EXIT
)
echo "Setting up Enviroment"
npm init 

echo "Starting Server"
npm run start