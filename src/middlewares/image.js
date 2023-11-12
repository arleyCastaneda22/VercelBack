import multer from "multer";

const guardar=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, './public/uploads')
    },
    filename: (req, file, cb)=>{
        if(file !=null){
            const ext = file.originalname.split( '.').pop();
            cb(null, Date.now()+'.'+ext)
        }

    }
})

const fileFilter=(req, file, cb)=> {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg'
    ) {
        cb(null, true);
    } else {
        cb(new Error('Formato No válido'));
    }
};

export default subirImagen=multer({storage:guardar, fileFilter:fileFilter})


