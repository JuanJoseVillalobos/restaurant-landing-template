import jwt from 'jsonwebtoken';

/**
 * Verifies a Bearer JWT and ensures the caller has the admin role.
 */
export const protectAdmin = (req, res, next) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        res.status(500);
        return next(new Error('Configuración de autenticación incompleta'));
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401);
        return next(new Error('No autorizado, token requerido'));
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
        res.status(401);
        return next(new Error('No autorizado, token requerido'));
    }

    try {
        const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });
        if (decoded?.role !== 'admin') {
            res.status(403);
            return next(new Error('Acceso denegado'));
        }
        req.admin = { email: decoded.sub, role: decoded.role };
        return next();
    } catch {
        res.status(401);
        return next(new Error('Token inválido o expirado'));
    }
};

