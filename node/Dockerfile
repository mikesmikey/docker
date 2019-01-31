FROM node:10.14.2
RUN apt-get update \
      && apt-get install -y --no-install-recommends \
      g++ \
      && rm -rf /var/lib/apt/lists/*
RUN npm install nodemon -g
ENV TZ=Asia/Bangkok
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY ./package.json /home/node/app/

# RUN npm install -g @babel/cli @babel/core @babel/polyfill @babel/preset-env @babel/node nodemon 
RUN npm install  --production=false



#

EXPOSE 4000
