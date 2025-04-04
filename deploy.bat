@echo off
echo Dream Trip Planner - Netlify Deployment Helper
echo =============================================
echo.

echo Checking if Netlify CLI is installed...
npx netlify --version > nul 2>&1
if %errorlevel% neq 0 (
  echo Installing Netlify CLI...
  npm install -g netlify-cli
)

echo.
echo Starting Netlify deployment process...
echo.
echo This script will help you deploy your Dream Trip Planner to Netlify.
echo You can choose to use either localStorage or Supabase as your backend.
echo.

choice /C LS /M "Choose your backend: [L]ocalStorage or [S]upabase"
if %errorlevel% equ 1 (
  echo.
  echo Deploying with localStorage backend...
  echo.
  npx netlify deploy --dir frontend
) else (
  echo.
  echo Deploying with Supabase backend...
  echo.
  echo Please enter your Supabase URL:
  set /p SUPABASE_URL=
  echo.
  echo Please enter your Supabase anon key:
  set /p SUPABASE_KEY=
  echo.
  
  echo Updating Supabase configuration...
  echo const supabaseUrl = '%SUPABASE_URL%' > temp.txt
  echo const supabaseKey = '%SUPABASE_KEY%' >> temp.txt
  
  powershell -Command "(Get-Content 'frontend\src\js\supabase-api.js') -replace 'const supabaseUrl = ''YOUR_SUPABASE_URL''', (Get-Content temp.txt)[0] | Set-Content 'frontend\src\js\supabase-api.js'"
  powershell -Command "(Get-Content 'frontend\src\js\supabase-api.js') -replace 'const supabaseKey = ''YOUR_SUPABASE_ANON_KEY''', (Get-Content temp.txt)[1] | Set-Content 'frontend\src\js\supabase-api.js'"
  del temp.txt
  
  echo Deploying to Netlify...
  npx netlify deploy --dir frontend
)

echo.
echo Deployment process completed!
echo.
echo If you want to make this deployment your production site, run:
echo npx netlify deploy --dir frontend --prod
echo.
pause
