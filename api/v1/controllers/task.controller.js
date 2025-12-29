const Task = require("../models/task.model")
const paginationHelpers = require("../../../helpers/pagination")
const searchHelpers = require("../../../helpers/search")

//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    let find = {
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