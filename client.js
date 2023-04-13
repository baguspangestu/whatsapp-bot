const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");

// Create client
const client = new Client({ authStrategy: new LocalAuth() });

// Function untuk download file
const downloadFile = async (msg) => {
  // Download file
  const attachmentData = await msg.downloadMedia();

  // Ambil ekstensi file dari mimetype
  const extension = attachmentData.mimetype.split("/")[1];
  // Buat nama file dengan id pesan dan ekstensi
  const fileName = `${msg.id.id}.${extension}`;

  // Simpan file ke folder images
  const storagePath = path.join(__dirname, "files");
  fs.writeFileSync(
    `${storagePath}/${fileName}`,
    Buffer.from(attachmentData.data, "base64").toString("binary"),
    "binary"
  );
};

// Login QR Code
client.on("qr", (qr) => {
  console.log("Scan QR Code Untuk Login:");
  qrcode.generate(qr, { small: true });
});

// Kalo bot sudah siap
client.on("ready", () => {
  console.log("BOT Siap!");
});

// Kalo ada pesan masuk
client.on("message", async (msg) => {
  // Cek apakah ada media
  if (msg.hasMedia) {
    // Panggil function downloadFile
    downloadFile(msg);
  }

  // Cek apakah pesan adalah "!ping"
  if (msg.body == "!ping") {
    // Balas pesan dengan "pong"
    msg.reply("pong");
  }
});

// Initialize client
client.initialize();
