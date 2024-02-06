import Router from'express'
import {crearVenta,obtenerVentas,eliminarVenta, obtenerVentaPorId} from '../controllers/ventas.controller.js'
const router =Router()

router.post('/ventas', crearVenta )
    .get('/ventas', obtenerVentas )

    .delete('/ventas/:id', eliminarVenta)

    .get('/ventas/:id', obtenerVentaPorId)

export default router;


