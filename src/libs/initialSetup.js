import Role from '../models/Role.js'


export const createRoles = async () => {
    try {
        const count = await Role.estimatedDocumentCount()

        if(count>0) return;
    
        //ejecuta toda la promesas al mismo tiempo
        const values = await Promise.all([
        new Role({name: 'cliente'}).save(),
        new Role({name: 'estilista'}).save(),
        new Role({name:'admin'}).save()
        ])
    
        console.log(values)
    } catch (error) {
        console.error(error)
    }
}