// Replaced cloudinary with local multer + disk storage for uploads.
// This module exports `upload` (multer middleware) and `imageUploadUtil(file)`
// which accepts either a data URL string (data:...;base64,...) or a Buffer and
// writes the file to the server's /uploads folder and returns an object with
// a `secure_url` property similar to Cloudinary's response.
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.memoryStorage();

async function imageUploadUtil(file) {
  try {
    // ensure uploads dir exists (relative to server root)
    const uploadsDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    let buffer = null;
    let ext = "bin";
    if (typeof file === "string" && file.startsWith("data:")) {
      // data url -> extract mime and buffer
      const matches = file.match(/^data:(.+);base64,(.+)$/);
      if (!matches) throw new Error("Invalid data URL");
      const mime = matches[1];
      const b64 = matches[2];
      buffer = Buffer.from(b64, "base64");
      ext = mime.split("/")[1] || ext;
    } else if (Buffer.isBuffer(file)) {
      buffer = file;
    } else if (file && file.buffer) {
      buffer = file.buffer;
    } else {
      throw new Error("Unsupported file input for imageUploadUtil");
    }

    const filename = `img_${Date.now()}_${Math.floor(Math.random()*10000)}.${ext}`;
    const outPath = path.join(uploadsDir, filename);
    fs.writeFileSync(outPath, buffer);

    // Return an object compatible with cloudinary result
    return {
      public_id: filename,
      secure_url: `/uploads/${filename}`,
      url: `/uploads/${filename}`
    };
  } catch (err) {
    throw err;
  }
}

const upload = multer({ storage });

module.exports = { upload, imageUploadUtil };
