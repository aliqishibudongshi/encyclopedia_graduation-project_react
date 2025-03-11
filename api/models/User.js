const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true, // 自动去除首尾空格
        validate: [
            {
                validator: (v) => /^[a-zA-Z0-9_-]{4,20}$/.test(v),
                message: '用户名格式错误：4-20位字母/数字/_/-'
            }
        ]
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(v);
            },
            message: '密码必须包含至少一个大写字母、一个小写字母和一个数字'
        }
    },
    platforms: {
        steam: {
            bound: { type: Boolean, default: false },
            steamId: { type: String, default: null },
            linkedAt: { type: Date, default: null }
        },
    }
});

module.exports = mongoose.model('User', UserSchema);
