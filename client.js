const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client();

client.on("qr", (qr) => {
  console.log("Scan QR Code Untuk Login:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("BOT Siap!");
});

client.on("message", (msg) => {
  if (msg.body == "!ping") {
    msg.reply("pong");
  }
});

client.initialize();
