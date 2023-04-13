const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");

// Function untuk download file
const downloadFile = async (msg) => {
  try {
    // Download file
    const attachmentData = await msg.downloadMedia();

    // Ambil ekstensi file dari mimetype
    const extension = attachmentData.mimetype.split("/")[1];
    // Buat nama file dengan id pesan dan ekstensi
    const fileName = `${msg.id.id}.${extension}`;

    // Simpan file ke folder files
    const storagePath = path.join(__dirname, "files");
    fs.writeFileSync(
      `${storagePath}/${fileName}`,
      Buffer.from(attachmentData.data, "base64").toString("binary"),
      "binary"
    );

    // Cek apakah file berhasil disimpan
    const isFileExists = fs.existsSync(`${storagePath}/${fileName}`);
    if (isFileExists) {
      console.log("File berhasil disimpan.");
    } else {
      console.log("Gagal menyimpan file.");
    }
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  }
};

// Create client
const client = new Client({ authStrategy: new LocalAuth() });

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
  // Cek apakah ada file
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
