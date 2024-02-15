import { Router } from "express";
import {serviciosUtilizados, citasPorDia} from '../controllers/dashborard.controller.js'
const router = Router();

router.get('/servicios-utilizados', serviciosUtilizados)

    .get('/citas-por-dia', citasPorDia)

export default router