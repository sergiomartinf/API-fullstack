//configurar solo dotenv para el archivo .env
require("dotenv").config();

const express = require("express");
const {json} = require("body-parser");
const {leerTareas,crearTarea} = require("./db");

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
servidor.delete("/tareas/borrar:id", async (peticion,respuesta) => {
    respuesta.send(`Borraremos la tarea con el ID: ${peticion.params.id}`);
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