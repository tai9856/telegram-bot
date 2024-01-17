const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const botToken = process.env.BOT_TOKEN;
const communityGroupChatId = process.env.CHAT_ID;
const requiredScore = 90;
const pointPerCorrectAnswer = 10;
const bot = new TelegramBot(botToken, { polling: true });

const questions = [
  {
    question: "Question 1: What is best to describe Qwikmine?",
    options: [
      "A. It's a meme token that can go to the moon.",
      "B. A project dedicated to KAS mining.",
      "C. A Proof-of-Work (POW) mining services project.",
      "D. A SaaS for new projects to tokenize and enter the web3.",
    ],
    correctAnswer: "C. A Proof-of-Work (POW) mining services project.",
  },
  {
    question: "Question 2: What is the sale and buy tax of Qwikmine token?",
    options: [
      "A. 4% buy tax, 8% sell tax within 60 days; no tax afterward.",
      "B. 4% buy tax, 8% sell tax within 30 days; no tax afterward.",
      "C. 0% buy tax, 6% sell tax within 60 days; no tax afterward.",
      "D. 0% buy tax, 6% sell tax within 30 days; no tax afterward.",
    ],
    correctAnswer:
      "A. 4% buy tax, 8% sell tax within 60 days; no tax afterward.",
  },
  {
    question:
      "Question 3: What rewards are available for token holders during the initial 6 months?",
    options: [
      "A. 50% of Revenue Share.",
      "B. 60% of Revenue Share.",
      "C. 70% of Revenue Share.",
      "D. 75% of Revenue Share.",
    ],
    correctAnswer: "A. 50% of Revenue Share.",
  },
  {
    question:
      "Question 4: What rewards will be accessible to token holders in the upcoming 6 months to a year?",
    options: [
      "A. 50% of Revenue Share.",
      "B. 60% of Revenue Share.",
      "C. 70% of Revenue Share.",
      "D. 75% of Revenue Share.",
    ],
    correctAnswer: "B. 60% of Revenue Share.",
  },
  {
    question:
      "Question 5: What rewards will be available to token holders in the coming year?",
    options: [
      "A. 50% of Revenue Share.",
      "B. 60% of Revenue Share.",
      "C. 70% of Revenue Share.",
      "D. 75% of Revenue Share.",
    ],
    correctAnswer: "D. 75% of Revenue Share.",
  },
  {
    question: "Question 6: How to engage with the Qwikmine ecosystem?",
    options: [
      "A. Trading tokens, discussing prices, and fudding other projects.",
      "B. Staking and yield farming.",
      "C. Holding $QWIK, mining POW tokens, and ordering miners.",
      "D. Mining KAS and speculating on KAS price.",
    ],
    correctAnswer: "C. Holding $QWIK, mining POW tokens, and ordering miners.",
  },
  {
    question: "Question 7: What is the allocation of Qwikmine ERC-20 tokens?",
    options: [
      "A. 97% liquidity pool and 3% marketing, CEX listing.",
      "B. 88% liquidity pool, 8% team, and 4% operations.",
      "C. 92% liquidity pool, 1% airdrop and 7% team.",
      "D. 50% liquidity pool, 30% team , 20% marketing and CEX listing.",
    ],
    correctAnswer: "B. 88% liquidity pool, 8% team, and 4% operations.",
  },
  {
    question: "Question 8: How is the revenue generated?",
    options: [
      "A. Mines KAS and sells it on the open market.",
      "B. Provides SaaS for new web3 projects.",
      "C. Charges fee on operating miners.",
      "D. Trades tokens on DEX",
    ],
    correctAnswer: "C. Charges fee on operating miners.",
  },
  {
    question:
      "Question 9: Currently, how do token holders receive a share of the revenue?",
    options: [
      "A. Hold LP (QWIK-ETH) tokens.",
      "B. Stake LP (QWIK-ETH) tokens in a pool.",
      "C. Stake $QWIK tokens in a pool.",
      "D. Hold $QWIK tokens.",
    ],
    correctAnswer: "D. Hold $QWIK tokens.",
  },
  {
    question: "Question 10: Is it a good idea to trade Qwikmine ERC-20 token?",
    options: [
      "A. Yes, the token is created for trading and speculation.",
      "B. Yes, the token would moon soon.",
      "C. No, the token would dump and you would get rekt.",
      "D. No, the token is for revenue-sharing and crowdfunding.",
    ],
    correctAnswer: "D. No, the token is for revenue-sharing and crowdfunding.",
  },
];

const userPollData = new Map();

// Map to store one-time-use tokens and their expiration times
const tokenMap = new Map();

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const startMessage =
    "Welcome to the Qwikmine Community Channel! To get going, press /help for more information. Just a heads up, this is a questionnaire required to enter the channel. You need to score at least 90/100 to join, and you can only try once every 30 minutes.";
  bot.sendMessage(chatId, startMessage);
});

const userCooldowns = new Map();

