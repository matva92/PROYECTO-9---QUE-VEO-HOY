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
    
    var sql = (function(){if(!titulo && !genero && !anio){
        return "SELECT * FROM pelicula " + where_sql + "ORDER BY " +  columna_orden + " " +  tipo_orden + " LIMIT " + pagina + ", " + cantidad
        } else return "SELECT * FROM pelicula " + where_sql + "ORDER BY " +  columna_orden + " " +  tipo_orden + " LIMIT " + cantidad
    })()
    
    
    con.query(sql, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("Hubo un error en la consulta")
        }
        
        var sqlcount = "SELECT COUNT(*) AS COUNT FROM pelicula " + where_sql + "ORDER BY " +  columna_orden + " " +  tipo_orden
        con.query(sqlcount, function(error, resultado2, fields){
            var response = {
                'peliculas': resultado,
                'total': resultado2[0].COUNT
            }
            
            res.send(JSON.stringify(response))
        })
        
       
    })

}

function obtenerGeneros(req, res){
    var sql = "SELECT * FROM genero"
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

function mostrarInformacionPelicula(req, res){
    var id = req.params.id
    var sqlPelicula = "SELECT pelicula.*, genero.nombre FROM pelicula LEFT JOIN genero ON (genero.id = pelicula.genero_id) WHERE pelicula.id = '" + id + "'"
    var sqlActor = "SELECT actor_pelicula.*, actor.NOMBRE FROM actor_pelicula LEFT JOIN actor ON (actor.id = actor_pelicula.actor_id) WHERE pelicula_id = '" + id +"'"
    
    con.query(sqlPelicula, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("Hubo un error en la consulta")
        }

        con.query(sqlActor, function(error, resultado2, fields){
            
            var response = {
                'pelicula': resultado[0],
                'actores': resultado2 
            }
           
            res.send(JSON.stringify(response))
        }) 

    })

}

function recomendarPelicula(req, res){

    var genero = req.query.genero
    var puntuacion = req.query.puntuacion
    var anio_inicio = req.query.anio_inicio
    var anio_fin = req.query.anio_fin
    var genero_id = ""
    var sqlBuscarGeneroId = "SELECT id FROM genero WHERE nombre = '" + genero + "'"

    con.query(sqlBuscarGeneroId, function(error, resultadoGenero, fields){
       
        if (genero_id){genero_id = resultadoGenero[0].id}
                
        
        var sqlAnio = "(anio BETWEEN " + anio_inicio + " AND " + anio_fin + ")"
        var sqlGenero = "genero_id = " + genero_id + " "
        var sqlPuntuacion = "puntuacion >= " + puntuacion
    
        var sqlWhere = (function(){
            if(genero_id && puntuacion && !anio_inicio){
                return "WHERE " + sqlGenero + " AND " + sqlPuntuacion
            } else if (genero_id && !puntuacion && anio_inicio){
                return "WHERE " + sqlGenero + " AND " + sqlAnio
            } else if (genero_id && !puntuacion && !anio_inicio) {
                return "WHERE " + sqlGenero
            } else if(!genero_id && puntuacion && !anio_inicio) {
                return "WHERE " + sqlPuntuacion
            } else if(!genero_id && !puntuacion && anio_inicio){
                return "WHERE " + sqlAnio
            } else if(!genero_id && !puntuacion && !anio_inicio){
                return ""
            } 
        })()
    
        var sqlRecomendacion = "SELECT * FROM pelicula " + sqlWhere

        console.log(sqlRecomendacion)
    
        con.query(sqlRecomendacion, function(error, resultado, fields){
            if(error){
                console.log("Hubo un error en la consulta", error.message)
                return res.status(404).send("Hubo un error en la consulta")
            }
            var response = {
                'peliculas': resultado
            }           
            res.send(JSON.stringify(response))      
        })
    })
        

}

module.exports = {
    mostrarPeliculas: mostrarPeliculas,
    obtenerGeneros: obtenerGeneros,
    mostrarInformacionPelicula: mostrarInformacionPelicula,
    recomendarPelicula: recomendarPelicula
}