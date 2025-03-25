import { Router } from "express";
import {BudgetController}  from '../controllers/BudgetControllers'
import { ExpenseController } from "../controllers/ExpenseController";
import { handleInputErrors } from '../middleware/validation';
import { validateBudgetId, validateBudgetExist,validateBudgetData, hasAccess } from '../middleware/budget';
import { validateExpenseData, validateExpenseId,validateExpenseExist, belongsToBudget } from "../middleware/expense";
import { autenthicate } from "../middleware/auth";

//ROAD PATERN - PATRON DE USO DE URLS CON MIDDLEWARES

const router = Router()

// TODO SE PUEDE SIMPLIFICAR MÁS AÑDIENDO LOS PARAMETRO / MIDDLEWARE EN EL ROUTE

router.use(autenthicate) // ? APLICAR EL MIDDLEWARE DE AUTENTICACION PARA TODOS LOS ENDPOINTS DE ESTA RUTA

// ! EL USUARIO DEBE ESTAR AUTENTICADO PARA PODER CREAR PRESUPUSTOS Y OPERAR CON ELLOS
router.param('budgetId',validateBudgetId)
router.param('budgetId',validateBudgetExist) //Siempre obtiene y valida el id que se envia en la url
router.param('budgetId',hasAccess) //MID que verifica que el usuario logeado es el mismo que creo el ppto a consultar con el id

router.param('expenseId',validateExpenseId)
router.param('expenseId',validateExpenseExist)
router.param('expenseId',belongsToBudget) //Comprobar que el gasto a eliminar pertenece al presupuesto seleccionado
//REST API


//BUDGETS

router.post('/',
   
    validateBudgetData,   
    handleInputErrors, //Middleware Comprobación de errores
    BudgetController.create // Controlador para crear el presupuesto
)

router.get('/',
    
    handleInputErrors,
    BudgetController.getAll
)

router.get('/:budgetId',
    
    BudgetController.getById //controller
)

router.put('/:budgetId',
    
    validateBudgetData,
    handleInputErrors, //Middleware Comprobación de errores
    BudgetController.updateById //controller
)

router.delete('/:budgetId',
    
    //validateBudgetId,//mid 
    // validateBudgetExist,
    BudgetController.deleteById //controller
)


//EXPENSES
//Patron ROA-Arquitectura orientada a recursos 
//En estas rutas ya se esta revisando el id del presupuesto y las validaciones creadas desde los middlewares
router.get('/:budgetId/expenses',ExpenseController.getAll)

router.post('/:budgetId/expenses',
    validateExpenseData,
    handleInputErrors,    
    ExpenseController.create
)


router.get('/:budgetId/expenses/:expenseId',ExpenseController.getById)
router.put('/:budgetId/expenses/:expenseId',
    validateExpenseData,
    handleInputErrors,
    ExpenseController.updateById
)
router.delete('/:budgetId/expenses/:expenseId',ExpenseController.deleteById)



export default router
