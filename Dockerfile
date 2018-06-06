FROM node:latest

# Start
WORKDIR ./app
COPY ./ ./

# Install
RUN npm install

# Expose ports 4200, 4210
EXPOSE 4200
EXPOSE 4210

# Finish
CMD npm run ionic:serve
