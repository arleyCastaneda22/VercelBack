import Router from'express'
import {crearVenta,obtenerVentas } from '../controllers/ventas.controller.js'
const router =Router()

router.post('/ventas', crearVenta )
    .get('/ventas', obtenerVentas )


export default router;


