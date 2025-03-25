@echo off
echo Starting Backend Server...

start powershell -NoExit -Command "cd backend; .\env\Scripts\Activate.ps1; uvicorn app.main:app --reload"

echo Starting Frontend Server...
start powershell -NoExit -Command "cd frontend; npm run dev"

echo Both servers have been started!
