import mongoose, { Schema, model } from "mongoose";


const roleSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    }
});

// module.exports = moongoose.model('User', userSchema);
export const Role = mongoose.model('Role',roleSchema)

export default model('Role', roleSchema)