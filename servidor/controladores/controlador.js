var con = require("../lib/conexionbd")

function mostrarPeliculas(req, res){

    var pagina = parseInt(req.query.pagina)
    var cantidad = parseInt(req.query.cantidad)
    var primeraFila = (function(){
        if(pagina == 1){
            return 1
        } else {return pagina + (cantidad-1)*(pagina-1)
            }
    })()
    var columna_orden = req.query.columna_orden
    var titulo = req.query.titulo
    var tipo_orden = req.query.tipo_orden
    var anio = req.query.anio
    var genero = req.query.genero

    var sqlTitulo = "titulo LIKE '%" + titulo + "%' "
    var sqlAnio = "anio = " + anio
    var sqlGenero = "genero_id = " + genero

    var whereSql = (function(){
        if(titulo && anio && genero){
            return "WHERE " + sqlTitulo + " AND " + sqlAnio + " AND " + sqlGenero + " "
        } else if (titulo && anio && !genero ){
            return "WHERE " + sqlTitulo + " AND " + sqlAnio + " "
        } else if (titulo && !anio && genero ){
            return "WHERE " + sqlTitulo + " AND " + sqlGenero + " "
        } else if (!titulo && anio && genero ){
            return "WHERE " + sqlAnio + " AND " + sqlGenero + " "
        } else if (titulo && !anio && !genero ){
            return "WHERE " + sqlTitulo + " "
        } else if (!titulo && anio && !genero ){
            return "WHERE " + sqlAnio + " "
        } else if (!titulo && !anio && genero ){
            return "WHERE " + sqlGenero + " "
        }
        else return ""       
    })()
    

    var sqlBuscar = "SELECT * FROM pelicula " + whereSql + "ORDER BY " +  columna_orden + " " +  tipo_orden + " LIMIT " + primeraFila + ", " + cantidad
    
    
    
    con.query(sqlBuscar, function(error, resultado, fields){
        if(error){
            console.log("Hubo un error en la consulta", error.message)
            return res.status(404).send("Hubo un error en la consulta")
        }
        
        var sqlCount = "SELECT COUNT(*) AS COUNT FROM pelicula " + whereSql
        
        con.query(sqlCount, function(error, resultado2, fields){
            if(error){   
                console.log("Hubo un error en la consulta", error.message)
                return res.status(404).send("Hubo un error en la consulta")
            }

            console.log(resultado2)
            var response = {
                'peliculas': resultado,
                'total': resultado2[0].COUNT
            }  
            res.send(JSON.stringify(response))
        })
    })

}

function obtenerGeneros(req, res){
    var sqlGeneros = "SELECT * FROM genero"
    
    con.query(sqlGeneros, function(error, resultado, fields){
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
    var sqlPelicula = 
        `SELECT pelicula.*, genero.nombre 
        FROM pelicula 
        LEFT JOIN genero ON (genero.id = pelicula.genero_id)
        WHERE pelicula.id = '` + id + "'"
    var sqlActor = 
        `SELECT actor_pelicula.*, actor.NOMBRE
        FROM actor_pelicula
        LEFT JOIN actor ON (actor.id = actor_pelicula.actor_id)
        WHERE pelicula_id = '` + id +"'"
    
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
    
    var sqlAnio = "(anio BETWEEN " + anio_inicio + " AND " + anio_fin + ")"
    var sqlPuntuacion = "puntuacion >= " + puntuacion
    var sqlGenero = "genero.nombre = '" + genero + "'"
    
    var sqlWhere = (function(){
            if(genero && puntuacion && !anio_inicio){
                return "WHERE " + sqlGenero + " AND " + sqlPuntuacion
            } else if (genero && !puntuacion && anio_inicio){
                return "WHERE " + sqlGenero + " AND " + sqlAnio
            } else if (genero && !puntuacion && !anio_inicio) {
                return "WHERE " + sqlGenero
            } else if(!genero && puntuacion && !anio_inicio) {
                return "WHERE " + sqlPuntuacion
            } else if(!genero && !puntuacion && anio_inicio){
                return "WHERE " + sqlAnio
            } else if(!genero && !puntuacion && !anio_inicio){
                return ""
            }
        })()
    
    var sqlRecomendacion = 
        `SELECT *
        FROM pelicula
        LEFT JOIN genero on genero.id = pelicula.genero_id ` + sqlWhere

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
    
}

module.exports = {
    mostrarPeliculas: mostrarPeliculas,
    obtenerGeneros: obtenerGeneros,
    mostrarInformacionPelicula: mostrarInformacionPelicula,
    recomendarPelicula: recomendarPelicula
}