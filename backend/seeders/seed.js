import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import MenuItem from '../models/MenuItem.js';

dotenv.config();
await connectDB();

const menuItems = [
    {
        name: 'Medallones de Filet Mignon',
        description: 'Corte premium acompañado de puré de trufas, espárragos asados y reducción de vino tinto.',
        price: 45,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Principales',
        available: true,
    },
    {
        name: 'Salmón Glaseado al Miso',
        description: 'Salmón fresco con costra de sésamo, servido sobre wok de vegetales orgánicos crujientes.',
        price: 38,
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Principales',
        available: true,
    },
    {
        name: 'Risotto de Setas Silvestres',
        description: 'Arroz arborio cremoso con variedad de setas de temporada, parmesano reggiano y aceite de trufa.',
        price: 32,
        image: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        category: 'Vegetariano',
        available: true,
    }
];

const importData = async () => {
    try {
        await MenuItem.deleteMany();
        await MenuItem.insertMany(menuItems);
        console.log('✅ Datos importados a MongoDB exitosamente!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error importando datos: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await MenuItem.deleteMany();
        console.log('🗑️ Datos destruidos!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error destruyendo datos: ${error.message}`);
        process.exit(1);
    }
};

console.log('Procesando seeder...');
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
