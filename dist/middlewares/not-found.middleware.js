const notFoundMiddleware = (req, res) => {
    res
        .status(404)
        .json({
        message: `Request: not found ${req.method} ${req.url} on this server`,
    });
};
export default notFoundMiddleware;
