//configurar solo dotenv para el archivo .env
require("dotenv").config();

const express = require("express");
const {leerTareas} = require("./db");

const servidor = express();

//MIDDLEWARES
if(process.env.LOCAL){
    servidor.use(express.static("./pruebas"));
}

// Middleware GET ruta "/tareas" para ver las tareas
servidor.get("/tareas", async (peticion,respuesta) => {
    try {
        let resultado = await leerTareas();

        respuesta.json(resultado);

    } catch (error) {
        respuesta.status(500);
        respuesta.json(error);
    }
});

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "not found"});
});


servidor.listen(process.env.PORT);