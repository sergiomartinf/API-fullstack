//configurar solo dotenv para el archivo .env
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

function conectar(){
    return MongoClient.connect(process.env.URL_MONGO);
}

function leerTareas(){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let tareas = await conexion.db("tareas").collection("tareas").find({}).toArray();

            conexion.close();

            ok(tareas);

        }catch(error){
            ko({ error : "error en el servidor" });
        }
    });
}

function crearTarea({tarea}){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let [{insertedId}] = await conexion.db("tareas").collection("tareas").insertOne({tarea});

            conexion.close();

            ok(insertedId);

        }catch(error){
            ko({ error : "error en el servidor" });
        }
    });
}

function borrarTarea({id}){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let {deletedCount} = await conexion.db("tareas").collection("tareas").deleteOne( { _id : new ObjectId(id) });

            conexion.close();

            ok(deletedCount);

        }catch(error){
            ko({ error : "error en el servidor" });
        }
    });
}

function toggleEstado(id){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let {terminada} = await conexion.db("tareas").collection("tareas").findOne({ _id : new ObjectId(id) });

            let {modifiedCount} = await conexion.db("tareas").collection("tareas").updateOne({ _id : new ObjectId(id) }, { $set : { tarea : tarea }});

            conexion.close();

            ok(modifiedCount);

        }catch(error){
            //ko({ error : "error en el servidor" });
            console.log(error);
        }
    });
}

function editarTexto(id,tarea){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();

            let {count} = await conexion.db("tareas").collection("tareas");

            conexion.end();

            ok(count);

        }catch(error){
            ko({ error : "error en el servidor" });
        }
    });
}

/*
//Enseña por terminal si funciona o no la funcion que quiera
//Hay que comentar module.exports
crearTarea("Hace la compra")
.then(x => console.log(x))
.catch(x => console.log(x));
*/

module.exports = {leerTareas,crearTarea,borrarTarea,toggleEstado,editarTexto};