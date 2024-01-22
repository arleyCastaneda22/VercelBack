import Router from 'express'
import {createTurnos, listarTurnos, actualizarEstado, editarTurno, listarUnTurno, intervalos} from '../controllers/turnos.controller.js'
const router=Router()

router.post('/turnos', createTurnos)

    .get('/turnos/:id', listarTurnos)

    .get('/turnos/edit/:id', listarUnTurno)

    .get('/turnos/estado/:id', actualizarEstado)
    
    .put('/turnos/:id', editarTurno)

    .get('/intervalo/:id', intervalos)

export default router;