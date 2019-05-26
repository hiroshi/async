FROM ruby:2.6.3
RUN curl -s https://nodejs.org/dist/v10.15.3/node-v10.15.3-linux-x64.tar.xz | tar xJf -
ENV PATH=/node-v10.15.3-linux-x64/bin:$PATH
RUN npm i -g yarn
WORKDIR /app
