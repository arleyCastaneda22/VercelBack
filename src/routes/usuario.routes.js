import Router from 'express'
import {listarUsuarios,listarUnUsuario,editarUsuario,eliminarUsuario} from '../controllers/Usuario.controller.js'
import {register} from '../controllers/auth.controller.js'

import * as auth from '../middlewares/authjwt.js';


const router = Router();

router.get('/usuarios',listarUsuarios)

    .get('/usuarios/:id', listarUnUsuario)

    .post('/usuarios', register)

    .put('/usuarios/:id', editarUsuario)

    .delete('/usuarios/:id', eliminarUsuario)

export default router;