#!/usr/bin/env sh

node /scripts/setEnvVars
echo "$NGINX_HTPASSWD" > /etc/nginx/conf.d/.htpasswd 
nginx