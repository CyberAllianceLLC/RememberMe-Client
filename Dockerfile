FROM node:latest

# Start
WORKDIR ./app
COPY ./ ./

# Install
RUN npm install

# Expose ports 8100, 35729 and 53703
EXPOSE 8100 35729 53703

# Finish
CMD npm run ionic:serve
