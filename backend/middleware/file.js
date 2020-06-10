const multer = require('multer');
const MIME_TYPE_MAP = {
  'image/jpeg' : 'jpg',
  'image/jpe' : 'jpg',
  'image/png' : 'png'

};
const storage = multer.diskStorage({
  destination: (req, file, cb)=>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid Meme type");
    if(isValid){
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    console.log(file.mimetype);
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext );
  }
});

module.exports = multer({storage:storage}).single("image");
