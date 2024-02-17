import Router from'express'
import {crearVenta,obtenerVentas,eliminarVenta, obtenerVentaPorId, actualizarVenta, actualizarEstado} from '../controllers/ventas.controller.js'
const router =Router()

router.post('/ventas', crearVenta )
    .get('/ventas', obtenerVentas )

    .delete('/ventas/:id', eliminarVenta)

    .get('/ventas/estado/:id', actualizarEstado)

    .get('/ventas/:id', obtenerVentaPorId)

    .put('/ventas/:id', actualizarVenta )

export default router;


