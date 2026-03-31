import MenuItem from '../models/MenuItem.js';

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
export const getMenuItems = async (req, res, next) => {
    try {
        const items = await MenuItem.find({ available: true });
        res.json(items);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
export const getMenuItemById = async (req, res, next) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (item) {
            res.json(item);
        } else {
            res.status(404);
            throw new Error('Plato no encontrado');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private
export const createMenuItem = async (req, res, next) => {
    try {
        const { name, description, price, image, category, available } = req.body;
        const item = new MenuItem({ name, description, price, image, category, available });
        const createdItem = await item.save();
        res.status(201).json(createdItem);
    } catch (error) {
        next(error);
    }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private
export const updateMenuItem = async (req, res, next) => {
    try {
        const { name, description, price, image, category, available } = req.body;
        const item = await MenuItem.findById(req.params.id);

        if (item) {
            item.name = name || item.name;
            item.description = description || item.description;
            item.price = price !== undefined ? price : item.price;
            item.image = image || item.image;
            item.category = category || item.category;
            item.available = available !== undefined ? available : item.available;

            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404);
            throw new Error('Plato no encontrado');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private
export const deleteMenuItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findById(req.params.id);

        if (item) {
            await item.deleteOne();
            res.json({ message: 'Plato eliminado correctamente' });
        } else {
            res.status(404);
            throw new Error('Plato no encontrado');
        }
    } catch (error) {
        next(error);
    }
};
