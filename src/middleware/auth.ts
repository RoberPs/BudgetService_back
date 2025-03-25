import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import User from '../models/User';

declare global{  // añadir propiedades al type Request de Express 
    namespace Express{
        interface Request{
            user?:User
        }
    }
}

export const autenthicate = async (req:Request, res:Response, next:NextFunction)=>{

    //OBTENER JWT DEL LOGIN DEL USUARIO
    const bearer = req.headers.authorization
    if(!bearer){
        const error =new Error('No autorizado')
        res.status(401).json({error:error.message})
        return
    }
    //Generar un array con 2 posiciones para extraer solo el token
    const[, token] = bearer.split(' ')

    if(!token){
        const error =new Error('token no valido')
        res.status(401).json({error:error.message})
    }

    //VERIFICAR DATOS DEL JWT
    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(typeof decoded === 'object' && decoded.id){ //COMPROBACIÓN PARA TYPESCRIPT

            req.user = await User.findByPk(decoded.id,{
                attributes:['id','email','name']
            })  
        }
       
    }catch(error){
      
        res.status(500).json('Token no valido')
    }
    
   next()
}