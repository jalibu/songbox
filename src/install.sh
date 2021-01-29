#!/usr/bin/env bash

sudo npm install yarn --global
yarn install
grunt build

cd /tmp
wget https://github.com/aeberhardo/phantomjs-linux-armv6l/archive/master.zip
unzip master.zip
cd phantomjs-linux-armv6l-master
bunzip2 *.bz2 && tar xf *.tar
sudo cp phantomjs-1.9.0-linux-armv6l/bin/phantomjs  /usr/bin