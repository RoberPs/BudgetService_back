import{ Table, Column, Model, DataType, HasMany, AllowNull, ForeignKey, BelongsTo } from 'sequelize-typescript' // Extraer decoradores
import Expense from './Expense'
import User from './User'
@Table({  // Nombrar tabla
  
    tableName: 'budgets'

})

class Budget extends Model{  // añadir columnas
    
    @AllowNull(false) 
    @Column({
       type: DataType.STRING(100)
    })
    declare name: string

    @AllowNull(false) 
    @Column({
       type: DataType.DECIMAL()
    })
    declare amount: number

    @Column({
        type: DataType.BOOLEAN()
    })
    declare visibility: boolean

    // * RELACIÓN 1 MUCHOS ( 1 PPTO - MUCHOS GASTOS)
    @HasMany(()=>Expense,{ //Relación con la tabla de gastos 
           onUpdate:'CASCADE', //RESTRICCIONES DE INTEGRIDAD 
           onDelete:'CASCADE'  //Si se elimina un presupuesto realiza un barrido de gastos que pertenecen a ese ppto y los elimina
    })  
    declare expenses:Expense[]

    // * RELACION  BUDGET/USER CON FOREIGN KEY 
    @ForeignKey(()=> User)
    declare userId: User
     
    @BelongsTo(()=>User)
    declare user: User
}

export default Budget
