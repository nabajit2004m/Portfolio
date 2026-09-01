@echo off
echo ==========================================
echo Starting Portfolio (Chatbot + UI)
echo ==========================================

echo Cleaning up any old hanging ghost servers...
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :5000') DO (
  TaskKill.exe /PID %%T /F 2>nul
)
FOR /F "tokens=5" %%T IN ('netstat -a -n -o ^| findstr :5173') DO (
  TaskKill.exe /PID %%T /F 2>nul
)

echo [1/2] Starting Backend Node Server for Google Gemini Integration...
start cmd /k "node server/server.js"

echo [2/2] Starting Frontend Vite App Server...
start cmd /k "npm run dev"

echo Waiting 5 seconds for systems to fully come online...
ping 127.0.0.1 -n 6 > nul

echo Opening your App in the Browser!
start http://localhost:5173

echo Ready! You can monitor the API key rotation sequentially in the open black CMD window.
