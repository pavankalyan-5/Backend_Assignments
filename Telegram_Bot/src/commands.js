import axios from "axios";
import { escapeMarkdownV2 } from "./utils.js";
import youtubedl from "youtube-dl-exec";
import fs from "fs";
import path from "path";
import os from "os";

const jokesApi = process.env.JOKES_URL;

const algorithms = {
  bubble_sort: `function bubbleSort(arr) {
      let n = arr.length;
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          }
        }
      }
      return arr;
    }`,

  binary_search: `function binarySearch(arr, target) {
      let left = 0, right = arr.length - 1;
      while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        arr[mid] < target ? (left = mid + 1) : (right = mid - 1);
      }
      return -1;
    }`,
};

export const handleJokeCommand = async (ctx) => {
  try {
    const response = await axios.get(jokesApi);
    const joke = response.data;
    const jokeText =
      joke.type === "single" ? joke.joke : `${joke.setup}\n${joke.delivery}`;

    ctx.replyWithMarkdownV2(escapeMarkdownV2(jokeText));
  } catch (error) {
    ctx.replyWithMarkdownV2(
      escapeMarkdownV2("⚠️ *Failed to fetch a joke. Try again!*")
    );
  }
};

export const handleAlgorithmCommand = async (ctx) => {
  try {
    const algoName = ctx.message.text.split(" ")[1]?.toLowerCase();

    if (!algoName) {
      const availableAlgorithms = Object.keys(algorithms).join(", ");
      ctx.replyWithMarkdownV2(
        escapeMarkdownV2(
          `Available algorithms:\n${availableAlgorithms}\n\nUsage: /algorithm <name>\nExample: /algorithm bubble_sort`
        )
      );
      return;
    }

    if (algorithms[algoName]) {
      const escapedCode = escapeMarkdownV2(algorithms[algoName]);

      ctx.replyWithMarkdownV2(
        `*Algorithm:* \`${algoName}\`\n\`\`\`\n${escapedCode}\n\`\`\``,
        { disable_web_page_preview: true }
      );
    } else {
      ctx.replyWithMarkdownV2(
        escapeMarkdownV2(
          "⚠️ Algorithm not found. Try /algorithm to see available algorithms."
        )
      );
    }
  } catch (error) {
    console.error("Error in handleAlgorithmCommand:", error);
    ctx.replyWithMarkdownV2(
      escapeMarkdownV2(
        "❌ An error occurred while processing your request. Please try again later."
      )
    );
  }
};

const isValidShortsUrl = (url) => {
  return (
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/shorts\/[a-zA-Z0-9_-]+/.test(
      url
    ) ||
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[a-zA-Z0-9_-]+&.*feature=shorts/.test(
      url
    )
  );
};

export const handleDownloadCommand = async (ctx) => {
  try {
    const url = ctx.message.text.split(" ")[1];
    if (!url) {
      return ctx.reply(
        "Please provide a YouTube Shorts URL. Example: /download <url>"
      );
    }

    if (!isValidShortsUrl(url)) {
      return ctx.reply(
        "Only YouTube Shorts URLs are allowed. Please provide a valid link."
      );
    }

    ctx.reply("⏳ Downloading YouTube Short... Please wait.");
    const loaderMessage = await ctx.replyWithVideo({ source: "./loader.mp4" });

    const outputDir = os.tmpdir();
    const filePath = path.join(outputDir, `short-${Date.now()}.mp4`);

    await youtubedl(url, {
      output: filePath,
      format: "best",
    });

    await ctx.telegram.deleteMessage(ctx.chat.id, loaderMessage.message_id);

    await ctx.replyWithVideo({ source: filePath });

    setTimeout(() => fs.unlinkSync(filePath), 60000);
  } catch (error) {
    console.error("Download Error:", error);
    ctx.reply("Failed to download the YouTube Short. Please try again.");
  }
};