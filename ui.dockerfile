ARG APP_ENV=dev

FROM node:14 as builder

# Add Build Assets
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
ADD ./client/ /usr/src/app/

# Install Build Deps
RUN yarn
WORKDIR /usr/src/app/packages/ui
RUN yarn build

FROM nginx:alpine as final

# Install Runtime Deps
RUN apk add --update nodejs npm

# Add Runtime Assets
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /usr/src/app/packages/ui/build .

# Configure nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/packages/ui/nginx.conf /etc/nginx/conf.d
RUN echo "daemon off;" >> /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx"]