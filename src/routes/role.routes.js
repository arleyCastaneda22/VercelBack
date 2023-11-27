import Router from 'express'

import {createRole,listarRoles, listarUnRole} from '../controllers/Role.controller.js'

const router = Router();

router.post('/roles/', createRole)
    .get('/roles', listarRoles )
    .get('/roles/:id', listarUnRole)

export default router;