#!/bin/bash

# Generate a random NextAuth secret
echo "Generated NextAuth Secret:"
openssl rand -base64 32

echo ""
echo "Copy this value and replace 'your_nextauth_secret_here_replace_with_random_string' in your .env.local file"