module.exports = (objectPagination, query, countRecords) => {
    if (query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }
    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limit;
    objectPagination.totalPage = Math.ceil(countRecords / objectPagination.limit)

    return objectPagination; // trả về object đầy đủ thông tin
}