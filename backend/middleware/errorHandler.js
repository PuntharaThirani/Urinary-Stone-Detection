const errorHandler = (err, req, res, next) => {
    // Console එකේ Error එක පෙන්නනවා (Developer ට බලාගන්න)
    console.error(`❌ Error: ${err.message}`);

    // Status Code එක තීරණය කරනවා
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack // Production එකේදී විස්තර හංගනවා
    });
};

module.exports = errorHandler;