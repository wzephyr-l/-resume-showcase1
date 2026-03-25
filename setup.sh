#!/bin/bash

# Resume Showcase - Quick Start Guide
# This script helps you set up and run the Resume Showcase application

set -e

echo "🚀 Resume Showcase - Setup Guide"
echo "================================"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✓ Node.js version: $NODE_VERSION"

# Check if .env.local exists
if [ -f .env.local ]; then
    if grep -q "sk-ant-v1-" .env.local; then
        echo "✓ .env.local is configured with API key"
    else
        echo "⚠️  .env.local exists but needs your Claude API key"
        echo "   Please update .env.local with your API key from https://console.anthropic.com"
    fi
else
    echo "⚠️  .env.local not found. Copy from .env.local.example:"
    echo "   cp .env.local.example .env.local"
    echo "   Then add your Claude API key"
fi

echo ""
echo "Next steps:"
echo "1. Update .env.local with your Claude API key"
echo "2. Run: npm run dev"
echo "3. Open: http://localhost:3000"
echo ""
echo "💡 Tips:"
echo "   - First upload might take 10-15 seconds (Claude parsing)"
echo "   - Resumes expire after 30 days"
echo "   - Check ./data/resumes.db for stored data"
echo ""
