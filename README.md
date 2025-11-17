# Porry's JobID API

Porry's JobID API is a Discord self-bot that listens for embed messages in designated channels, extracts job IDs from those messages, and serves them through an Express API.

**⚠️ Disclaimer:** This project uses a Discord self-bot, which is against Discord's Terms of Service. Using a self-bot may result in account termination. It is recommended to use a bot account for compliance with Discord's policies. Proceed at your own risk.

## Features
- Listens for embed messages in specified Discord channels.
- Extracts job IDs from these embed messages.
- Stores extracted job IDs in `jobs.json`.
- Provides an Express API to retrieve active job IDs.

---

## 📜 Installation

### 1️⃣ Install Node.js (if not installed)
Ensure you have **Node.js v16+** installed. Download it from [here](https://nodejs.org/).

### 2️⃣ Clone the Repository
```sh
git clone https://github.com/PorryDepTrai/JobID-API.git
cd JobID-API
```


### 3️⃣ Run Setup
- **For Windows users:** Run `setup.bat` to install dependencies and configure the bot:
  ```sh
  setup.bat
  ```
- **For Linux/macOS users:** Run the following commands:
  ```sh
  npm install
  ```
  Then, create a `.env` file with your Discord token and port:
  ```
  TOKEN=your-discord-token
  PORT=3000
  ```

This will:
- Install required Node.js dependencies.
- Configure the bot with your Discord token.

---

## 🚀 Running the Bot
After setup, start the bot by running:
```sh
npm start
```
For Windows users, you can also use `start.bat`.

---

## 📂 Configuration

### 🔧 .env
The `.env` file should contain your Discord token and the port for the Express API:
```
TOKEN=your-discord-token
PORT=3000
```

### 🔧 config.json (Channels)
The `config.json` file specifies the Discord channels to monitor for each category. Modify it to include the channel IDs where the bot should listen for embed messages:
```json
{
  "fullmoon": ["1342784920501878825", "1348481612106698782"],
  "mirage": ["1342786513070719006", "1348481648554938379"]
}
```
Each key represents a category (e.g., "fullmoon", "mirage"), and the array contains the channel IDs for that category.

---

## 🌐 API Endpoint
The bot provides an API to fetch active job IDs. The API runs on the port specified in the `.env` file (default is 3000).

### **GET /JobId/:category**
Retrieves active job IDs for the specified category.

- **:category**: The category name (e.g., "fullmoon", "mirage").

**Example:**
```
GET http://localhost:3000/JobId/fullmoon
```

**Response:**
```json
{
  "Amount": 2,
  "JobId": [
    {"abcd1234": 1690000000},
    {"efgh5678": 1690000050}
  ]
}
```
- **Amount**: The number of active job IDs.
- **JobId**: An array of objects, each containing a job ID and its associated timestamp.

---

## 🛠 Troubleshooting
- If the bot doesn’t start, check the following:
  - Ensure your Discord token is correct in `.env`.
  - Verify that `config.json` is properly formatted and contains valid channel IDs.
  - Run `npm install` to ensure all dependencies are installed.
- Make sure the bot has access to the specified channels.
- Check the console logs for any error messages that might indicate the issue.

---

## 💖 Credits
Made with ❤️ by **Porry**.  
Join our community: [Discord Server](https://discord.gg/zzJEfMBTR2).# Api
