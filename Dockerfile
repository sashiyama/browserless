FROM debian:buster-slim

ARG WORK_DIR=/app
WORKDIR $WORK_DIR

RUN apt-get update && apt-get install -y \
    fonts-freefont-ttf \
    curl \
    unzip \
    ca-certificates \
    libglib2.0-0 \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libxkbcommon0 \
    libxdamage1 \
    libxcomposite1 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    libgtk-3-0 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ENV PORT=80

EXPOSE $PORT

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs
RUN npm init -y && npm install express express-ws ws puppeteer

COPY ./server.js .

ENTRYPOINT node server.js
