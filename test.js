/*const express = require('express');
const app = express();
const googleStorage = require('@google-cloud/storage');
const Multer = require('multer');
const serviceAccount = require('./scratchgram-39bb2-firebase-adminsdk-v8xg6-e47c2cfd40.json');

const storage = googleStorage({
  projectId: "scratchgram-39bb2",
  keyFilename: serviceAccount
});

const bucket = storage.bucket("scratchgram-39bb2.appspot.com");

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
  }
});

app.listen(3000, () => {
  console.log('App listening to port 3000');
});

app.post('/upload', multer.single('file'), (req, res) => {
  console.log('Upload Image');

  let file = req.file;
  if (file) {
    uploadImageToStorage(file).then((success) => {
      res.status(200).send({
        status: 'success'
      });
    }).catch((error) => {
      console.error(error);
    });
  }
});


const uploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No image file');
    }
    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (error) => {
      reject('Something is wrong! Unable to upload at the moment.');
    });

    blobStream.on('finish', () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
}*/

var admin = require("firebase-admin");
var serviceAccount = require("./ServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://scratchgram-39bb2.firebaseio.com"
});


// module.exports = (req, res, next)=>{
//   // console.log(req.headers);
//   console.log(req.body);
//   console.log(req.file);
//   // console.log(req);
//   next();
// }

file = "images/about-the-creator-1599497478950.jpeg";
admin.storage().bucket('scratchgram-39bb2.appspot.com').upload(file).then((snapshot) => {
  console.log("Sucessfully added");
  // console.log(snapshot.ref.getDownloadURL());
  console.log(snapshot[0].metadata.mediaLink);
}).catch(err => {
  console.log(err);
})

