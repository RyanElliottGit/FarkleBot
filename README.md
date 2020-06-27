<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/FxL5qM0.jpg" alt="Bot logo"></a>
</p>

<h1 align="center">Farkle bot</h1>

<div align="center">

<!--
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![Platform](https://img.shields.io/badge/platform-discord-blue)](https://www.reddit.com/user/Wordbook_Bot)
-->
[![GitHub Issues](https://img.shields.io/github/issues/RyanElliottGit/FarkleBot.svg)](https://github.com/RyanElliottGit/FarkleBot/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/RyanElliottGit/FarkleBot.svg)](https://github.com/RyanElliottGit/FarkleBot/pulls)
[![License](https://img.shields.io/github/license/RyanElliottGit/FarkleBot.svg)](/LICENSE)

</div>

---

<p align="center"> 🤖 This is a bot that uses the discord chat functionality, within servers, to let people play Farkle.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)<!-- - [Demo / Working](#demo) -->
- [How it works](#working)
- [Usage](#usage)
- [Getting Started](#getting_started)<!-- - [Deploying your own bot](#deployment) -->
- [Built Using](#built_using)
- [TODO](../FarkleBot/TODO.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

This bot was created to enable people to play Farkle using the discord chat function on any servers that would like to use it. In future it may also support more games, but it is more likely that it gets ported over to Typescript first as it allows static typing and classes; if it does get ported it will be linked in this readme and it will be public on this same Github account. 
This bot is more easily deployed with Docker but can also be deployed just using the node command in Node.js (description on how to do both of those below).
For a rundown of the rules of Farkle please head to [this link](https://www.dicegamedepot.com/farkle-rules/)

<!--## 🎥 Demo / Working <a name = "demo"></a>

![Working](https://media.giphy.com/media/20NLMBm0BkUOwNljwv/giphy.gif)Need to add working GIF here-->

## 💭 How it works <a name = "working"></a>

For the time being, until the bot is ported over to Typescript where classes are supported, the bot  only allows for one game to go on. This game could in theory span across multiple servers, however the response to the issued command is only sent to the specific channel that the command was issued from so players would only see half a game.

The bot cleans up any command that the player issues by using the message.delete() function of the discord api, any errors are caught to the console.

When players join their ID and name is added to a small class which also contains their score, this is added to an array which it iterated over in order to get the game order. 

When the game is started the gamePlaying bool is set to true, this is used to enable the use of the gameplay commands and disable the use of the join and start commands. If the game is started with a number as a variable it sets the game end score to that.

Rolling uses the Math library to get a random number between zero and one, then times it by six and rounds it downward to the nearest integer. Then by adding one to this it gives a random number between one and six. These numbers are pushed to an array of rolls which is then bubblesorted. The numbers are formatted into an output and sent to the channel.

The keep function separates out the arguments of which dice to save, then calculates the score for them and rolls a new set of dice where the size is based on the number of dice kept. If the keep command is sent with the argument all the score is calculated and the endTurn function is executed. This checks to see if the player has got a winning score and then moves it to the next player, or ends the game as necessary.

The score is calculated through a for loop with iterates through the number of dice and a series of nested IF statements which keep track of the number of ones and fives; as well as pairs, triplets and if a quartet exists.

The entire bot is written in Javascript.

## 🎈 Usage <a name = "usage"></a>

To get the bot to display a list of commands type:

```
-help
```

This displays a list of all of the commands except -end as to use this you have to set your discord ID to the one on line 54, to find your ID please use [this link.](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-)

To join the game type:

```
-join
```

This joins into the pool of players and will output a message saying that you have joined.

---

To start the game type:

```
-start
```

This starts the game, outputs the players who have joined and outputs the name of the first player to roll.

### Example:

> -start

**Example:**

```
The game has been started, the players who have joined are: 
Ryan
Dylan
Ryan use -roll to start!
```

Alternatively, you can start the game with an end game score specified as a argument.

### Example:

> -start 5000

**Example:**

```
The game has been started, the game end score is 5000 and the players who have joined are:
Ryan
Dylan
Ryan use -roll to start!
```

---

To roll your dice type:

```
-roll
```

This will roll six dice and tell you their scores, they are given in ascending order to make it easier to spot scoring groups.

### Example:

> -roll

**Example:**
```
Ryan is rolling:
Dice number 1 rolled 1
Dice number 2 rolled 3
Dice number 3 rolled 4
Dice number 4 rolled 4
Dice number 5 rolled 4
Dice number 6 rolled 6
```
---

To keep dice type:

```
-keep 
```

This will allow you to keep any number of dice by listing the dice number separated by a space.

### Example:

> -roll\
> -keep 3 4 5

**Example:**

```
Ryan is rolling:
Dice number 1 rolled 1
Dice number 2 rolled 3
Dice number 3 rolled 4
Dice number 4 rolled 4
Dice number 5 rolled 4
Dice number 6 rolled 6
```

Dice number three, four and five will be kept, the remaining three dice will then be rolled and their numbers output

```
Ryan is rolling:
Dice number 1 rolled 2
Dice number 2 rolled 5
Dice number 3 rolled 6
```

### Example:

> -roll\
> -keep all

**Example:**

```
Ryan is rolling:
Dice number 1 rolled 1
Dice number 2 rolled 3
Dice number 3 rolled 4
Dice number 4 rolled 4
Dice number 5 rolled 4
Dice number 6 rolled 6
```
```
Ryan your score is: 500.
Dylan is next to play.
```

---

To find out your score for the game type:

```
-score
```

This will return your score.

### Example:

> -score

**Example:**

```
Ryan your score is: 500.
```

---

To end your game if you have added your ID to the code type:

```
-end
```

This will end the game.

### Example:

> -end

**Example:**

```
The game has been ended by a higher power.
```

---

To clear a number of the bots commands from the server you can use the following command, however you will have to add your ID to to the code:

```
-clear
```

### Example:

> -clear 10

This will clear the last 10 messages the bot sent.

---

<sup>Beep boop. I am a bot. If there are any issues, contact my [Master](mailto:ryanelliott98@hotmail.com)</sup>

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Running Locally

#### Clone or download the repository

```
$ git clone https://github.com/RyanElliottGit/FarkleBot.git
$ cd FarkleBot
```

#### Install Dependencies

```
$ sudo apt-get install nodejs
$ npm install discord.js --save
```

#### Setting up the Discord Developer Portal Bot

Go to [Discord's bot portal](https://discordapp.com/developers/applications/), and create a new application. Then go to the bot tab on the left of the page and click add bot. This will be your bot which you can add to any server that you are an admin of.

#### Adding the bot to your server

To add the bot to your server, navigate to the OAuth2 page in the discord developer portal and select the bot checkbox in the scopes tab. 

After that you can choose which permissions to give the bot, the bot currently requires the Send Messages, Manage Messages and Embed Links permissions.

You can then copy the url that has appeared at the bottom of the scopes tab. When you go to this link it will give you the option to add the bot to any server that you are an admin of.

Once you have done this go to your file folder and create a new file called token.json. In the file add the following lines (substituting TokenHere for your token which can be found on the bot page of your developer portal):

```
{
    "token": "TokenHere"
}
```

#### Running the bot

To run the bot simply navigate to the file folder in the terminal use the following command:

```
$ node server.js
```

## 🚀 Deploying your own bot <a name = "deployment"></a>

For easy deployment please use the Docker project that I have created [located here.](https://hub.docker.com/repository/docker/ryanelliotthub/farkle_bot) The page has a detailed readme.md that covers deployment. This should work on x86/x64 architectures and will always use the current version of this project. 

## ⛏️ Built Using <a name = "built_using"></a>

- [Discord.js](https://discord.js.org/#/) - JavaScript Discord API wrapper
- [Node.js](https://nodejs.org/en/) - Server Environment

## ✍️ Authors <a name = "authors"></a>

- [@RyanElliott](https://github.com/RyanElliottGit) - Idea & work

<!--See also the list of [contributors](https://github.com/*TheLinkHere*/contributors) who participated in this project.

## 🎉 Acknowledgements <a name = "acknowledgement"></a>

- Hat tip to anyone whose code was used
- Inspiration
- References
-->