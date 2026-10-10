#!/bin/bash
# Fasana Homes — Development Server
# Usage: ./start-dev.sh

echo "🏢 Fasana Homes — Starting Dev Server..."
echo "=================================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo "⚠️  No .env.local found. Copying from .env.example..."
  cp .env.example .env.local
  echo "   Please update .env.local with your Supabase credentials."
fi

echo ""
echo "🚀 Starting Next.js development server on http://localhost:3000"
echo "   Admin panel: http://localhost:3000/admin"
echo "   Login page:  http://localhost:3000/login"
echo ""

npm run dev
