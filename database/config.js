import { mongoose } from "mongoose";
export const dbConnection = async () => {
    try {

        await mongoose.connect(process.env.MONGODB_CNN);

        console.log('Base de datos online');

    } catch (error) {
        console.error('Error al iniciar la base de datos:', error);
        
        throw new Error('Error al iniciar la base de datos');
    }

}