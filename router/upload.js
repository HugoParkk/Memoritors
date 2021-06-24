const express  = require('express');
const router   = express.Router();
const multer   = require('multer'); // 1
const path = require('path');
const User = require("../models/user");

const storage = multer.diskStorage({
    destination: 'assets/images/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ '.jpg')
    }
})
const _upload = multer({ storage: storage }); // 3-2

router.get('/uploadImage', function(req,res){
  res.render('upload');
});

router.post('/uploadImage/:name', _upload.single('attachment'), async (req,res) => { // 5
  // res.render('confirmation', { file:req.file });
  User.updateOne({ name: req.params.name }, { profileImg: req.file.filename }, async (err, docs) => {
    if(err) {
      console.log(err)
      res.json(err)
    } else {
      console.log("Updated Docs: ", docs);
      res.redirect('/')
    }
  })
});


router.get('/uploadImage/:filename', async(req, res) => {
    const { filename } = req.params;
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, 'assets/images/' + filename);
    return res.sendFile(fullfilepath);
})

module.exports = router;