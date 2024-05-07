//configurar solo dotenv para el archivo .env
require("dotenv").config();

const postgres = require("postgres");

//FUNCIONES PARA LOS MIDDLEWARES
function conectar(){
    return postgres({
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD
    });
}

function leerTareas(){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = conectar();

            let tareas = await conexion`SELECT * FROM tareas`;

            conexion.end();

            ok(tareas);

        }catch(error){
            ko({ error : "error en el servidor" });
        }
    });
}

function crearTarea({tarea}){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = conectar();

            let [{id}] = await conexion`INSERT INTO tareas (tarea) VALUES (${tarea}) RETURNING id`;

            conexion.end();

            ok(id);

        }catch(error){
            ko({ error : "error en el servidor" });
        }
    });
}

function borrarTarea(id){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = conectar();

            let {count} = await conexion`DELETE FROM tareas WHERE id = ${id} `;

            conexion.end();

            ok(count);

        }catch(error){
            ko({ error : "error en el servidor" });
        }
    });
}

function toggleEstado(id){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = conectar();

            let {count} = await conexion`UPDATE tareas SET terminada = NOT terminada WHERE id = ${id} `;

            conexion.end();

            ok(count);

        }catch(error){
            ko({ error : "error en el servidor" });
        }
    });
}

function editarTexto(id,tarea){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = conectar();

            let {count} = await conexion`UPDATE tareas SET tarea = ${tarea} WHERE id = ${id} `;

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
editarTexto(2, "integrar front y back")
.then(x => console.log(x))
.catch(x => console.log(x));
*/

module.exports = {leerTareas,crearTarea,borrarTarea,toggleEstado,editarTexto};