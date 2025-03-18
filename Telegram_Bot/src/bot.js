import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import "dotenv/config";
import {
  handleJokeCommand,
  handleAlgorithmCommand,
  handleDownloadCommand,
} from "./commands.js";
import { handleSticker, handleGreetings } from "./events.js";
import { escapeMarkdownV2 } from "./utils.js";

const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply(
    `Hello ${ctx.from.first_name}! 🤖\nUse /help to see available commands.`
  )
);

bot.help((ctx) => {
  ctx.replyWithMarkdownV2(
    escapeMarkdownV2(
      `*Available Commands:*\n\n` +
        `• \`/joke\` - Get a random joke 😂\n` +
        `• \`/algorithm <name>\` - Get code for an algorithm 🧑‍💻\n` +
        `  _Examples:_ \`/algorithm bubble_sort\`, \`/algorithm binary_search\`\n` +
        `• \`/download <url>\` - Download and receive a video 🎥\n\n` +
        `Use these commands anytime for fun or learning! 🚀`
    )
  );
});

bot.command("joke", handleJokeCommand);
bot.hears(/^\/algorithm\b/, handleAlgorithmCommand);
bot.hears(/^\/download\b/, handleDownloadCommand);
bot.on(message("sticker"), handleSticker);
bot.hears("hi", handleGreetings);

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

console.log("Bot is running...");
