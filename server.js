const Discord = require("discord.js");
const { prefix } = require("./package.json");
const { token } = require("./token.json");

const client = new Discord.Client();

var playerList = new Array();
var playerTurn = 0;
var gamePlaying = false;
var rolls = new Array();
var tempScore = 0;
var gameEndScore = 10000;
var endGame = false;
var topPlayer;

class Player {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.score = 0;
    }
}

//game class, check if channel has game, if not assign one.

client.once("ready", () => {
    console.log("Ready!");
});

client.on("message", async message => {
    if (message.author.bot) {
        console.log(message.author.id);
        return;
    }
    if (!message.content.startsWith(prefix)) return;
    if (message.content.startsWith(`${prefix}help`)) {
        Help(message);
    }
    if (message.content.startsWith(`${prefix}clear`) && message.author.id == "211906242157871106") {
        Clear(message);
    }
    if (gamePlaying) {
        if (message.content.startsWith(`${prefix}roll`)) {
            if (message.author.id == playerList[playerTurn].id) {
                Roll(message, 6);
            } else {
                message.channel.send(`It is ${playerList[playerTurn].name}'s turn to play.`);
            }
        } else if (message.content.startsWith(`${prefix}keep`)) {
            if (message.author.id == playerList[playerTurn].id) {
                Keep(message);
            } else {
                message.channel.send(`It is ${playerList[playerTurn].name}'s turn to play.`);
            }
        } else if (message.content.startsWith(`${prefix}score`)) {
            Score(message);
        } else if (message.content.startsWith(`${prefix}end`) && message.author.id == "211906242157871106") {
            GameEnd(message);
        }
    } else {
        if (message.content.startsWith(`${prefix}join`)) {
            Join(message);
        } else if (message.content.startsWith(`${prefix}start`)) {
            Start(message);
        }
    }
    message.delete().catch(console.error);
});

function Help(message) {
    return message.channel.send({ embed });
}

const embed = {
    "title": "Command:",
    "description": "(-join): Joins the game if it has not started yet.\
\n(-start): Starts the game.\
\n(-roll): Rolls the dice but only if it is your turn.\
\n(-keep all): Keeps all of the dice.\
\n(-Keep 1 4 6): Keeps each die that is selected, seperated by a space. The example keeps the first, fourth and sixth dice.\
\n(-score): This command tells you what your current score is.\
\nFor game instructions please go to [this website.](https://www.dicegamedepot.com/farkle-rules/)\
\nThis game uses a variant rule where you can score with three pairs.",
    "thumbnail": {
        "url": "https://www.ultraboardgames.com/farkle/gfx/nano1.jpg"
    }
}

function Clear(message) {
    const args = message.content.split(" ");
    for (i = 0; i < args[1]; i++) {
        message.channel.messages.fetch({ limit: args[1] }).then(msg => {
            console.log(msg);
            if (true) {
                msg.last().delete();
            }
        })
    }
}

function Join(message) {
    for (i = 0; i < playerList.length; i++) {
        if (playerList[i].id == message.author.id) {
            return message.channel.send(`${playerList[i].name} you have already joined!`);
        }
    }
    const player = new Player(message.author.id, message.author.username);
    playerList.push(player);
    message.channel.send(`${player.name} has joined the game!`)
}

//possibly just automate with links to click instead of using commands to call rolls
function Start(message) {
    const args = message.content.split(" ");
    if (args.length > 1) {
        //needs validation
        gameEndScore = args[1];
    }
    var playerListMessage = `The game has been started, the game end score is ${gameEndScore} and the players who have joined are: \n`
    gamePlaying = true;
    for (i = 0; i < playerList.length; i++) {
        playerListMessage = playerListMessage.concat(playerList[i].name + "\n");
    }
    message.channel.send(playerListMessage);
    message.channel.send(`${playerList[playerTurn].name} use -roll to start!`);
}

function Roll(message, amount) {
    var returnMessage = "";
    rolls = new Array();
    for (i = 0; i < amount; i++) {
        var number = (Math.floor(Math.random() * 6) + 1);
        rolls.push(number);
    }
    rolls = bubbleSort(rolls);
    returnMessage += "```" + playerList[playerTurn].name + " is rolling:\n"
    for (i = 0; i < amount; i++) {
        returnMessage += "Dice number " + (i + 1) + " rolled " + rolls[i] + "\n";
    }
    returnMessage += "```";
    message.channel.send(returnMessage);
}

