import Router from 'express'
import { createEstilista, listarEstilista, listarUnEstilista, editarEstilista, eliminarEstilista } from '../controllers/Estilista.controller.js'

const router = Router();

router.get('/estilistas', listarEstilista)

    .get('/estilistas/:id', listarUnEstilista)

    .post('/estilistas', createEstilista)

    .put('/estilistas/:id', editarEstilista)

    .delete('/estilistas/:id', eliminarEstilista)

export default router;





