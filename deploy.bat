@echo off
cd C:\projects\monster-vocab
git add .
set /p msg=Update message: 
git commit -m "%msg%"
git push origin main
npm run build
cd dist
git add .
git commit -m "deploy: %msg%"
git push origin master:gh-pages --force
cd ..
echo Done!
pause