bot.onText(/\/run/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Check cooldown
  if (userCooldowns.has(userId)) {
    const lastEntryTime = userCooldowns.get(userId);
    const cooldownRemaining = calculateCooldownRemaining(lastEntryTime);
    bot.sendMessage(
      chatId,
      `You can only run the questionnaire once every 30 minutes. Please wait ${cooldownRemaining} minutes. Please review this documentation for better understanding of the project https://docs.qwikmine.com/`
    );
  } else {
    // Allow the user to run the questionnaire
    startPoll(chatId);
    userCooldowns.set(userId, Date.now()); // Set the current time as the last entry time
  }
});

bot.onText(/\/info/, (msg) => {
  const chatId = msg.chat.id;
  const inforMessage = "Qwikmine documentation https://docs.qwikmine.com/";
  bot.sendMessage(chatId, inforMessage);
});

bot.onText(/\/gdag/, (msg) => {
  const chatId = msg.chat.id;
  const gdagMessage = "GDAG website https://www.ghostdag.org/";
  bot.sendMessage(chatId, gdagMessage);
});

bot.onText(/\/tools/, (msg) => {
  const chatId = msg.chat.id;
  const toolsMessage = "TOOLS linktree https://linktr.ee/blocktoolbox";
  bot.sendMessage(chatId, toolsMessage);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage =
    `Some commands you need for running the bot:\n\n` +
    `About the questionnaire\n\n` +
    `/start - welcome message\n` +
    `/run - run the questionnaire\n` +
    `/info - provide information for the questionnaire\n\n` +
    `About Qwikmine related projects\n\n` +
    `/gdag - provide information about GDAG\n` +
    `/tools - provide information about TOOLS\n`;
  bot.sendMessage(chatId, helpMessage);
});

bot.on("text", (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const userAnswer = msg.text.trim();

  if (userPollData.has(userId)) {
    handleUserAnswer(chatId, userId, userAnswer);
  }
});

function startPoll(chatId) {
  const userId = chatId;
  userPollData.set(userId, { questionIndex: 0, correctAnswers: 0, score: 0 });
  sendQuestion(chatId);
}

function sendQuestion(chatId) {
  const userId = chatId;
  const userData = userPollData.get(userId);

  if (userData.questionIndex < questions.length) {
    const currentQuestion = questions[userData.questionIndex];
    const options = currentQuestion.options.map((option) => [{ text: option }]);
    const keyboard = {
      keyboard: options,
      one_time_keyboard: true,
      resize_keyboard: true,
    };

    const questionText = `${currentQuestion.question}`;
    bot.sendMessage(chatId, questionText, { reply_markup: keyboard });
  } else if (userData.questionIndex === questions.length) {
    // If the user has answered all questions, inform them that the poll is completed
    const finalScore = userData.score;
    bot.sendMessage(
      chatId,
      `Poll completed. Your final score is ${finalScore}. Use /start to play again.`
    );
    userPollData.delete(userId); // Clear user data after completing the poll
  }
}

function handleUserAnswer(chatId, userId, userAnswer) {
  const userData = userPollData.get(userId);
  const currentQuestion = questions[userData.questionIndex];
  const correctAnswer = currentQuestion.correctAnswer;

  console.log(`User Answer: ${userAnswer}, Correct Answer: ${correctAnswer}`);

  if (userAnswer === correctAnswer) {
    userData.correctAnswers++;
    userData.score += pointPerCorrectAnswer; // Adjust scoring as needed
  }

  // Move to the next question
  userData.questionIndex++;
  if (userData.questionIndex === questions.length) {
    // All questions have been answered, check the final score
    // Change this to the desired threshold

    if (userData.score >= requiredScore) {
      // Generate a unique token
      const token = generateToken();

      // Set an expiration time (e.g., 30 minutes from now)
      const expirationTime = Date.now() + 30 * 60 * 1000;

      // Store the token and expiration time
      tokenMap.set(token, expirationTime);

      // Create the one-time-use link
      const oneTimeUseLink = `https://t.me/joinchat/${communityGroupChatId}?invite=${token}`;

      // Send the link to the user
      bot.sendMessage(
        chatId,
        `Congratulations! You've qualified for the workshop. Here is the link: ${oneTimeUseLink}`
      );

      // You can also add additional messages or actions here if needed
    }

    // Poll completed
    const finalScore = userData.score;
    if (finalScore < requiredScore) {
      bot.sendMessage(
        chatId,
        `Your score is ${finalScore}, aiming for a minimum of ${requiredScore}/${
          questions.length * pointPerCorrectAnswer
        } for workshop entry. Take a break, review https://docs.qwikmine.com/, and retry in 30 minutes.`
      );
    }
    userPollData.delete(userId); // Clear user data after completing the poll
  } else {
    // Send the next question
    sendQuestion(chatId);
  }
}

// Function to generate a random token
function generateToken() {
  return Math.random().toString(36).substring(2, 10);
}

// Function to calculate the remaining cooldown time
function calculateCooldownRemaining(lastEntryTime) {
  const cooldownDuration = 30 * 60 * 1000; // 30 minutes in milliseconds
  const elapsedTime = Date.now() - lastEntryTime;
  const remainingTime = cooldownDuration - elapsedTime;
  const remainingMinutes = Math.ceil(remainingTime / (60 * 1000));
  return remainingMinutes;
}

console.log("Bot is running...");
