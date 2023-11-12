import Router from 'express'
import { createCliente, listarCliente, listarUnCliente, editarCliente, eliminarCliente } from '../controllers/Cliente.controller.js'

const router = Router();

router.get('/clientes', listarCliente)

    .get('/clientes/:id', listarUnCliente)

    .post('/clientes', createCliente)

    .put('/clientes/:id', editarCliente)

    .delete('/clientes/:id', eliminarCliente)

export default router;
