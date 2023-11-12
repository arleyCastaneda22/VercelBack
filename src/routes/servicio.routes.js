import Router from 'express'
import {createServicio} from '../controllers/Servicio.controller'
const router = Router()

router.post('servicios', createServicio)