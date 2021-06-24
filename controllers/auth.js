const User = require("../models/user"); // 위에서 설계한 User 정보를 담기위한 document 모델
const bcrypt = require("bcrypt"); // 유저가 입력한 password 를 암호화 하기 위한 알고리즘 라이브러리
const jwt = require("jsonwebtoken");
const path = require('path');

const saltRounds = 10;




exports.signUp = async (req, res, next) => { // signUp 하는 로직
  let { email, name, password, passwordCheck } = req.body;
  // let email = req.body.email;
  // let name = req.body.username;
  // let password = req.body.password;

  // console.log(req.body);
  // 빈값이 오면 팅겨내기
  if (
    email === "" ||
    name === "" ||
    password === "" ||
    passwordCheck === ""
  ) {
    return res.render('register', { err: "정보를 입력하세요." });
  }
  // 비밀번호가 같지 않으면 팅겨내기
  if (password !== passwordCheck)
    return res.render('register', { err: "비밀번호가 같지 않습니다." });

  const sameEmailUser = await User.findOne({ email: email });
  if (sameEmailUser !== null) {
    return res.render('register', { err: "이미 존재하는 이메일입니다." });
  }

  const samenameUser = await User.findOne({ name });
  if (samenameUser !== null) {
    return res.render('register', { err: "이미 존재하는 이름입니다." });
  }

  // 솔트 생성 및 해쉬화 진행
  bcrypt.genSalt(saltRounds, (err, salt) => {
    // 솔트 생성 실패시
    if (err)
      return res.render('register', { err: "비밀번호 해쉬화에 실패했습니다." });
    // salt 생성에 성공시 hash 진행

    bcrypt.hash(password, salt, async (err, hash) => {
      if (err)
        return res.render('register', { err: "비밀번호 해쉬화에 실패했습니다." });

      // 비밀번호를 해쉬된 값으로 대체합니다.
      password = hash;

      const user = await new User({
        email: email,
        name,
        password,
      });

      user.save((err) => {
        if (err) { 
          return res.render('register', { err: err })
        }
      });
      res.redirect('/signin')
      return
    });
  });
};

exports.signIn = async (req, res, next) => {
  User.findOne({ email: req.body.email }, (error, user) => {
    // 에러는 500
    if (error) {
      return res.status(500).render('login', { err: "알수없는 오류." });
    }

    // 찾는 유저가 없다?
    if (!user) {
      return res.status(403).render('login', { err: "해당되는 이메일이 없습니다." });
    }

    // email이 맞으니 pw가 일치하는지 검증합니다.
    if (user) {
      const checkPW = () => {
        bcrypt.compare(req.body.password, user.password, (error, isMatch) => {
          if (error) {
            return res.status(500).render('login', { err: "알수없는 오류." });
          }
          if (isMatch) {
            // 비밀번호가 맞으면 token을 생성해야 합니다.
            // secret 토큰 값은 특정 유저를 감별하는데 사용합니다.

            // 토큰 생성 7일간 유효
            const token = jwt.sign({ userID: user._id }, process.env.SECRET_KEY, { expiresIn: '7d' });

            // 해당 유저에게 token값 할당 후 저장
            user.token = token;
            user.save((error, user) => {
              if (error) {
                return res.status(400).render('login', { err: "알수없는 오류." });
              }

              // DB에 token 저장한 후에는 cookie에 토큰을 저장하여 이용자를 식별합니다.
              return res
                .cookie("x_auth", user.token, {
                  maxAge: 1000 * 60 * 60 * 24 * 7, // 7일간 유지
                  httpOnly: true,
                })
                .status(200)
                .redirect('/');
            });
          } else {
            return res.status(403).render('login', { err: '비밀번호가 틀렸습니다.'});
          }
        });
      };
      checkPW();
    }
  });
};

exports.signOut = async (req, res, next) => {
  return res.cookie("x_auth", "").redirect('/signin');
}
