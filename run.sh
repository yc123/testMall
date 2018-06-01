#!/bin/sh
echo "NODE_ENV: $NODE_ENV"
echo "BASE_URL: $BASE_URL"
echo "COMMON_URL: $COMMON_URL"
if [ "$NODE_ENV" == 'production' ]; then
  npm run build
  npm run start
else
  npm run dev-start
fi
