module.exports = async (...rest) => {
    return await promise();
};

// module.exports.isAuth = true;

function promise() {
    return new Promise(
        resolve => {
            setTimeout(() => resolve('1234'), 1000);
        }
    );
}
