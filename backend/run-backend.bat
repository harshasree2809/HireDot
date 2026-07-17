@echo off
echo ====================================================
echo Starting HireDot Backend (Cleaning old Eclipse files)
echo ====================================================
echo.

call .\mvnw clean spring-boot:run

pause
