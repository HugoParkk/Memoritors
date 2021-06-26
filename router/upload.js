const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const path = require('path');
const User = require("../models/user");

const storage = multer.diskStorage({
    destination: 'assets/images/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ '.jpg')
    }
})
const _upload = multer({ storage: storage });

router.get('/uploadImage', function(req,res){
  res.render('upload');
});

router.post('/uploadImage/:name', _upload.single('attachment'), async (req,res) => {
  User.updateOne({ name: req.params.name }, { profileImg: req.file.filename }, async (err, docs) => {
    if(err) {
      console.log(err)
      res.json(err)
    } else {
      console.log("Change Image: ", docs);
      res.redirect('/')
    }
  })
});

router.post('/changeShow/:name/:show', async(req, res) => {
  User.updateOne({ name: req.params.name }, { showing: req.params.show }, async (err, docs) => {
    if(err) {
      console.log(err)
      res.json(err)
    } else {
      res.redirect('/')
    }
  })
})

router.post('/newMemo/:name/:showing', async (req,res) => {
  let showing = parseInt(req.params.showing);

  User.updateOne({ name: req.params.name }, {
    $push: {
      memoList: [{
        title: req.body.title,
      }]
    }, $set: {
      showing: showing
    }
  }, async (err, docs) => {
    if(err) {
      console.log(err)
      res.json(err)
    } else {
      console.log("New Memo: ", docs);
      res.redirect('/')
    }
  })
});

router.post('/uploadMD/:title/:data', async (req,res) => {
  User.updateOne({ 'memoList.title': req.params.title }, { 'memoList.$.value': req.params.data }, async (err, docs) => {
    if(err) {
      console.log(err)
      res.json(err)
    } else {
      console.log("Save Markdown: ", docs);
      res.redirect('/')
    }
  })
});

router.post('/deleteMD/:name/:deleteUid', async (req,res) => {
  User.updateOne({ name: req.params.name }, { $pull: { memoList: {_id: [req.params.deleteUid]} } } , async (err, docs) => {
    if(err) {
      console.log(err)
      res.json(err)
    } else {
      console.log("Delete Markdown: ", docs);
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