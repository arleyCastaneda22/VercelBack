import Router from 'express'
import { createEstilista, listarEstilista, listarUnEstilista, editarEstilista, eliminarEstilista, actualizarEstado, actualizarContraseña} from '../controllers/Estilista.controller.js'

const router = Router();

router.get('/estilistas', listarEstilista)

    .get('/estilistas/:id', listarUnEstilista)

    .post('/estilistas', createEstilista)

    .put('/estilistas/:id', editarEstilista)

    .put('/estilistas/contrasena/:id', actualizarContraseña)

    .get('/estilistas/estado/:id', actualizarEstado)

    .delete('/estilistas/:id', eliminarEstilista)

    

export default router;





