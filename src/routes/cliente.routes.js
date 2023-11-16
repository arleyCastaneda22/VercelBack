import Router from 'express'
import { createCliente, listarCliente, listarUnCliente, editarCliente, eliminarCliente, actualizarEstado  } from '../controllers/Cliente.controller.js'

const router = Router();

router.get('/clientes', listarCliente)

    .get('/clientes/:id', listarUnCliente)

    .post('/clientes', createCliente)

    .put('/clientes/:id', editarCliente)

    .delete('/clientes/:id', eliminarCliente)

    .put('/clientes/:id/estado', actualizarEstado);

export default router;
