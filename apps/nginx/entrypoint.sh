#!/bin/bash

set -e

echo "📡 Fetching ECS Metadata..."
TASK_METADATA=$(curl -s "$ECS_CONTAINER_METADATA_URI_V4/task")

extract_port() {
  echo "$TASK_METADATA" | jq -r \
    --arg name "$1" --argjson cport "$2" \
    '.Containers[] | select(.Name == $name) | .PortMappings[] | select(.ContainerPort == $cport) | .HostPort'
}

export API_PORT=$(extract_port "server-api" 7777)
export AUTH_PORT=$(extract_port "server-auth" 5555)
export CLIENT_PORT=$(extract_port "client-weplate" 1111)

echo "✅ server-api → $API_PORT"
echo "✅ server-auth → $AUTH_PORT"
echo "✅ client-weplate → $CLIENT_PORT"

# 템플릿에서 conf 생성
envsubst '$API_PORT $AUTH_PORT $CLIENT_PORT' < /etc/nginx/nginx.op.template.conf > /etc/nginx/nginx.conf

# nginx 실행
exec nginx -g 'daemon off;'
