#!/bin/sh
echo "NODE_ENV: $NODE_ENV"
echo "BASE_URL: $BASE_URL"
echo "COMMON_URL: $COMMON_URL"
npm run build
npm run start
