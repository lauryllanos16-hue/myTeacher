@echo off
echo Iniciando Docker...
cd Docker
docker compose up -d
echo.
echo Iniciando Backend...
cd ..\backend
start cmd /k "npm run dev"
echo.
echo Todo listo!
echo Backend: http://localhost:3000
echo phpMyAdmin: http://localhost:8080
pause