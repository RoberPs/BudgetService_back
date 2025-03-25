import { Request,Response} from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from '../utils/auth';
import { tokenGenerate } from "../utils/token";
import { AuthEmail } from "../emails/authEmail";
import { generateJWT } from "../utils/jwt";


export class AuthController {


    static createAccount = async(req:Request, res:Response)=>{

        //PREVENIR DUPLICADOS
        const {email, password} = req.body
        const userExist = await User.findOne({where:{email}})
        if(userExist){
            const error = new Error('El usuario ya existe')
            res.status(409).json({error:error.message})
        }
        
    
        //CREAR NUEVO USUARIO
        try{
             
            const newUser = new User(req.body)
            newUser.password = await hashPassword(password) //hashear password
            newUser.token = tokenGenerate(); //Generar token de confirmación
            await newUser.save() //Guardar en db

            const{name,email,token} = newUser //Pasar datos del user al authEmail ya que los datos son iguales en type
            
            AuthEmail.sendConfirmationEmail({
                name:newUser.name,
                email:newUser.email,
                token:newUser.token
            
            }) //Confirmar token enviando email desde estructura email nodemailer
              
               
            res.json('Cuenta creada correctamente,revisa tu email para confirmar la cuenta')
    

        }catch(error){

            /* res.status(500).json({error:'Error al crear el usuario'}) */
            console.log(error)
        }
    }

    static confirmAccount = async(req: Request, res:Response) =>{

           const{token} = req.body //Obtener token 
           
           try{

            const user = await User.findOne({ //buscar usuario con el mismo token enviado
               where:{
                 token:token 
               }
            })

            if(!user){

                const error = new Error('El token no es valido')
                res.status(401).json({error:error.message})
            }
            
                //Si el token ha sido confirmado se cambia la columna a true
                user.confirmed = true,
                user.token = null
                user.save()

                res.json("Cuenta confirmada correctamente")

           }catch(error){
               
              console.log(error)
              
           }
    }

    static userLogin = async(req: Request, res:Response) =>{

        

            const{ email, password } = req.body
            
            //Revisar que exista el usuario
            const userExist = await User.findOne({where:{email}})
            if(!userExist){
   
                 const error = new Error('Usuario no encontrado')
                 res.status(404).json({error:error.message})
                 return;
                 
            }
            
            //Revisar cuenta confirmada
            if(!userExist.confirmed){
                const error = new Error('La cuenta no ha sido confirmada')
                res.status(403).json({error:error.message}) 
                return;
                
            }

            //Revisar password correcto
            const isPasswordCorrect = await checkPassword(password,userExist.password)
            if(!isPasswordCorrect){
                 const error = new Error('Password incorrecto')
                 res.status(401).json({error:error.message})
                 return;
                
            }


            //Enviar token de confirmación  LOGIN DE USUARIO 
            const token =  generateJWT(userExist.id) 
            res.json(token)
            

            /* res.status(200).json('Sesion iniciada correctamente') */
   
    }

    static forgotPassword = async(req:Request, res:Response) =>{
          
        const{ email } = req.body


        const user = await User.findOne({where:{email}}) //Comprobar usuario
        if(!user){
   
                 const error = new Error('Usuario no encontrado')
                 res.status(404).json({error:error.message})
                 return;
        }

        const{ name, token} = user

        user.token = tokenGenerate(); //Generar token de confirmación
        await user.save() //Almacenar en db
        await AuthEmail.sendConfirmResetPassword({ name, email, token:user.token}) //enviar email de confirmación del token        


        res.json('Revisa tu email para confirmar el password')
    }


    static validateToken = async(req:Request, res:Response) =>{
          
        const{ token } = req.body

        const userToken = await User.findOne({where:{token}})

        if(!userToken){
            const error = new Error('El token no existe')
            res.status(404).json({error:error.message})
            return;
        }
        

        res.json('Token valido, asigna un nuevo password')
    }

    static resetPasswordWithToken = async(req:Request, res:Response) =>{

        const{ token} = req.params
        const{ password} = req.body

        const user = await User.findOne({where:{token}})
        if(!user){
            const error = new Error('El token no existe')
            res.status(404).json({error:error.message})
            return;
        }
        
        user.password = await hashPassword(password)
        user.token = null
        await user.save()

        res.json('Password cambiado correctamente')

       
    }

    static user = async (req: Request, res: Response)=>{
        
       res.json(req.user)

    }

    static updateProfileUser = async(req:Request, res:Response) =>{

          console.log(req.user)
          const{ name, email} = req.body;
           
          //Si el usuario existe y no es el mismo que el logeado no puede cambiar email
          
          const existingUser = await User.findOne({where:{email}}) //Comprobar usuario
          if(existingUser && existingUser.id !== req.user.id){
     
                   const error = new Error('Ya existe un usuario con el mismo email')
                   res.status(409).json({error:error.message})
                   return;
          }

          //Si todo esta ok guardar los cambios en el usuario y db
          await req.user.update({name,email},{
             where:{id: req.user.id}
          })


          res.json('Perfil acualizado correctamente')
          return 

    }
      
    static updateUserPassword = async(req:Request, res:Response) =>{
         
        //Validar password actual del usuario
        const{current_password,new_password} = req.body  

        const {id} = req.user

        const user = await User.findByPk(id)
        
        //Comprobar que el password introducido es el correcto de la db 
        const isPasswordCorret = await checkPassword(current_password,user.password)
        
        if(!isPasswordCorret){
            
            const error = new Error('El password actual no es correcto')
            console.log(error)
            res.status(401).json({error:error.message}) 
            return; 
        }
        
        
        //Cambiar el password por el nuevo 
        user.password = await hashPassword(new_password)
        await user.save()

        
        res.json('Password cambiado correctamente')

    }
    
    //PARA REALIZAR VARIAS OPERACIONES DENTRO DE LA CUENTA DEL USUARIO
    static checkUserPassword = async(req: Request , res:Response) =>{
         
               //Validar password actual del usuario
               const{password} = req.body  

               const {id} = req.user
       
               const user = await User.findByPk(id)
               
               //Comprobar que el password introducido es el correcto de la db 
               const isPasswordCorret = await checkPassword(password,user.password)
       
               if(!isPasswordCorret){
                   
                   const error = new Error('El password es incorrecto')
                   res.status(401).json({error:error.message})
                   return;
                    
               }

               res.json('Password verificado correctamente')
    }
}
