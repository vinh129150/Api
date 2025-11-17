require('dotenv').config();
const { Client } = require('discord.js-selfbot-v13');
const express = require('express');
const fs = require('fs');
const chalk = require('chalk');

const client = new Client();
const app = express();

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN || "Token";

const CONFIG_FILE = 'config.json';
const DATA_FILE = 'jobs.json';

// ============================
// Load config
// ============================
let channels = {};
let jobs = {};

if (fs.existsSync(CONFIG_FILE)) {
  channels = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')).channels;
} else {
  console.log(chalk.red.bold("[ERROR] Missing config.json file!"));
  process.exit(1);
}

if (fs.existsSync(DATA_FILE)) {
  jobs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// ============================
// BOSS KEYWORDS (HỖ TRỢ MỌI DẠNG)
// ============================
const bossKeywords = {
  darkbeard: ["darkbeard", "dark beard", "yami", "beard"],
  rip_indra: ["ripindra", "rip indra", "indra", "true form", "rip-indra"],
  doughking: ["doughking", "dough king", "cookie", "biscuit", "dough-king"],
  cursedcaptain: ["cursedcaptain", "cursed captain", "ghost ship", "captain"]
};

// ============================
// CLEAN + DETECT BOSS NAME
// ============================
function detectCategory(text) {
  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ""); // bỏ toàn bộ dấu + ký tự đặc biệt

  for (const category in bossKeywords) {
    for (const key of bossKeywords[category]) {
      const cleanKW = key.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (cleaned.includes(cleanKW)) return category;
    }
  }
  return null;
}

// ============================
// Discord Ready
// ============================
client.once('ready', () => {
  console.log(chalk.green.bold(`Logged in as ${client.user.tag}`));
});

// ============================
// MESSAGE HANDLER
// ============================
client.on('messageCreate', (message) => {
  if (!message.guild) return;
  if (!message.embeds.length) return;

  const channelId = message.channel.id;
  const embed = message.embeds[0];
  if (!embed) return;

  // Gom toàn bộ text
  const embedText = [
    embed.title || "",
    embed.description || "",
    embed.fields.map(f => `${f.name} ${f.value}`).join(" ") || ""
  ].join(" ");

  // Detect boss từ mọi dạng embed
  const category = detectCategory(embedText);
  if (!category) return;

  // Kiểm tra đúng channel
  if (!channels[category] || !channels[category].includes(channelId)) return;

  // Extract Job ID
  const extracted = embedText.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/)?.[0];
  if (!extracted) return;

  if (!jobs[category]) jobs[category] = [];

  const exists = jobs[category].some(job => job.hasOwnProperty(extracted));
  if (!exists) {
    jobs[category].push({ [extracted]: Date.now() });
    fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2));
    console.log(chalk.blueBright(`[+] New Job ID: ${chalk.yellow(extracted)} (${chalk.magenta(category)})`));
  } else {
    console.log(chalk.gray(`[i] Duplicate ignored: ${extracted}`));
  }
});

// ============================
// API SERVER
// ============================
app.get('/JobId/:index', (req, res) => {
  const index = req.params.index;

  if (!jobs[index]) {
    return res.status(404).json({ error: 'Index not found' });
  }

  const now = Date.now();
  jobs[index] = jobs[index].filter(job => {
    const [jobId, timestamp] = Object.entries(job)[0];
    return (now - timestamp) < 150000; // 150 giây
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2));

  res.json({
    Amount: jobs[index].length,
    JobId: jobs[index]
  });
});

// ============================
// START
// ============================
client.login(TOKEN).catch(err => {
  console.error(chalk.red.bold('[ERROR] Login failed:'), err);
});

app.listen(PORT, () => {
  console.log(chalk.green.bold(`Server running on port ${PORT}`));
});
