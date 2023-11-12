import Router from 'express'
import { createCliente, listarCliente, listarUnCliente, editarCliente, eliminarCliente, actualizarEstado } from '../controllers/Cliente.controller.js'

const router = Router();

router.get('/clientes', listarCliente)

    .get('/clientes/:id', listarUnCliente)

    .post('/clientes', createCliente)

    .put('/clientes/:id', editarCliente)

    .get('/clientes/estado/:id', actualizarEstado)

    .delete('/clientes/:id', eliminarCliente)

export default router;
