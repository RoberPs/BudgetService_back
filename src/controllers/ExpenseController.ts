import { Request, Response } from "express"
import Expense from "../models/Expense";



export class ExpenseController {

    static getAll = async (req: Request, res: Response)=>{
        
    }
    static create = async (req: Request, res: Response)=>{

           //console.log(req.budget.id) //desde la db con validación desde middleware 
           //console.log(req.params.budgetId) //desde los parametros de url

           try {

             //Obtener id del presupuesto
             const budget = req.budget.id
             //Crear el Modelo asignando los datos del body y el id-budget
             const expense = new Expense(req.body)
             expense.budgetId  = req.budget.id
              
             //Añadir gasto a db
             expense.save()
             
             // ! DESPUES SE DEBERIA DE OBTENER EN EL CONTROLLADOR DE PPTOS LOS GASTOS 
             res.status(200).json('Gasto creado correctamente')
             
            
           } catch (error) {
              res.status(500).json({error:'No se pudo crear el gasto'})
           }
    }
    static getById = async (req: Request, res: Response)=>{
      
          //const expense = await Expense.findByPk(req.expense.id)

          res.json(req.expense)

    }
    static updateById = async (req: Request, res: Response)=>{
          
         const updateExpense= await req.expense.update(req.body)
         res.json('Gasto actualizado correctamente')
          
    }
    static deleteById = async (req: Request, res: Response)=>{
         
         await req.expense.destroy()
         res.status(200).json('Gasto eliminado correctamente')
    }
}