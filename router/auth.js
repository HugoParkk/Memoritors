const express = require("express");
const auth = express.Router(); // express 프레임워크의 router 함수를 사용해서 위에서 말한 라우팅을 할 수 있다.
const authCtrl = require("../controllers/auth"); // 위에서 작성한 auth.js 파일에서 signUp 모듈을 임포트 한다.

const multer = require('multer');
const upload = multer();
auth.use(upload.array());

// auth.get('/signup', )
auth.post('/signup', authCtrl.signUp); // signup 이라는 미들웨어를 signup 의 주소와 연결 시켜준다. 즉 front-end 클라이언트서버는 홈페이지주소/auth/signup 으로 회원가입 요청을 보낼 수 있게 된다.
auth.post('/signin', authCtrl.signIn); // signin 미들웨어 연결
auth.post('/signout', authCtrl.signOut); // signout 미들웨어 연결

module.exports = auth; // 이 모듈을 내보냄.