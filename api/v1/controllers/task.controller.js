const Task = require("../models/task.model")

//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    let find={
        deleted:false
    }
    //lay tren params
    if(req.query.status){
       find.status=req.query.status
    }
    
    const task = await Task.find(find);
    console.log(task);
    //Khi truy cap url -> tra chuoi json
    res.json(task)
} 

//[GET] /api/v1/detail/:id
module.exports.detail = async (req, res) => {
    try {
        //lay id dong
        const id = req.params.id;
        const task = await Task.find({
            deleted: false,
            _id: id
        });
        res.json(task)
    } catch (error) {
       res.json("Không có dữ liệu")
    }
}