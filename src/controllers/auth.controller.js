
import { validationResult } from "express-validator"



export const register = (req,res) =>{
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    res.json({ok:"regiser works"})
}



export const login = (req,res) =>{
    console.log(req.body)
    res.json({ok:"login works"})
}
