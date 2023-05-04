const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 5000;
const fs = require("fs");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/image", express.static("image")); 

let imageName = "";  
const storage = multer.diskStorage({
  destination: path.join("./image"), 
  filename: function (req, file, cb) {
	imageName = Date.now() + path.extname(file.originalname);
	cb(null, imageName);
  },
});

const upload = multer({
  storage: storage,
// limits: { fileSize: 3000000 },
}).single("myImage");


app.post("/upload-image", (req, res) => {
  upload(req, res, (err) => {
	if (err) {
	  console.log(err);
	} else {
	  return res.status(201).json({ url: "http://localhost:5000/image/" + imageName , imageName:imageName});
	}
  });
});

app.delete("/delete-image/:imagename", (req, res) => {
  if (!req.params.imagename){
	  return res.status(500).json('error in delete');
  }else{
	  fs.unlink("image/" + req.params.imagename, (err) => {
		  if (err) {
			res.status(500).send({
			  message: "Could not delete the file. " + err,
			});
		  }
	  
		  res.status(200).send({
			message: "File is deleted.",
		  });
		});
	  };
});

app.listen(port, () => {
  console.log("server run in port", port);
});