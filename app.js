const http = require('node:http'); //importo método http
const { findAvailablePort } = require('./freePort'); //importo modulo para buscar puerto

const desiredPort = process.env.PORT ?? 0; //variable de entorno o puerto 3000 en su defecto

const server = http.createServer((req, res)=>{//creo server 
    console.log("Recivimos Request");
    res.env("Calculalo");//devuelvo info de la request
})

findAvailablePort(desiredPort).then(port => {//chequeo el puerto deseado y cuando se define un puerto activo la escucha
    server.listen(port, () => {//escucho puerto
        console.log(`Escuchando puerto ${desiredPort}`);//veo que puerto se designo
    });
});


