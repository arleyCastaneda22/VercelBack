import Router from 'express'
import express from 'express'
import { body } from 'express-validator'
import { login, register, recuperarContraseña,  actualizarContraseña, verificarContrasena} from '../controllers/auth.controller.js';
import { validationResultExpress } from '../middlewares/validationResultExpress.js';
// auth.routes.js
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post("/register",[
    body('email', "el correo debe ser correcto")
    .trim()
    .isEmail()
    .normalizeEmail(),

    body('contrasena', "minimo 6 caracteres").trim().isLength({min:6}),
    body('contrasena', "la contraseña debe ser valida")
    .trim()
    .custom((value, {req}) => {
        if(value !== req.body.recontrasena){
            throw new Error("no conciden las contraseñas")
        }
        return value;
    }),
    ],
    validationResultExpress,
    register
    );

router.post("/login",[
    body('email', "el correo debe ser correcto")
    .trim()
    .isEmail()
    .normalizeEmail(),
    body('contrasena', "minimo 6 caracteres").trim().isLength({min:6}),
    ],
    validationResultExpress,
    login
    );

router.post("/forgot-password", recuperarContraseña)

router.put('/cambio/:id/:token',actualizarContraseña )

router.post('/:id/verificar-contrasena', verificarContrasena);

export default router;