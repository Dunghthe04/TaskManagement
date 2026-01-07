const User = require('../models/user.model')
const Forgotpassword = require('../models/forgotpassword')
const randomOTP = require('../../../helpers/randomOTP')
const sendEmailHelper = require('../../../helpers/sendEmailOTP')
const randomToken=require('../../../helpers/randomToken');
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
        const newUser = new User({
            fullname: body.fullname,
            email: body.email,
            password: body.password,
            token: randomToken.randomToken(20)
        });
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


module.exports.forgotpassword = async (req, res) => {
    //lay body(email)
    const email = req.body.email;

    const user = await User.findOne({
        email: email
    })

    if (!user) {
        res.json({
            code: 400,
            message: "Email khong ton tai",
        })
        return
    }

    //neu co -> gui OTP
    const timeExpire=3;
    const OTP = randomOTP.randomOTP(8);
    const objectForgotPassword = {
        email: user.email,
        otp: OTP,
        expireAt: Date.now()+timeExpire*60*1000 // vif date.now la minisecond s
    }

    //luu vao database
    const forgotPassword = new Forgotpassword(objectForgotPassword);
    await forgotPassword.save();

    //gui OTP

    const subject = "MÃ OTP XÁC NHẬN"
    const html = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
    <div style="background: #1877f2; color: #fff; padding: 16px; text-align: center;">
      <h2>Xác nhận đổi mật khẩu</h2>
    </div>
    <div style="padding: 20px; color: #333; line-height: 1.5;">
      <p>Xin chào,</p>
      <p>Mã OTP xác nhận đổi mật khẩu của bạn là:</p>
      <p style="font-size: 24px; font-weight: bold; color: green; text-align: center; margin: 20px 0;">
        ${OTP}
      </p>
      <p>Mã có hiệu lực trong <b>3 phút</b>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
    </div>
    <div style="background: #f9f9f9; padding: 12px; text-align: center; font-size: 12px; color: #888;">
      Đây là email tự động, vui lòng không trả lời.
    </div>
  </div>
  `;

    sendEmailHelper.sendEmail(user.email, subject, html);
    res.json({
        code: 200,
        message: "Gui OTP thanh cong",
    })
}


module.exports.otpPassword = async (req, res) => {
    //lay body(email+pass)
    const email = req.body.email;
    const otp = req.body.OTP;

    //kiểm tra OTP
    const checkOtp = await Forgotpassword.findOne({
        otp: otp,
        email: email
    })

    if (!checkOtp) {
        res.json({
            code: 400,
            message: "Ma OTP khong dung",
        })
        return
    }

    //neu dung -> lay ra user
    const user = await User.findOne({
        email: email
    })

    // gan token vao cookie
    res.cookie("token", user.token)

    res.json({
        code: 200,
        message: "Xac thuc thanh",
        token: user.token
    })
}


module.exports.resetPassword = async (req, res) => {
    //lay newPassword
    const newPassword = req.body.newPassword;
    const token = req.cookies.token;

    //tu token -> lay ra user
    const user = await User.findOne({
        token: token
    })

    //kiem tra xem co trung mat khau ko
    if (md5(newPassword) === user.password) {
        res.json({
            code: 400,
            message: "Vui long chon mat khau khac",
        })
        return
    }

    await User.updateOne({
        token: token
    }, {
        password: md5(newPassword)
    })

    res.json({
        code: 200,
        message: "Doi mat khau thanh cong",
    })
}



module.exports.profileDetail = async (req, res) => {
    //lay newPassword
    // const token = req.cookies.token;

    // //tra ve cac thong tin can thiet cho front end
    // const user = await User.findOne({
    //     token: token
    // }).select("-password -token")

    //lay user tu middleware luon
    res.json({
        code: 200,
        message: "Lay thong tin thanh cong",
        info: req.user
    })
}


module.exports.getAllUser = async (req, res) => {
    const listUser=await User.find().select("-password -token")
    res.json({
        code: 200,
        message: "Lay thong tin thanh cong",
        listUser: listUser
    })
}