function getTotal(datas) {
    return datas.reduce((total, data) => total + data, 0);
}

module.exports = {getTotal};