import { Router } from "express";
import { createCita, listarCita, eliminarCita} from '../controllers/Cita.controller.js'


const router = Router();

router
    .get('/citas', listarCita )

    .post('/citas',createCita)

    .delete('/citas/:id', eliminarCita)



export default router;
