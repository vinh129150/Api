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


client.once('ready', () => {
  console.log(chalk.green.bold(`Logged in as ${client.user.tag}`));
});


client.on('messageCreate', (message) => {
  if (!message.guild) return;

  const channelId = message.channel.id.toString();

  for (const [name, channelIds] of Object.entries(channels)) {
    if (channelIds.includes(channelId) && message.embeds.length > 0) {
      const embed = message.embeds[0];

      const embedText = [
        embed.title || '',
        embed.description || '',
        embed.fields.map(field => `${field.name} ${field.value}`).join(' ') || '',
        embed.footer?.text || '',
        embed.author?.name || '',
        embed.thumbnail?.url || '',
        embed.image?.url || ''
      ].join(' ');

      const value = embedText.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/)?.[0];
      if (value) {
        if (!jobs[name]) jobs[name] = [];

        const isDuplicate = jobs[name].some(job => job.hasOwnProperty(value));
        if (!isDuplicate) {
          jobs[name].push({ [value]: Date.now() });
          fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2));
          console.log(chalk.blueBright(`[+] New Job ID: ${chalk.yellow(value)} (${chalk.magenta(name)})`));
        } else {
          console.log(chalk.gray(`[i] Ignored duplicate: ${value}`));
        }
      }
    }
  }
});


app.get('/JobId/:index', (req, res) => {
  const index = req.params.index;
  if (!jobs[index]) {
    return res.status(404).json({ error: 'Index not found' });
  }

  const now = Date.now();
  jobs[index] = jobs[index].filter(job => {
    const [jobId, timestamp] = Object.entries(job)[0];
    return (now - timestamp) < 150000;
  });
  fs.writeFileSync(DATA_FILE, JSON.stringify(jobs, null, 2));

  res.json({
    Amount: jobs[index].length,
    JobId: jobs[index]
  });
});


client.login(TOKEN).catch(err => {
  console.error(chalk.red.bold('[ERROR] Login failed:'), err);
});

app.listen(PORT, () => {
  console.log(chalk.green.bold(`Server running on port ${PORT}`));
});
