import Router from 'express'
import express from 'express'
import { body } from 'express-validator'
import { login, register } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register",[
    body('correo_usuario', "el correo debe ser correcto")
    .trim()
    .isEmail()
    .normalizeEmail(),

    body('contrasena', "minimo 6 caracteres").trim().isLength({min:6}),
    body('contrasena', "la contraseña debe ser valida")
    .trim()
    .custom((value, {req}) => {
        if(value !== req.body.repassword){
            throw new Error("no conciden las contraseñas")
        }
        return value;
    }),
    ],
    register
);

router.post("/login", login);







export default router;