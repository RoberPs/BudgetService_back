import express from 'express' 
import colors from 'colors'
import morgan from 'morgan'
import {db} from './config/db'
import budgetRouter from './routes/budgetRouter'
import authRouter from './routes/authRouter'


async function connectDb(){

    try{
        
        await db.authenticate()
        db.sync()  //crea columnas automaticamente
        console.log(colors.blue.bold('Conexion a la base de datos realizada con exito'))

    }catch(error){
        //console.log(error)
        console.log(colors.blue.red('Fallo al conectar la base de datos'))
    }
}
connectDb()


const app = express() // Instanciar servidor
app.use(morgan('dev')) // Conectar con api para leer peticiones 
app.use(express.json()) //Aplicar para poder leer json

app.use('/api/budgets',budgetRouter)// Conectar con las rutas 
app.use('/api/auth',authRouter) //Conectar ruta auth/users





export default app