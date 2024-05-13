//configurar solo dotenv para el archivo .env
require("dotenv").config();

const express = require("express");
const {json} = require("body-parser");
const cors = require("cors");
const {leerTareas,crearTarea,borrarTarea,toggleEstado,editarTexto} = require("./db");

const servidor = express();

servidor.use(cors());

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

// Middleware PUT para actualizar una tarea pasando id
servidor.put("/tareas/actualizar/:id([0-9]+)/:operacion(1|2)", async (peticion,respuesta,siguiente) => {
    let operacion = Number(peticion.params.operacion);
    let funciones = [editarTexto,toggleEstado];

    if(operacion == 1 && (!peticion.body.tarea || peticion.body.tarea.trim() == "")){
        return siguiente(true);
    }

    try {
        let count = await funciones [operacion - 1](peticion.param.id, operacion == 1 ? peticion.doby.tarea : null);

        respuesta.json({ resultado : count ? "ok" : "ko" });

    } catch (error) {
        respuesta.status(500);
        respuesta.json(error);
    }

    respuesta.send(`operacion --> ${operacion}`);
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