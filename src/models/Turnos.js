import { Schema, model } from "mongoose";

const turnoSchema = new Schema({

    title:{
        type:String,
        required:true

    },
    start: {
        type: Date,
        required: true
    },
    end: {
        type: Date,
        required: true
    },

}, {
    timestamps: true,
    versionKey: false
}
)
export default model('Turno', turnoSchema)