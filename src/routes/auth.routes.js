import Router from 'express'
import express from 'express'
import { body } from 'express-validator'
import { login, register } from '../controllers/auth.controller.js';
import { validationResultExpress } from '../middlewares/validationResultExpress.js';

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
        if(value !== req.body.repassword){
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







export default router;