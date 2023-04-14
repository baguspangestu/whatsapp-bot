FROM node:lts-alpine

# Install Chromium dependencies
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont

ENV NODE_ENV=production
# Set the path for executable binary Chromium
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium-browser"
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
RUN chown -R node /usr/src/app
USER node

# Add command to launch the app with Chromium
CMD ["npm", "start", "--no-optional", "--", "--disable-setuid-sandbox", "--no-sandbox"]
