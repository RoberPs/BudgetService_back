import {Column, Table, Model, DataType, HasMany, Default, Unique, AllowNull} from 'sequelize-typescript'
import Budget from './Budget'

@Table({
    tableName: 'users'

})

class User extends Model{
    
    @AllowNull(false) // el nombre no puede ser null
    @Column({
        type:DataType.STRING(100)
    })
    declare name: string

    @Column({
        type:DataType.STRING(250)
    })
    declare password: string 
    
    @Unique(true) //El email siempre es unico
    @AllowNull(false) //Tampoco puede ser null
    @Column({
        type:DataType.STRING(50)
    })
    declare email: string    

    @Column({
        type:DataType.STRING(6)
    })
    declare token: string
    
    @Default(false) // por default no esta confirmado  usuario hasta que no se comprueba el token
    @Column({
        type:DataType.BOOLEAN
    })
    declare confirmed: boolean


    // * RELACION CON BUDGET 1-MUCHOS
    //Acceder a los budgets almacenados en user
    @HasMany(()=>Budget,{
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
    })
    declare budgets:Budget[]
}   

export default User

