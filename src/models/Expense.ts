import{Table, Column, Model, DataType, ForeignKey,BelongsTo, AllowNull}  from 'sequelize-typescript'
import Budget from './Budget'

@Table({
    tableName:'expenses'
})

class Expense extends Model{
   
   @AllowNull(false)
   @Column({
        type: DataType.STRING(100)
   })
   declare name: string

   @AllowNull(false)
   @Column({
        type: DataType.DECIMAL
   })
   declare amount: number
   
   // * RELACION 1-1 (1GASTO - SOLO PUEDE PERTENECER A 1 PPTO)
   @ForeignKey(()=>Budget) //columna llave referencia al id del ppto 
   declare budgetId:Budget

   @BelongsTo(()=>Budget) //relación con el presupuesto(gasto pertenece al presupuesto)
   declare budget:Budget

}

export default Expense