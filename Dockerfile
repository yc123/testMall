FROM node:8.0.0

RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN chmod +x run.sh

RUN export SASS_BINARY_PATH=linux_musl-x64-57_binding.node
RUN export PATH=$PATH:$SASS_BINARY_PATH

RUN npm install
RUN npm run build

CMD [ "bash", "/app/run.sh" ]
