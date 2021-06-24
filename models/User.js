const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String, // 2.
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String,
        default: 'default.jpg'
    }
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email }).exec();
};

module.exports = mongoose.model("User", userSchema);