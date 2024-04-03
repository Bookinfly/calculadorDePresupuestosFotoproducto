const http = require('node:http'); 
const fs = require('node:fs');
const path = require('node:path');
const { findAvailablePort } = require('./freePort'); 

const desiredPort = process.env.PORT || 3000; 

function leerArchivo(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

const server = http.createServer((req, res)=>{
    console.log("Recivimos Request");
    const htmlPath = path.join(__dirname, './public/index.html');
    const jsPath = path.join(__dirname, './public/script.js' );
    const cssPath = path.join(__dirname, './public/style.css');

    // if (req.url === '/' || req.url === '/index.html') {
    //     req.url = '/index.html';
    // }
    
    if(req.url === '/') {
        req.url = 'index.html'
    }

    Promise.all([
        leerArchivo(htmlPath),
        leerArchivo(jsPath),
        leerArchivo(cssPath)
    ]).then(([htmlContent, jsContent, cssContent]) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const finalHtml = htmlContent
        .replace('<style></style>', `<style>${cssContent}</style>`)
        .replace('<script></script>', `<script>${jsContent}</script>`);
        res.end(finalHtml);
    }).catch(err => {
        console.error('Error al leer los archivos:', err);
        res.writeHead(500);
        res.end('Error interno del servidor');
    });
})

findAvailablePort(desiredPort).then(port => 
    server.listen(port, () => {
        console.log(`Escuchando puerto ${desiredPort}`);
    })
);


