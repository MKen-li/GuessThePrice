require("babel-polyfill");
const assert = require("chai").assert;
const vax = require("virtual-alexa");

describe("DefaultSkill Test", function() {
    this.timeout(10000);

    describe("Onboarding Tests", function () {
        it("Launches successfully", async function() {
            const vax = require("virtual-alexa");
            const alexa = vax.VirtualAlexa.Builder()
                .handler("index.handler") // Lambda function file and name
                .interactionModelFile("./models/en-US.json")
                .create();

            let reply = await alexa.launch();
            assert.include(reply.response.outputSpeech.ssml, "Welcome to guess the price");

            reply = await alexa.utter("2");
            assert.include(reply.response.outputSpeech.ssml, "what is your name");
            assert.include(reply.response.outputSpeech.ssml, "contestant one");

            reply = await alexa.utter("john");
            assert.include(reply.response.outputSpeech.ssml, "what is your name");
            assert.include(reply.response.outputSpeech.ssml, "Contestant 2");

            reply = await alexa.utter("juan");
            assert.include(reply.response.outputSpeech.ssml, "let's start the game");
            assert.include(reply.response.outputSpeech.ssml, "Guess the price");

            reply = await alexa.filter(function (request) {
                console.log("Request: " + JSON.stringify(request, null, 2));
            }).utter("200 dollars");
            assert.include(reply.response.outputSpeech.ssml, "the actual price was");
        });

        it("Accepts responses without dollars", async function () {
            const alexa = vax.VirtualAlexa.Builder()
                .handler("index.handler") // Lambda function file and name
                .interactionModelFile("./models/en-US.json")
                .create();

            const launchResponse = await alexa.launch();
            assert.include(launchResponse.response.outputSpeech.ssml, "Welcome to guess the price");

            const playerOneResponse = await alexa.utter("2");
            assert.include(playerOneResponse.response.outputSpeech.ssml, "what is your name");
            assert.include(playerOneResponse.response.outputSpeech.ssml, "contestant one");

            const playerTwoResponse = await alexa.utter("john");
            assert.include(playerTwoResponse.response.outputSpeech.ssml, "what is your name");
            assert.include(playerTwoResponse.response.outputSpeech.ssml, "Contestant 2");

            const gameStartResponse =  await alexa.utter("juan");
            assert.include(gameStartResponse.response.outputSpeech.ssml, "let's start the game");
            assert.include(gameStartResponse.response.outputSpeech.ssml, "Guess the price");

            const priceGuessResponse = await alexa.utter("200");
            assert.include(priceGuessResponse.response.outputSpeech.ssml, "the actual price was");
        });
    });

    describe("One player", () => {
        it("Flow works", async function () {
            const alexa = vax.VirtualAlexa.Builder()
                .handler("index.handler") // Lambda function file and name
                .interactionModelFile("./models/en-US.json")
                .create();

            const launchResponse = await alexa.launch();
            assert.include(launchResponse.response.outputSpeech.ssml, "Welcome to guess the price");

            const singlePlayerResponse = await alexa.utter("1");
            assert.include(singlePlayerResponse.response.outputSpeech.ssml, "tell us your name");

            const firstProductQuestion = await alexa.utter("juan");
            assert.include(firstProductQuestion.response.outputSpeech.ssml, "Guess the price");

            const secondProductQuestion = await alexa.utter("200 dollars");
            assert.include(secondProductQuestion.response.outputSpeech.ssml, "the actual price was");
            assert.include(secondProductQuestion.response.outputSpeech.ssml, "Guess the price");

            const thirdProductQuestion = await alexa.utter("200 dollars");
            assert.include(thirdProductQuestion.response.outputSpeech.ssml, "the actual price was");
            assert.include(thirdProductQuestion.response.outputSpeech.ssml, "Guess the price");

            const gameEndQuestion = await alexa.utter("200 dollars");
            assert.include(gameEndQuestion.response.outputSpeech.ssml, "Game ended, your final score was");
        });
    });

    describe("standalone intents", () => {
        it("Handles one player", async function () {
            const alexa = vax.VirtualAlexa.Builder()
                .handler("index.handler") // Lambda function file and name
                .interactionModelFile("./models/en-US.json")
                .create();

            const launchResponse = await alexa.launch();
            assert.include(launchResponse.response.outputSpeech.ssml, "Welcome to guess the price");

            const singlePlayerResponse = await alexa.utter("one player");
            assert.include(singlePlayerResponse.response.outputSpeech.ssml, "tell us your name");
        });

        it("Handles player numbers", async function () {
            const alexa = vax.VirtualAlexa.Builder()
                .handler("index.handler") // Lambda function file and name
                .interactionModelFile("./models/en-US.json")
                .create();

            const launchResponse = await alexa.launch();
            assert.include(launchResponse.response.outputSpeech.ssml, "Welcome to guess the price");

            const singlePlayerResponse = await alexa.utter("there are two players");
            assert.include(singlePlayerResponse.response.outputSpeech.ssml, "contestant one");
        });

        it("Handles help", async function () {
            const alexa = vax.VirtualAlexa.Builder()
                .handler("index.handler") // Lambda function file and name
                .interactionModelFile("./models/en-US.json")
                .create();

            await alexa.launch();
            const singlePlayerResponse = await alexa.utter("help");
            assert.include(singlePlayerResponse.response.outputSpeech.ssml, "You have to guess a price in dollars");
        });
    });

    describe("Multiplayer", () => {
        it("Run multiplayer till the end", async function () {
            const alexa = vax.VirtualAlexa.Builder()
                .handler("index.handler") // Lambda function file and name
                .interactionModelFile("./models/en-US.json")
                .create();

            const launchRequest = await alexa.launch();
            assert.include(launchRequest.response.outputSpeech.ssml, "Welcome to guess the price");

            const firstPlayerResponse = await alexa.utter("2");
            assert.include(firstPlayerResponse.response.outputSpeech.ssml, "what is your name");
            assert.include(firstPlayerResponse.response.outputSpeech.ssml, "contestant one");

            const secondPlayerResponse = await alexa.utter("john");
            assert.include(secondPlayerResponse.response.outputSpeech.ssml, "what is your name");
            assert.include(secondPlayerResponse.response.outputSpeech.ssml, "Contestant 2");

            const gameStartResponse = await alexa.utter("pedro");
            assert.include(gameStartResponse.response.outputSpeech.ssml, "let's start the game");
            assert.include(gameStartResponse.response.outputSpeech.ssml, "Guess the price");

            const secondPlayerFirstProduct = await alexa.utter("200 dollars");
            assert.include(secondPlayerFirstProduct.response.outputSpeech.ssml, "the actual price was");
            assert.include(secondPlayerFirstProduct.response.outputSpeech.ssml, "Guess the price");

            const firstPlayerSecondResponse = await alexa.utter("200 dollars");
            assert.include(firstPlayerSecondResponse.response.outputSpeech.ssml, "the actual price was");
            assert.include(firstPlayerSecondResponse.response.outputSpeech.ssml, "Guess the price");

            const secondPlayerSecondResponse = await alexa.utter("200 dollars");
            assert.include(secondPlayerSecondResponse.response.outputSpeech.ssml, "the actual price was");
            assert.include(secondPlayerSecondResponse.response.outputSpeech.ssml, "Guess the price");

            const firstPlayerThirdResponse = await alexa.utter("200 dollars");
            assert.include(firstPlayerThirdResponse.response.outputSpeech.ssml, "the actual price was");
            assert.include(firstPlayerThirdResponse.response.outputSpeech.ssml, "Guess the price");

            const secondPlayerThirdResponse = await alexa.utter("200 dollars");
            assert.include(secondPlayerThirdResponse.response.outputSpeech.ssml, "the actual price was");
            assert.include(secondPlayerThirdResponse.response.outputSpeech.ssml, "Guess the price");

            const endOfGameResponse = await alexa.utter("200 dollars");
            assert.include(endOfGameResponse.response.outputSpeech.ssml, "Game ended, the winner is");
        });
    });

    describe("Help responses", () => {
        it("Help in number state", async function () {
            const alexa = vax.VirtualAlexa.Builder()
                .handler("index.handler") // Lambda function file and name
                .interactionModelFile("./models/en-US.json")
                .create();

            const launch = await alexa.launch();
            assert.include(launch.response.outputSpeech.ssml, "Welcome to guess the price");

            const helpResponse = await alexa.intend("AMAZON.HelpIntent");
            assert.include(helpResponse.response.outputSpeech.ssml, "How many players are playing today");
        });

        it("Help in name state", async function () {
            const alexa = vax.VirtualAlexa.Builder()
                .handler("index.handler") // Lambda function file and name
                .interactionModelFile("./models/en-US.json")
                .create();

            const launch = await alexa.launch();
            assert.include(launch.response.outputSpeech.ssml, "Welcome to guess the price");

            const singlePlayerResponse = await alexa.utter("1");
            assert.include(singlePlayerResponse.response.outputSpeech.ssml, "tell us your name");

            const helpResponse = await alexa.intend("AMAZON.HelpIntent");
            assert.include(helpResponse.response.outputSpeech.ssml,
                "You give as your name, and then you can play with friends, what is your name");
        });

        it("Help in price state", async function () {
            const alexa = vax.VirtualAlexa.Builder()
                .handler("index.handler") // Lambda function file and name
                .interactionModelFile("./models/en-US.json")
                .create();

            const launchResponse = await alexa.launch();
            assert.include(launchResponse.response.outputSpeech.ssml, "Welcome to guess the price");

            const singlePlayerResponse = await alexa.utter("1");
            assert.include(singlePlayerResponse.response.outputSpeech.ssml, "tell us your name");

            const firstProductQuestion = await alexa.utter("juan");
            assert.include(firstProductQuestion.response.outputSpeech.ssml, "Guess the price");

            const helpResponse = await alexa.intend("AMAZON.HelpIntent");
            assert.include(helpResponse.response.outputSpeech.ssml,
                "use dollars without cents. What is the price you have in mind?");

        });
    });
});

