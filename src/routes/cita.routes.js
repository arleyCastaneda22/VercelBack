import { Router } from "express";
import { createCita, listarCita, eliminarCita, actualizarEstadoCita, getCitasByEstilistaId, getCitasByClienteId } from '../controllers/Cita.controller.js'


const router = Router();

router
    .get('/citas', listarCita)

    .post('/citas', createCita)

    .delete('/citas/:id', eliminarCita)

    .put('/citas/estado/:id', actualizarEstadoCita)

    .get('/citas/:estilistaId/citas', getCitasByEstilistaId)

    .get('/citas/:clienteId/citas1', getCitasByClienteId)



export default router;
