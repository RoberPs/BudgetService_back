import {Router} from 'express'
import { AuthController } from '../controllers/AuthController'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { limiter } from '../config/limit'
import { autenthicate } from '../middleware/auth'

const router = Router()



router.post('/create-account',
    
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('password')
        .isLength({min:8}).withMessage('El password debe tener mínimo 8 caracteres'),
    body('email')
        .isEmail().withMessage('El Email no tiene el formato correcto'),
            
        
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    limiter,
    body('token')
        .notEmpty()
        .isLength({min: 6, max:6 })
        .withMessage('Token no valido'),
    handleInputErrors,
    AuthController.confirmAccount 
)

router.post('/login',
    limiter,
    body('email').isEmail().withMessage('El email no es valido'),
    body('password').notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    AuthController.userLogin
)

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('El email no es valido'),

    handleInputErrors,
    AuthController.forgotPassword
)
router.post('/validate-token',
    limiter,
    body('token')
        .notEmpty()
        .isLength({min: 6, max:6 })
        .withMessage('Token no valido'),
    handleInputErrors,
    AuthController.validateToken
)

// * FINALMENTE SE OBTINE DESDE EL FRONT EL TOKEN VIA URL PARA CAMBIAR LOS PASSWORDS EN DB

router.post('/reset-password/:token',

    limiter,
    param('token')
        .notEmpty()
        .isLength({min: 6, max:6 })
        .withMessage('Token no valido'),
    body('password')
        .isLength({min: 8})
        .withMessage('El password debe tener minimo 8 caracteres'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
)
router.get('/user',
    autenthicate,
    handleInputErrors,
    AuthController.user
)
router.put('/user',
    autenthicate,
    handleInputErrors,
    AuthController.updateProfileUser
)



//USUARIO YA AUTENTICADO 

router.post('/update-password',
    autenthicate,
    body('current_password')
        .notEmpty()
        .withMessage('El password actual no puede ir vacio'),
    body('new_password')
        .isLength({min: 8})
        .withMessage('El password nuevo debe tener minimo 8 caracteres'),
    handleInputErrors,
    AuthController.updateUserPassword
)
router.post('/check-password',
    autenthicate,
    body('password')
        .notEmpty()
        .withMessage('El password actual no puede ir vacio'),
  
    handleInputErrors,
    AuthController.checkUserPassword
)


export default router