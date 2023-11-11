import { Router } from 'express';

import bcrypt from 'bcrypt';
//hashear la contraseña
import jwt from 'jsonwebtoken';

//impotando el modelo de usario
import User from '../models/User';

const router = Router();


// router.post('/registro', async (req, res) => {
//     const { correo_usuario, nombre, apellido, contrasena } = req.body;
//     const user = new User({ correo_usuario, nombre, apellido, contrasena });

//     try {
//         const result = await user.save();
//         res.json(result);
//     } catch (error) {
//         res.status(500).json({ error: 'Error al guardar el usuario en la base de datos' });
//     }
// });

router.post("/login",async(req,res) => {
    res.send("login woks")
})

router.get('/user', (req,res) => {
    res.send("user")
})


router.get('/',(req,res)=> res.send('Hello word'))



module.exports = router;