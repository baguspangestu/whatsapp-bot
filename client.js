const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");

const client = new Client({ authStrategy: new LocalAuth() });

const downloadFile = async (msg) => {
  const attachmentData = await msg.downloadMedia();

  const storagePath = path.join(__dirname, "images");
  const extension = attachmentData.mimetype.split("/")[1];
  const fileName = `${msg.id.id}.${extension}`;

  fs.writeFileSync(
    `${storagePath}/${fileName}`,
    Buffer.from(attachmentData.data, "base64").toString("binary"),
    "binary"
  );
};

client.on("qr", (qr) => {
  console.log("Scan QR Code Untuk Login:");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("BOT Siap!");
});

client.on("message", async (msg) => {
  if (msg.hasMedia) {
    downloadFile(msg);
  }

  if (msg.body == "!ping") {
    msg.reply("pong");
  }
});

client.initialize();
