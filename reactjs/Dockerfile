ARG BASE_IMAGE

FROM library/nginx:alpine
ARG SOURCE=source
ARG WEB_CONTEXT_ROOT=/
ARG APP_USER=nginx

RUN rm /usr/share/nginx/html/*
COPY ${SOURCE}/build/ /usr/share/nginx/html${WEB_CONTEXT_ROOT}
COPY config/nginx.conf /etc/nginx/nginx.conf

USER ${APP_USER}

EXPOSE 8080