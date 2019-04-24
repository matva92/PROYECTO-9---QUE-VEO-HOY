var con = require("../lib/conexionbd")

function mostrarPeliculas(req, res){

    var pagina = req.query.pagina
    var cantidad = req.query.cantidad
    var columna_orden = req.query.columna_orden
    var titulo = req.query.titulo
    var tipo_orden = req.query.tipo_orden
    var anio = req.query.anio
    var genero = req.query.genero

    var where_sql = (function(){
        if(titulo && anio && genero){
            return "where titulo like '%" + titulo + "%' and anio = " + anio + " and genero_id = " + genero + " "
        } else if (titulo && anio && !genero ){
            return "where titulo like '%" + titulo + "%' and anio = " + anio + " "
        } else if (titulo && !anio && genero ){
            return "where titulo like '%" + titulo + "%' and genero_id = " + genero + " "
        } else if (!titulo && anio && genero ){
            return "where anio = " + anio + " and genero_id = " + genero + " "
        } else if (titulo && !anio && !genero ){
            return "where titulo like '%" + titulo + "%' "
        } else if (!titulo && anio && !genero ){
            return "where anio = " + anio + " "
        } else if (!titulo && !anio && genero ){
            return "where genero_id = " + genero + " "
        }
        else return ""
           
    })()
    
    var sql = "SELECT * FROM pelicula " + where_sql + "ORDER BY " +  columna_orden + " " +  tipo_orden + " LIMIT " + pagina + ", " + cantidad
    var count = "SELECT COUNT(*) AS COUNT FROM pelicula " + where_sql + "ORDER BY " +  columna_orden + " " +  tipo_orden
    

    con.query(sql, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("Hubo un error en la consulta")
        }

        con.query(count, function(error, resultado2, fields){
            var response = {
                'peliculas': resultado,
                'total': resultado2[0].COUNT
            }
         
            res.send(JSON.stringify(response))
        })
        
       
    })

}

function obtenerGeneros(req, res){
    var sql = "select * from genero"
    con.query(sql, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("Hubo un error en la consulta")
        }
        var response = {
            'generos': resultado
        }
        res.send(JSON.stringify(response))
        
    })
}



module.exports = {
    mostrarPeliculas: mostrarPeliculas,
    obtenerGeneros: obtenerGeneros
}