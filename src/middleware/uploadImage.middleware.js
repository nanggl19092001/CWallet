const multer = require('multer');

  let fileStorageEngine = multer.diskStorage({
    destination: (req,file,callback) => {
      callback(null, "./src/uploads/user");
    },
    filename: (req,file,callback) => {
      callback(null, Date.now()+"-"+file.originalname);
    }
  })
 
  let upload = multer({storage: fileStorageEngine})
module.exports = {upload}