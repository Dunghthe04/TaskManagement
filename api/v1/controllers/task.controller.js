const Task = require("../models/task.model")
const paginationHelpers = require("../../../helpers/pagination")
const searchHelpers = require("../../../helpers/search")

//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    //lấy ra task của account thôi ( task tạo or task join), 
    let find = {
        // nam trong 1 or 2 la duoc
        $or: [
          {createBy: req.user.id},
          {listUserJoin: req.user.id}
        ],
        deleted: false
    }
    //lay tren params
    if (req.query.status) {
        find.status = req.query.status
    }

    //lấy sort
    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;

    let sort = {}
    if (sortKey && sortValue) {
        sort[sortKey] = sortValue // key linh động
    }

    //Phân trang
    const countRecords = await Task.countDocuments(find);
    const limitNumber = req.query.limit;
    let initPagination = {
        limit: 2,
        currentPage: 1
    }

    if (limitNumber) {
        initPagination.limit = parseInt(limitNumber)
    }

    //Tìm kiếm keyword
    let objectSearch = searchHelpers(req.query);

    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }

    let pagination = paginationHelpers(initPagination, req.query, countRecords)

    const task = await Task.find(find).sort(sort).limit(pagination.limit).skip(pagination.skip);
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

//[PATCH] /api/v1/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        ///lay id muuon change
        const id = req.params.id;

        //lay ca body front end gui len
        const body = req.body;
        const statusNew = body.status;

        await Task.updateOne({
            _id: id,
            status: statusNew
        })
        res.json({
            code: 200,
            message: "Cập nhập trạng thái thành công"
        })

    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        })
    }




}

//[PATCH] /api/v1/change-multi
module.exports.changeMulti = async (req, res) => {
    try {

        //lay cac id, status va value muon doi
        const {
            ids,
            key,
            value
        } = req.body

        //nếu key là status
        switch (key) {
            case "status":
                //Cập nhập nhiều bản ghi
                await Task.updateMany({
                    _id: {$in : ids}},
                    {status: value}
                )
                res.json({
                    code: 200,
                    message: "Cập nhập trạng thái thành công"
                })
                break;

            case "delete":
                await Task.updateMany({_id: {$in: ids}},{deleted: value})    
                res.json({
                    code: 200,
                    message: "Cập nhập trạng thái thành công"
                })
                break;

            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại!"
                })
                break;
        }

    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại!"
        })
    }




}

//[POST] /api/v1/create
module.exports.createTask = async (req, res) => {
    try {
        //lay user thong qua middleware
        const user=req.user;
        //lay body gui len
        const body=req.body;

        //tao 1 model
        body.createBy=user.id;
        const newTask= new Task(body);
        await newTask.save()
       
        res.json({
            code: 200,
            message: "Thêm mới thành cồng"
        })

    } catch (error) {
        res.json({
            code: 400,
            message: "Thêm mới thất bại!"
        })
    }

}


//[PATCH] /api/v1/task/update/:id
module.exports.updateTask = async (req, res) => {
    try {
        //lay id can update
        const id=req.params.id;

        //lay body gui len
        const body=req.body;

        await Task.updateOne({_id: id},body)
       
        res.json({
            code: 200,
            message: "Cập nhập thành cồng"
        })

    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhập thất bại!"
        })
    }

}

//[PATCH] /api/v1/task/delete/:id
module.exports.deleteTask = async (req, res) => {
    try {
        //lay id can update
        const id=req.params.id;

        await Task.deleteOne({_id: id})
       
        res.json({
            code: 200,
            message: "Xóa thành công thành cồng"
        })

    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa thất bại!"
        })
    }

}


