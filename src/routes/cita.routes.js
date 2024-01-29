import { Router } from "express";
import { createCita, listarCita} from '../controllers/Cita.controller.js'


const router = Router();

router
    .get('/citas', listarCita )

    .post('/citas',createCita)



export default router;