function Keep(message) {
    const args = message.content.split(" ");
    if (args[1] == "all") {
        var score = CalculateScore(rolls);
        if (score > 0) {
            playerList[playerTurn].score += score + tempScore;
            if (endGame && playerList[playerTurn].score > topPlayer.score) {
                topPlayer = playerList[playerTurn];
            } else if (playerList[playerTurn].score >= gameEndScore) {
                message.channel.send(`${playerList[playerTurn].name} has reached the endgame, the remaining people only have one turn to beat them.`)
                endGame = true;
                topPlayer = playerList[playerTurn];
            }
        }
        EndTurn(message);
    } else {
        var rollSet = new Array();
        console.log(args);
        for (i = args.length; i > 1; i--) {
            rollSet.push(rolls[args[i - 1] - 1]);
            rolls.splice(i - 1, 1);
        }
        var score = CalculateScore(rollSet);
        if (score > 0) {
            tempScore += score;
            Roll(message, rolls.length);
        } else {
            EndTurn(message);
        }
    }
}

function EndTurn(message) {
    message.channel.send(`${playerList[playerTurn].name} your score is: ${playerList[playerTurn].score}. `);
    playerTurn++;
    tempScore = 0;
    if (playerTurn >= playerList.length) {
        if (endGame) {
            message.channel.send(`The game is over, the winner is: ${topPlayer.name} congratulations!`);
            return;
        } else {
            playerTurn = 0;
        }
    }
    message.channel.send(`${playerList[playerTurn].name} is next to play.`);
}

function Score(message) {
    for (i = 0; i < playerList.length; i++) {
        if (playerList[i].id == message.author.id) {
            return message.channel.send(`${playerList[i].name} your score is: ${playerList[i].score}`);
        }
    }
}

function getScoreArray() {
    var playerScores = new Array();
    for (i = 0; i < playerList.length; i++) {
        playerScores.push(playerList[i].score);
    }
    return playerScores;
}

function CalculateScore(rollSet) {
    var score = 0;
    var counter = 1;
    var oneCount = 0;
    var fiveCount = 0;
    var pair = 0;
    var triplets = 0;
    var quad = false;
    console.log(rollSet);
    if (rollSet.length == 6 && rollSet[0] == 1) {
        for (i = 0; i < 6; i++) {
            if (rollSet[i] + 1 != rollSet[i + 1]) {
                break;
            }
        }
    }
    for (i = 0; i < rollSet.length; i++) {
        if (rollSet[i] == rollSet[i + 1]) {
            counter++;
        } else {
            if (counter == 2) {
                if (rollSet.length = 6) {
                    if (quad == true) {
                        score = 1500;
                        return score;
                    }
                    pair++;
                    if (pair == 3) {
                        score = 1500;
                        return score;
                    }
                }
            } else if (counter == 3) {
                if (rollSet.length = 6) {
                    triplets++;
                    if (triplets == 2) {
                        score = 2500;
                        return score;
                    }
                    if (rollSet[i] == 1) {
                        score += 300;
                        oneCount = -1;
                    } else {
                        score += (rollSet[i] * 100);
                        if (rollSet[i] == 5) {
                            fiveCount = -1;
                        }
                    }
                }
            } else if (counter == 4) {
                if (rollSet.length = 6) {
                    if (pair == 1) {
                        score = 1500;
                        return score;
                    } else { quad = true; }
                } else {
                    score += 1000;
                    if (rollSet[i] == 1) {
                        oneCount = -1;
                    }
                    if (rollSet[i] == 5) {
                        fiveCount = -1;
                    }
                }
            } else if (counter == 5) {
                score = 2000;
                return score;
            } else if (counter == 6) {
                score = 3000;
                return score;
            }
            counter = 1;
        }

        if (rollSet[i] == "1") {
            oneCount++;
        } else if (rollSet[i] == "5") {
            fiveCount++;
        }
    }
    score += oneCount * 100;
    score += fiveCount * 50;
    oneCount = 0;
    fiveCount = 0;
    console.log(score);
    return score;
}

function GameEnd(message) {
    playerList = new Array();
    playerTurn = 0;
    gamePlaying = false;
    tempScore = 0;
    rolls = new Array;
    message.channel.send("The game has been ended by a higher power.");
}

function bubbleSort(array) {
    var swap;
    do {
        swap = false;
        for (i = 0; i < array.length; i++) {
            if (array[i] > array[i + 1]) {
                var temp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = temp;
                swap = true;
            }
        }
    } while (swap);
    return array;
}

//add endgame at 10,000 points

client.login(token);