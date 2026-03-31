import mongoose from 'mongoose';

const menuItemSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        available: { type: Boolean, required: true, default: true },
    },
    {
        timestamps: true,
    }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
