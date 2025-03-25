import jwt from 'jsonwebtoken'

//SOLO ENVIAR INFORMACIÓN DEL USUARIO QUE NO SEA SENSIBLE 
export const generateJWT= ( id:string ) =>{

    const token = jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn: '30d'
    })
    return token
}