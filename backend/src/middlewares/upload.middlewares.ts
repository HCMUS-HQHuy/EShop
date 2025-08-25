import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Tạo thư mục temp nếu chưa tồn tại
const tempDir = path.join(__dirname, 'uploads');
console.log('Upload temp directory:', tempDir);
if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir, { recursive: true });
}

// Cấu hình multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;
