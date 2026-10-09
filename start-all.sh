#!/bin/bash
# Blue Pillar Management — Full Development Environment
# Usage: ./start-all.sh

echo "🏢 Blue Pillar Management — Full Dev Environment"
echo "================================================="

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
echo "📋 Checklist before starting:"
echo "   1. Supabase project created? (https://supabase.com)"
echo "   2. Database schema applied? (run supabase/schema.sql in SQL Editor)"
echo "   3. .env.local updated with SUPABASE_URL and SUPABASE_ANON_KEY?"
echo "   4. Storage bucket 'property-images' created? (Public)"
echo ""
echo "🚀 Starting Next.js development server..."
echo "   🌐 Public site:  http://localhost:3000"
echo "   🔐 Admin panel:  http://localhost:3000/admin"
echo "   🔑 Login page:   http://localhost:3000/login"
echo ""

npm run dev
