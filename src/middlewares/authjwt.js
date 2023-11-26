import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Role from '../models/Role.js';

export const verifyToken = (req, res, next) => {
    try {
        const token = req.headers["authorization"];

        console.log("Token:", token);

        if (!token) {
            console.log("No token provided");
            return res.status(403).json({ message: "No token provided" });
        }

        // Verifica el token
        jwt.verify(token.replace('Bearer ', ''), 'secretKey', (err, decoded) => {
            if (err) {
                console.log("Unauthorized - Invalid token");
                return res.status(401).json({ message: "Unauthorized" });
            }

            // Decodifica el token y agrega la información del usuario al objeto req
            req.userId = decoded._id;
            console.log("Token verified. User ID:", req.userId);
            next();
        });
    } catch (error) {
        console.error("Error in verifyToken middleware:", error.message);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

//permisos para admin
export const isAdmin = async (req,res, next) => {
    const user = await User.findById(req.userId)

    const roles = await Role.find({_id:{$in: user.roles}})

    for(let i = 0; i< roles.length; i++){
        if(roles[i].nombre === "admin"){
            next();
            return;
        }
    }
    return res.status(403).json({message: "No tienes permiso para relizar esta Accion"})
}

//permisos para estilista
export const isEstilista = async (req,res, next) => {
    const user = await User.findById(req.userId)

    const roles = await Role.find({_id:{$in: user.roles}})

    for(let i = 0; i< roles.length; i++){
        if(roles[i].nombre === "estilista"){
            next();
            return;
        }
    }
    return res.status(403).json({message: "No tienes permiso para relizar esta Accion"})
}