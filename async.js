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
    //await attend la réponse
    const stat = await fs.promises.stat(modulePath.join('/tmp/appdrive/', path, file.name));
    return stat.size;
}

function removeDirectory(folder, folderDeleted) {
    //retour de la promesse de la promesse
    return fs.promises.stat(modulePath.join('/tmp/appdrive/', folder, folderDeleted))
        .then((result) => {
            if (result.isDirectory()) {
                //rmdir necessite un callback ou une promesse d'ou le .promises
                const removeDir = fs.promises.rmdir(modulePath.join('/tmp/appdrive/', folder, folderDeleted), {recursive: true});
                return removeDir; //retour de la promesse
            } else {
                //unlink supprime un fichier
                const removeFile = fs.promises.unlink(modulePath.join('/tmp/appdrive/', folder, folderDeleted));
                return removeFile; //retour de la promesse
            }
        })
}

async function createFolder(file, name) {
    await fs.promises.mkdir(modulePath.join('/tmp/appdrive/', file, name), {recursive: true}, (err) => {
        if (err) throw err;
    });
}
async function uploadFile(folder, oldPath, newPath){
     await fs.promises.rename(oldPath, modulePath.join('/tmp/appdrive/', folder, newPath), (err) => {
         if (err) throw err;
         console.log('Rename complete!');
     });
 }

module.exports = {readAlpsDir, removeDirectory, createFolder, uploadFile};


