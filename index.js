const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/image", express.static("image")); 

let imageName = "";  
const storage = multer.diskStorage({
  destination: path.join("./image"), 
  filename: function (req, file, cb) {
	//imageName = Date.now() + path.extname(file.originalname);
	imageName=file.originalname
	cb(null, imageName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 3000000 },
}).single("myImage");


app.post("/upload-image", (req, res) => {
  upload(req, res, (err) => {
	if (err) {
	  console.log(err);
	} else {
	  return res.status(201).json({ url: "http://localhost:5000/image/" + imageName });
	}
  });
});


app.listen(port, () => {
  console.log("server run in port", port);
});