FROM 10.10.100.200:5000/node-webpack:0.0.1

RUN mkdir -p /app
WORKDIR /app

COPY . /app

RUN chmod +x run.sh

RUN export SASS_BINARY_PATH=linux_musl-x64-57_binding.node
RUN export PATH=$PATH:$SASS_BINARY_PATH

RUN cnpm install
RUN npm run build

CMD [ "/app/run.sh" ]
