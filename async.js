const fs = require('fs');

async function readAlpsDir(name) {
    let options = {withFileTypes: true}; //variable utilisé dans await
    const files = await fs.promises.readdir('/tmp/appdrive/' + name, options); //options si true je peux utiliser isDirectory
    console.log(files);
    return files.map(file =>
        ({
            name: file.name, //file.name car file est un objet
            isFolder: file.isDirectory() //boolean en fonction du type vrai si dossier
        })
    );
}

function removeDirectory(name) {
    return fs.promises.stat('/tmp/appdrive/' + name) //retour de la promesse de la promesse
        .then((result) => {
            if (result.isDirectory()) {
                const removeDir = fs.promises.rmdir('/tmp/appdrive/' + name, {recursive: true}); //rmdir necessite un callback ou une promesse d'ou le .promises
                return removeDir; //retour de la promesse
            } else {
                const removeFile = fs.promises.unlink('/tmp/appdrive/' + name); //unlink supprime un fichier
                return removeFile; //retour de la promesse
            }
        })
}

module.exports = {readAlpsDir, removeDirectory};


