import { Router } from "express";
import { getCitas, getCitaById, createCita, updateCita, deleteCita } from '../controllers/Cita.controller.js'


const router = Router();

router.get('/citas', getCitas)

    .get('/citas/:id', getCitaById)

    .post('/citas',createCita)

    .put('/citas/:id', updateCita)

    .delete('/citas', deleteCita )


export default router;
