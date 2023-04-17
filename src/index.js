const express = require('express');
const path = require('path');
const multer = require('multer');


// inicializaciones
const app = express();


// settings
app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// middlewares
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, file.originalname.toLocaleLowerCase());
    }
});

const cargar = multer({
    storage: storage,
    dest: path.join(__dirname, 'public/uploads'),
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname)); 
        if(mimetype && extname){
            return cb(null, true);
        }
        cb("Error: El archivo debe ser una imagen válida.")
    }
}).single('image');

app.use(cargar);


// rutas
app.use(require('./routes/index.routes'));


// static files
app.use(express.static(path.join(__dirname, 'public')))


// iniciar servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor en el puerto ${app.get('port')}`);
});
