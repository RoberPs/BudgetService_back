
import {createRequest, createResponse} from 'node-mocks-http'
//Array de pptos para pruebas similar a los de la base de datos
import { BudgetController } from '../../controllers/BudgetControllers'
import Budget from '../../models/Budget'
import { budgets } from '../mocks/budgets'

//* MOCKS SIMULA PETICIONES A LA DB IGUALES A LAS REALES
//? PRUEBA-UNITARIAS
// ! NUNCA DEBEN TOCAR LA BASE DE DATOS 

jest.mock('../../models/Budget',()=>({
    
    
    findAll: jest.fn(), // Obtener modelo con url y metodo controlador
    create:jest.fn()
}))

 describe('BudGetcontroller.getAll',()=>{

    beforeAll(()=>{ // Cuando se manda llamar el controllador ejecuta la implementacion con los valores de options pasados
        (Budget.findAll as jest.Mock).mockReset();
        (Budget.findAll as jest.Mock).mockImplementation((options) =>{
            const updatedBudgets = budgets.filter(budget => budget.userId === options.where.userId); 
            return Promise.resolve(updatedBudgets)           
        })
   })

    test('Should retrieve 1 budgets for user with ID 2', async ()=>{      

         //*Consulta 
         const req = createRequest({ // simula Request
            method:'GET',
            url:'/api/budgets',
            user: {id: 2}
         })
         const res = createResponse(); //simula Response
         await BudgetController.getAll(req,res) //Controller
          
         const data = res._getJSONData() //respuesta json
         console.log(data)
         expect(data).toHaveLength(1);
         expect(res.statusCode).toBe(200);
         expect(res.status).not.toBe(404);
    })
    test('Should retrieve 2 budgets for user with ID 1', async ()=>{      

         //*Consulta 
         const req = createRequest({ // simula Request
            method:'GET',
            url:'/api/budgets',
            user: {id: 1}
         })
         const res = createResponse(); //simula Response
         await BudgetController.getAll(req,res) //Controller
          
         const data = res._getJSONData() //respuesta json
         //console.log(data)
         expect(data).toHaveLength(2);
         expect(res.statusCode).toBe(200);
         expect(res.status).not.toBe(404);
    })
    test('Should retrieve 0 budgets for user with ID 100', async ()=>{      

         //*Consulta 
         const req = createRequest({ // simula Request
            method:'GET',
            url:'/api/budgets',
            user: {id: 100}
         })
         const res = createResponse(); //simula Response
         await BudgetController.getAll(req,res) //Controller
          
         const data = res._getJSONData() //respuesta json
         console.log(data)
         expect(data).toHaveLength(0);
         expect(res.statusCode).toBe(200);
         expect(res.status).not.toBe(404);
    })
    
    //Errores del catch 
    it('Should handle errors when fetching budgets', async () =>{
        (Budget.findAll as jest.Mock).mockRejectedValue(() => Promise.reject(new Error('Failed to fetch budgets')))
        const req = createRequest({
            method: 'GET',
            url: '/api/budgets',
            user: {id: 100}
        })
        const res = createResponse();
        const data = res._getJSONData()
        await BudgetController.getAll(req, res)

        expect(res.statusCode).toBe(500)
        expect(data).toEqual({error:'Presupuestos no encontrados'})
    })


}) 



describe('BudgetControlller.create',()=>{

    it('Should create a new Budget and response with status 201', async ()=>{

         const mockBudget = { //Crear la funcionalidad de guardado en la db del controllador
            save:jest.fn().mockResolvedValue(true)
         };
         (Budget.create as jest.Mock).mockResolvedValue(mockBudget)

         const req = createRequest({
            method:'POST',
            url:'/api/budgets',
            user: {id: 1},
            body:{
                name:'Presupuesto prueba',
                amount:1000
            }
         })

         const res = createResponse();
         await BudgetController.create(req,res)

         const data = res._getJSONData()
         console.log(data)

         expect(res.statusCode).toBe(201);
         expect(data).toBe('Presupuesto creado correctamente');
         expect(mockBudget.save).toHaveBeenCalledTimes(1);
         expect(Budget.create).toHaveBeenCalledWith(req.body)


    })

    it('Should handle errors when creating a budget', async () =>{
        
        (Budget.create as jest.Mock).mockRejectedValue(() => Promise.reject(new Error('Failed to create budget')))
        const req = createRequest({
            method: 'POST',
            url: '/api/budgets',
            user: {id: 1},
            body: {
                name: 'Presupuesto prueba',
                amount: 1000
            }
        })
         const res = createResponse();
         await BudgetController.create(req,res)
       
         const data = res._getJSONData()
         expect(res.statusCode).toBe(500)
         expect(data).toEqual('Hubo un error')
    })
})