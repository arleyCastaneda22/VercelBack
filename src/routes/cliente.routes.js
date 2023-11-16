import Router from 'express'
<<<<<<< HEAD
import { createCliente, listarCliente, listarUnCliente, editarCliente, eliminarCliente, actualizarEstado } from '../controllers/Cliente.controller.js'
=======
import { createCliente, listarCliente, listarUnCliente, editarCliente, eliminarCliente, actualizarEstado  } from '../controllers/Cliente.controller.js'
>>>>>>> bb18a8a9d71e89f278643f5b9ef62ccdf41fae56

const router = Router();

router.get('/clientes', listarCliente)

    .get('/clientes/:id', listarUnCliente)

    .post('/clientes', createCliente)

    .put('/clientes/:id', editarCliente)

    .get('/clientes/estado/:id', actualizarEstado)

    .delete('/clientes/:id', eliminarCliente)

    .put('/clientes/:id/estado', actualizarEstado);

export default router;
