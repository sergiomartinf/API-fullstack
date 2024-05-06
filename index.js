//configurar solo dotenv para el archivo .env
require("dotenv").config();

const express = require("express");

const servidor = express();

//MIDDLEWARES
if(process.env.LOCAL){
    servidor.use(express.static("./pruebas"));
}



servidor.listen(process.env.PORT);