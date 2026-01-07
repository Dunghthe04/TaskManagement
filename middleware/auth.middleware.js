const User = require('../api/v1/models/user.model')
module.exports.requireAuthen = async (req, res, next) => {
    //neu co gui token qua header
    if (req.headers.authorization) {
        //Lay token thong qua header
        const token = (req.headers.authorization).split(" ")[1];
        console.log("token",token);
        

        //Kiem tra xem co tai khoan nao giong token kia k
        const user = await User.findOne({
            token: token
        }).select("-password -token")

        if (!user) {
            res.json({
                code: 400,
                message: "Khong thay nguoi dung voi ma token"
            })
            return
        }

        //neu co -> gan luon vao req -> de sau khi chay qua no co the lay ra dung
        req.user = user
        console.log(user);
        next()
    } else {
        res.json({
            code: 400,
            message: "Vui long gui kem ma token"
        })
    }


}