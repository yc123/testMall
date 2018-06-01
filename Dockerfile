FROM node:8.10.0
RUN mkdir -p /app
WORKDIR /app
COPY . /app
RUN chmod +x run.sh
RUN yarn config set sass-binary-site http://npm.taobao.org/mirrors/node-sass -g
RUN yarn
CMD [ "bash", "run.sh" ]
