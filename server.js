const express = require('express');
const multer  = require('multer');
const path = require('path');

const app = express();
const port = 4000;

// Thiết lập nơi lưu trữ tệp tải lên
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Tệp sẽ được lưu trữ trong thư mục 'uploads/'.
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) // Đổi tên tệp thành một tên duy nhất.
  }
})

// Khởi tạo middleware Multer với cấu hình lưu trữ
const upload = multer({ storage: storage });

// Định tuyến cho trang tải lên
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('Tệp đã được tải lên thành công!');
});

// Serve form để tải lên tệp
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Khởi động máy chủ
app.listen(port, () => {
  console.log(`App đang chạy tại http://localhost:${port}`);
});
