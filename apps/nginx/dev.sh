#!/bin/bash

NGINX_CONF_PATH="$(pwd)/nginx.dev.conf"
NGINX_PID=$(pgrep nginx)

# 1. nginx 설치 여부 확인
if ! command -v nginx &> /dev/null; then
  echo "❌ nginx가 설치되어 있지 않습니다. 설치 후 다시 실행해주세요."
  exit 1
fi

# 2. nginx 실행 여부 확인
if [ -z "$NGINX_PID" ]; then
  echo "🔹 nginx가 실행 중이 아닙니다. dev 설정으로 서버를 시작합니다..."
  nginx -c "$NGINX_CONF_PATH"
else
  echo "🔁 nginx가 이미 실행 중입니다. dev 설정으로 서버를 다시 시작합니다..."
  nginx -s reload -c "$NGINX_CONF_PATH"
fi
  echo "🚀 nginx 실행 완료!"