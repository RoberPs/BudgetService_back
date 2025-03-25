import { Request, Response, NextFunction } from "express";
import {validationResult, param , body } from "express-validator";
import Budget from '../models/Budget';

declare global{  // añadir propiedades al type Request de Express 
    namespace Express{
        interface Request{
            budget?:Budget
        }
    }
}

//TODOS LOS MIDDLEWARES SE INSTANCIA EN EL ROUTER

//CUSTOM MIDDLEWARE PARA VALIDAR EL ID DEL BUDGET DEL ENDPOINT/ROUTER 
export const validateBudgetId = async (req:Request, res:Response, next:NextFunction)=>{
    
    await param('budgetId')  //Validar parametro url
           .isInt().withMessage('parametro no valido')
           .custom(value=>value > 0).withMessage('id no valido')
           .run(req)

    let errors = validationResult(req) //Obtener errores
        if(!errors.isEmpty()){
             res.status(400).json({errors: errors.array()})
             return;
        }

    next() // Pasar al siguiente middelware
}
export const validateBudgetData = async (req:Request, res:Response, next:NextFunction) =>{

    await body('name') //Validacion de campos
            .notEmpty().withMessage('El nombre no puede ir vacio')
            .run(req)
    await body('amount')
            .notEmpty().withMessage('La cantidad no puede ir vacia')
            .isNumeric().withMessage('La cantidad debe se un numero')
            .custom(value => value > 0 ).withMessage('La cantidad no puede se negativa')
            .run(req)//debe evaluar como false no true
    await body('visibility')
            .isBoolean().withMessage('Visibilidad no indicada').optional()
            .run(req) 
           
    next()
        
}


//CUSTOM MIDDLEWARE PARA VALIDAR SI EXISTE EL PPTO DE LA DB /CONTROLLER
export const validateBudgetExist = async (req:Request, res:Response, next:NextFunction)=>{
     
    try{
               
        const {budgetId} = req.params
        const budget = await Budget.findByPk(budgetId)
        if(!budget){
            const error = new Error('Presupuesto no encontrado')
            res.status(404).json({error:error.message})
            return
        }
        // obtener del type global Request de Express el nuevo valor budget tipado con el model Budget
        //De esta manera se pueden comunicar los middlewares con typescript y pasar datos
        req.budget = budget  
        
        next()

     }catch(error){

        res.status(500).json({error:'Presupuesto no encontrado'})
     }
}


export const hasAccess =(req:Request, res:Response, next:NextFunction)=>{
     

    
    if(req.user.id !== req.budget.userId){
            
        const error = new Error('Accion no valida')
        res.status(401).json({error:error.message})
        return;
       }

    next()
}
 

