class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const errorHandler = (err, req, res, next) => {
    console.error(err);

    const statusCode = err.statusCode || 500;
    const message =
        statusCode === 500 && !(err instanceof AppError)
            ? "Internal server error"
            : err.message || "Internal server error";

    res.status(statusCode).json({ message });
};

module.exports = {
    AppError,
    asyncHandler,
    errorHandler
};
