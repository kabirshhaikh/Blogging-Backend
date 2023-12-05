const multer = require("multer");
const path = require("path");
const fs = require("fs");

const destinationDirectory = path.join(__dirname, "../Images-ProfilePicture");

// Ensure the destination directory exists, or create it
if (!fs.existsSync(destinationDirectory)) {
  fs.mkdirSync(destinationDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../Images-ProfilePicture"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const filterImage = (req, file, cb) => {
  const allowedImage = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
  if (allowedImage.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, JPG, PNG, and GIF are allowed.")
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filterImage,
});

module.exports = upload;
