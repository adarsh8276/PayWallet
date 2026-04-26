# Deployment Guide — PayWallet Full Stack

## Frontend: Deploy to Vercel (Free)

1. Push frontend to GitHub:
```bash
cd paywallet-frontend
git init
git add .
git commit -m "Initial PayWallet frontend"
git remote add origin https://github.com/YOUR_USERNAME/paywallet-frontend.git
git push -u origin main
```

2. Go to https://vercel.com → Import your GitHub repo
3. Set Environment Variable:
   - REACT_APP_API_URL = https://your-backend-url.com
4. Click Deploy → Done!

## Backend: Deploy to Railway (Free)

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select your Major_Project repo
3. Add each service as a separate Railway service
4. Set environment variables (DB URL, passwords)
5. Railway gives you a public URL like: https://user-service.up.railway.app

## Update Frontend to use deployed backend

In your deployed Vercel app, update the environment variable:
REACT_APP_API_URL = https://your-railway-gateway-url.up.railway.app

## Alternative: Deploy backend to Render.com

1. https://render.com → New → Web Service
2. Connect GitHub repo
3. Build Command: mvn clean install -DskipTests
4. Start Command: java -jar target/*.jar
5. Add environment variables for DB

## CORS Update for Production

In your gateway application.properties, update:
```
spring.cloud.gateway.server.webflux.globalcors.corsConfigurations.[/**].allowedOrigins=https://your-vercel-app.vercel.app
```
