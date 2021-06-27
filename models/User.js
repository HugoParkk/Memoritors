const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
    },
    memoList: [{
        title: {
            type: String,
            default: 'New Memo',
            required: true
        },
        value: {
            type: String,
            default: 'Welcome'
        }
    }],
    showing: {
        type: String,
        default: '0'
    }
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email }).exec();
};

module.exports = mongoose.model("User", userSchema);