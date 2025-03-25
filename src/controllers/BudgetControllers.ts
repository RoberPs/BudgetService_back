import type {Request,Response} from 'express'
import Budget from '../models/Budget';
import Expense from '../models/Expense';

export class BudgetController{  //Se crea una clase para usar metodos staticos que no necesitan instanciarse

    
    static create = async(req:Request, res:Response)=>{
        
        try{
          
            const budget = await Budget.create(req.body)
            budget.userId = req.user.id  //Añadir el id del usuario que genera el ppto ya autenticado en el router
            await budget.save()

            res.status(201).json('Presupuesto creado correctamente');
            
        }catch(error){
            res.status(500).json('Hubo un error')  
        }
        
    }
    
    static getAll = async(req:Request, res:Response)=>{
        
           //console.log('desde simulación mock')
          
           try{

              const budgets = await Budget.findAll({
                   
                order:[
                    ['createdAt','desc'] //https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
                ],
                
                where:{
                    userId:req.user.id
                }
                // TODO: 
                
              })

              res.json(budgets)

           }catch(error){
              
              res.status(500).json({error:'Presupuestos no encontrados'})

           } 
    }

    static getById= async (req: Request, res: Response)=>{


        //EVALUAR QUE EL USUARIO LOGIN ES EL MISMO QUE CREA EL PPTO

       
       //Obtener el budget con sus gastos asociados
       const budget = await Budget.findByPk(req.budget.id,{
          include:[Expense],
       })
       
       res.json(budget)
       // Esta respuesta es posible desde custom middlewares
       //res.json({budget:req.budget})


        
    };

    static updateById = async(req:Request, res:Response)=>{
       
            //Datos nuevos  solo pasar req.body
            const {name,amount,visibility} = req.body 
            //Actualizar datos del objeto del presupuesto
            await req.budget.update({name,amount,visibility})

            res.json('Presupuesto Actualizado correctamente')
            return
               
    }
    
    static deleteById = async(req:Request, res:Response)=>{


        //ELIMINADO LOGICO 
        //Generalmente no se eliminan los registros , lo que se suele haces es crear una columna visibile con 1 o 0
        // y es en esa columna la que se cambia el valor. Despues se realiza un filtrado de los datos 1 o 0
        //TODO: 
        
        //Eliminar el ppto
        await req.budget.destroy()
        res.json('Presupuesto eliminado correctamente')
        return
    
        
    }

}       