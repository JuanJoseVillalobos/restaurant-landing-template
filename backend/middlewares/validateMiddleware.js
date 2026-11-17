import mongoose from 'mongoose';
import { z } from 'zod';

const ALLOWED_CATEGORIES = ['Entradas', 'Principales', 'Vegetariano', 'Postres', 'Bebidas'];

const httpsUrlSchema = z.string().trim().refine((val) => {
    try {
        const parsed = new URL(val);
        return parsed.protocol === 'https:';
    } catch {
        return false;
    }
}, 'La imagen debe ser una URL https:// válida');

const baseMenuSchema = z.object({
    name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
    description: z.string().trim().min(5, 'La descripción debe tener al menos 5 caracteres').max(500),
    price: z.number().finite().positive('El precio debe ser mayor a 0').max(10000),
    image: httpsUrlSchema,
    category: z.enum(ALLOWED_CATEGORIES, {
        errorMap: () => ({ message: `Categoría inválida. Permitidas: ${ALLOWED_CATEGORIES.join(', ')}` }),
    }),
    available: z.boolean().optional(),
});

const updateMenuSchema = baseMenuSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    'Debes enviar al menos un campo válido para actualizar'
);

/**
 * Validates that `:id` is a well-formed MongoDB ObjectId before querying.
 */
export const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        return next(new Error('ID de plato inválido'));
    }
    return next();
};

/**
 * Validates and whitelists menu item payloads on create or update.
 */
export const validateMenuItem = (isUpdate = false) => (req, res, next) => {
    const schema = isUpdate ? updateMenuSchema : baseMenuSchema;
    const result = schema.safeParse(req.body);

    if (!result.success) {
        const firstIssue = result.error.issues[0]?.message || 'Datos inválidos';
        res.status(400);
        return next(new Error(firstIssue));
    }

    req.body = result.data;
    return next();
};

