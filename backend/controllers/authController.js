import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().trim().email('Email inválido'),
    password: z.string().min(1, 'Contraseña requerida').max(128),
});

// Precomputed dummy hash to keep timing uniform when email does not match
const DUMMY_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8lM7v9Y6pL7hF3sB8N5vK3zL9g5G2W';

/**
 * @desc    Authenticate admin and return a signed JWT
 * @route   POST /api/auth/login
 * @access  Public (rate-limited)
 */
export const loginAdmin = async (req, res, next) => {
    const secret = process.env.JWT_SECRET;
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!secret || !adminEmail || !adminPasswordHash) {
        res.status(500);
        return next(new Error('Configuración de autenticación incompleta'));
    }

    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400);
        return next(new Error(parsed.error.issues[0]?.message || 'Credenciales inválidas'));
    }

    const { email, password } = parsed.data;
    const emailMatches = email.toLowerCase() === adminEmail;
    const passwordMatches = await bcrypt.compare(
        password,
        emailMatches ? adminPasswordHash : DUMMY_HASH
    );

    if (!emailMatches || !passwordMatches) {
        res.status(401);
        return next(new Error('Credenciales inválidas'));
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const token = jwt.sign(
        { sub: adminEmail, role: 'admin' },
        secret,
        { algorithm: 'HS256', expiresIn }
    );

    return res.json({ token, expiresIn });
};

