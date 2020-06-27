FROM ubuntu

WORKDIR /usr/src/

RUN apt-get update
RUN apt-get install nodejs -y
RUN apt-get install npm -y
RUN apt-get install git -y

RUN git clone https://github.com/RyanElliottGit/FarkleBot.git

RUN cd FarkleBot/

RUN npm install discord.js --save

ENTRYPOINT node FarkleBot/server.js
