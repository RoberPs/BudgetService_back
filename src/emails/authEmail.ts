import { transport } from "../config/nodemailer"


type EmailType = {
    name:string,
    email:string,
    token:string
}



export class AuthEmail{
    //confirmar la creación de la cuenta y logear
    static sendConfirmationEmail = async( user: EmailType) =>{
        
       console.log(user) // Información obtenida desde el controlador 
       
       const email = await transport.sendMail({
             
            from: 'TuApp de control de gastos',
            to: user.email,
            subject:'TuApp - Confirma tu cuenta',
            html: `
                
              <p>Hola: ${user.name}, has creado tu cuenta , ya casi esta lista</p>
              <p>Visita el siguiente enlace:</p>
              <a href="${process.env.FRONTEND_URL}/auth/confirm-account">Confirmar cuenta</a>
              <p>e ingresa el código: <b>${user.token}</b></p>
            `
           
       })

       console.log('Mensaje enviado correctamente',email.messageId)
        
    }

    static sendConfirmResetPassword = async(user:EmailType) =>{
          
      const email = await transport.sendMail({
             
        from: 'admin-ppto <admin@pptos.com',
        to: user.email,
        subject:'Admin-ppto - Restablece tu password ',
        html: `
            
          <p>Hola: ${user.name}, has solicitado restablecer tu contraseña </p>
          <p>Visita el siguiente enlace:</p>
          <a href="${process.env.FRONTEND_URL}/auth/new-password">Restablecer password</a>
          <p>e ingresa el código: <b>${user.token}</b></p>
        `
       
      })
    }
}
