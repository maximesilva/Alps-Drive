const fs = require('fs');
const modulePath = require('path');

async function readAlpsDir(path) {

    const options = {withFileTypes: true}; //variable utilisé dans await
    //files renvoi un tableau de dirent.object
    const files = await fs.promises.readdir('/tmp/appdrive/' + path, options); //options si true je peux utiliser isDirector
    //fileMapPromise renvoi un tableau de promesse avec mapFile
    const fileMapPromise = files.map(file => mapFile(path, file));
    //renvoi une promesse qui contient le tableau de toute mes promesses PRETES donc les valeurs
    return Promise.all(fileMapPromise);

}

// function qui permet de transformer un dirent.object en promesse recursivement en un tableau
async function mapFile(path, file){
    if (file.isDirectory()) {
        return {
            name: file.name, //file.name car file est un objet
            isFolder: file.isDirectory(), //boolean en fonction du type vrai si dossier
        }
    }else {
        return {
            name: file.name, //file.name car file est un objet
            isFolder: file.isDirectory(), //boolean en fonction du type vrai si dossier
            size: await findFileSize(path, file) //j'attend la taille du fichier car c'est une fonction qui renvoi une promesse
        }
    }
}

//function qui attend la réponse de la taille d'un fichier
async function findFileSize(path, file){
    //path.join permet donner un chemin sans s'occuper des '/'
    const stat = await fs.promises.stat(modulePath.join('/tmp/appdrive/', path, file.name));
    return stat.size;
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

function createFolder(name) {
    fs.mkdir('/tmp/appdrive/' + name, {recursive: true}, (err) => {
        if (err) throw err;
    });
}


module.exports = {readAlpsDir, removeDirectory, createFolder};


