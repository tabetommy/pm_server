const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 5000;
const fs = require("fs");
var pdf2img = require('pdf-img-convert');
var bodyParser = require('body-parser');



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/image", express.static("image")); 
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());


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
		var outputImages1 = pdf2img.convert(req.file.path);
		var name=imageName.slice(0, -4)
		outputImages1.then(function(outputImages) {
			fs.writeFile(path.join("./image/")+name+".png", outputImages[0], function (error) {
			  if (error) { console.error("Error: " + error); }
			});
		}).catch(error=>console.log(error));
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