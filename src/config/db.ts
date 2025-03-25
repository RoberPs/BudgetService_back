//CONEXION BASE DE DATOS DE RENDER

import { Sequelize } from 'sequelize-typescript'
import dontenv from 'dotenv'
dontenv.config()


export const db = new Sequelize( process.env.DB_URL, {

    models: [__dirname + '/../models/**/*'],
    logging:false,
    dialectOptions: {
        ssl:{
           require:false
        }
    }
})
