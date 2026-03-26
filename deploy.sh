#!/bin/bash

echo "🏥 ENARM Pro - Deployment Script"
echo "=================================="

# 1. Install Vercel CLI
echo "📦 Installing Vercel CLI..."
npm i -g vercel

# 2. Login to Vercel
echo "🔐 Logging in to Vercel..."
vercel login

# 3. Link project
echo "🔗 Linking project..."
vercel link

# 4. Deploy to production
echo "🚀 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your site is live at: https://enarmpro.vercel.app"
