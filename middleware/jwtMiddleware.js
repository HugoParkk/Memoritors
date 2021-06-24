require('dotenv').config();
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // 위에서 설계한 User 정보를 담기위한 document 모델

const jwtMiddleware = (req, res, next) => {
    // 클라이언트 쿠키에서 token을 가져옵니다.
    let token = req.cookies.x_auth;

    // token을 decode 합니다.
    jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
        if (error) {
            return res
                .status(500)
                .redirect('/signin');
        }
        // decoded에는 jwt를 생성할 때 첫번째 인자로 전달한 객체가 있습니다.
        // { random: user._id } 형태로 줬으므로 _id를 꺼내 씁시다
        User.findOne({ _id: decoded.userID }, (error, user) => {
            if (error) {
                return res.json({ error: "DB에서 찾는 도중 오류가 발생했습니다" });
            }
            if (!user) {
                return res
                    .status(404)
                    .json({ isAuth: false, error: "token에 해당하는 유저가 없습니다" });
            }
            if (user) {
                req.user = user;
            }
            next();
        });
    });
};

module.exports = jwtMiddleware;