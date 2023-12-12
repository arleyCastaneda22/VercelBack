import Router from 'express'
import {createTurnos, listarTurnos} from '../controllers/turnos.controller.js'
const router=Router()

router.post('/turnos', createTurnos)
    .get('/turnos', listarTurnos)

export default router;