const User = require('../models/user.model')
var md5 = require('md5');
module.exports.register = async (req, res) => {
    //lấy body bên front end gửi lên
    const body = req.body;

    //check xem email đã tồn tại chưa
    const userExist = await User.findOne({
        email: body.email
    })

    if (userExist) {
        res.json({
            code: 400,
            message: "Email đã tồn tại"
        })
    } else {
        body.password = md5(body.password);
        const newUser = new User(body);
        newUser.save();

        //lưu token vào cookie luôn
        const token = newUser.token;
        res.cookie("token", token)

        res.json({
            code: 200,
            message: "Đăng kí thành công",
            token: token
        })
    }

}

module.exports.login = async (req, res) => {
    //lay body(email+pass)
    const body = req.body;

    //kiểm tra email
    const user = await User.findOne({
        email: body.email
    })

    //nếu email chưa tồn tại
    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại",
        })
        return
    }

    //nếu password sai
    if (md5(body.password) != user.password) {
        res.json({
            code: 400,
            message: "Mật khẩu chưa chính xác",
        })
        return
    }

    const token = user.token;
    res.cookie("token", token)

    res.json({
        code: 200,
        message: "Đăng nhập thành công",
        token: token
    })


}