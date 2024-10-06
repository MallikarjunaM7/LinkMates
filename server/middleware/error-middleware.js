const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "ERROR FROM BACKEND"
    const extraDetails = err.extraDetails || "BACKEND ERROR"
    res.status(status).json({message, extraDetails})
}

module.exports = errorMiddleware