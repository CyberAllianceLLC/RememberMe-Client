FROM node:latest

# Start
WORKDIR /app
COPY ./ ./

# Install
RUN npm install

# Expose ports 8100
EXPOSE 8100

# Finish
CMD npm run ionic:serve -r 8100
