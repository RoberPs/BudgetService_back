import { Request, Response, NextFunction } from "express"
import { body,param,validationResult } from "express-validator"
import Expense from "../models/Expense"

declare global{  // añadir propiedades al type Request de Express 
    namespace Express{
        interface Request{
            expense?:Expense
        }
    }
}



export const validateExpenseData = async (req:Request, res:Response, next:NextFunction) =>{

    await body('name') //Validacion de campos
            .notEmpty().withMessage('El nombre del gasto no puede ir vacio')
            .not().isNumeric().withMessage('El nombre no puede ser un número')
            .run(req)
    await body('amount')
            .notEmpty().withMessage('La cantidad del gasto no puede ir vacia')
            .isNumeric().withMessage('La cantidad del gasto debe se un numero')
            .custom(value => value > 0 ).withMessage('La cantidad del gasto no puede se negativa ni 0')
            .run(req)
           
    next()
        
}
export const validateExpenseId = async (req:Request, res:Response, next:NextFunction)=>{
    
    await param('expenseId')  //Validar parametro url
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
export const validateExpenseExist = async (req:Request, res:Response, next:NextFunction)=>{
     
    try{
               
        const {expenseId} = req.params
        const expense = await Expense.findByPk(expenseId)
        if(!expense){
            const error = new Error('El Gasto no existe')
            res.status(404).json({error:error.message})
            return
        }
        // obtener del type global Request de Express el nuevo valor budget tipado con el model Budget
        //De esta manera se pueden comunicar los middlewares con typescript y pasar datos
        req.expense = expense  
        
        next()

     }catch(error){

        res.status(500).json({error:'Gasto no encontrado'})
     }
}

export const belongsToBudget = async(req:Request, res:Response, next:NextFunction)=>{
    
    //Comprobar que el gasto a eliminar  pertenece al presupuesto seleccionado
    if(req.budget.id !== req.expense.budgetId){
        const error = new Error('Accion no valida')
        return res.status(403).json({error:error.message})
    }

    next()

}
