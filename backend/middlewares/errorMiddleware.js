const notFound = (req, res, next) => {
    const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Identificador inválido';
    } else if (err.name === 'ValidationError') {
        statusCode = 400;
    }

    if (statusCode === 500 && process.env.NODE_ENV === 'production') {
        message = 'Error interno del servidor';
    }

    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export { notFound, errorHandler };
