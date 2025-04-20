FROM amazonlinux:2023

RUN dnf -y update && \
    dnf install -y nginx jq gettext curl && \
    dnf clean all

COPY nginx.op.template.conf /etc/nginx/nginx.op.template.conf
COPY entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
