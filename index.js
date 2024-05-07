//configurar solo dotenv para el archivo .env
require("dotenv").config();

const express = require("express");
const {json} = require("body-parser");
const {leerTareas,crearTarea,borrarTarea,toggleEstado,editarTexto} = require("./db");

const servidor = express();

servidor.use(json());

//MIDDLEWARES
if(process.env.LOCAL){
    servidor.use(express.static("./pruebas"));
}

// Middleware GET para ver las tareas
servidor.get("/tareas", async (peticion,respuesta) => {
    try {
        let resultado = await leerTareas();

        respuesta.json(resultado);

    } catch (error) {
        respuesta.status(500);
        respuesta.json(error);
    }
});

// Middleware POST para crear una tarea
servidor.post("/tareas/nueva", async (peticion,respuesta,siguiente) => {
    if(!peticion.body.tarea || peticion.body.tarea.trim() == ""){
        return siguiente(true);
    }

    try {
        // Crea el tarea de la peticion que tenemos en el html(FETCH)
        let id = await crearTarea(peticion.body.tarea);

        respuesta.json({id});

    } catch (error) {
        respuesta.status(500);
        respuesta.json(error);
    }
});

// Middleware DELETE
// :id([0,9]+) es para que borre un numero (no vale string)
servidor.delete("/tareas/borrar/:id([0-9]+)", async (peticion,respuesta) => {
    try {
        let count = await borrarTarea(peticion.params.id);

        respuesta.json({ resultado : count ? "ok" : "ko" });
        
    } catch (error) {
        respuesta.status(500);
        respuesta.json(error);
    }
});

// Middleware ERROR 404 (not found)
servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "not found"});
});

// Middleware ERROR ---> invocar función "siguiente" con argunentos, el primer argumento será el error
servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "error en la peticion" })
});


servidor.listen(process.env.PORT);