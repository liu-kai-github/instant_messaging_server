module.exports = async (...rest) => {
    return await promise();
};

// module.exports.isAuth = false;

function promise() {
    return new Promise(
        resolve => {
            setTimeout(() => resolve('5678'), 2000);
        }
    );
}
