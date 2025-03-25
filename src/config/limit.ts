import {rateLimit} from 'express-rate-limit'

//Configurar número de request por por operación , se puede configurar para todas las rutas o una enconcreto (siempre antes de las request)
//HAY PROVEEDORES DE SERVIDOR QUE COBRAN POR NÚMERO DE PETICIONES
export const limiter = rateLimit({
    windowMs: 60 * 1000,
    limit:5,
    message:{"error":"Has alcanzado el limite de peticiones"}
})