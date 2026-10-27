FROM node:22-bookworm-slim AS build
ENV DIRR=/price-hub.frontend
WORKDIR $DIRR

RUN apt-get update && apt-get install -y libatomic1 --no-install-recommends && apt-get clean
RUN npm install -g pnpm@latest @angular/cli@21

ADD . $DIRR
RUN pnpm i --frozen-lockfile

RUN CI=1 pnpm build:prod

FROM nginx:1.27-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /price-hub.frontend/dist/price-hub/browser /usr/share/nginx/html
EXPOSE 80
