FROM nginx:stable

RUN apt-get update && \
    apt-get install -y jq curl gettext && \
    rm -rf /var/lib/apt/lists/*

COPY nginx.op.template.conf /etc/nginx/nginx.op.template.conf
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]