const express = require('express');
const asyncAwait = require('./async');
const bb = require('express-busboy');

const app = express(); // permet d'utiliser express avec la variable app
const reg =/^[\d\w\s]+$/; // RegExp qui prend que les caractère alphanumérique

bb.extend(app, {
    upload: true,
    path: '/tmp'
});

app.use('/', express.static('frontend/JS_alps-drive-project-frontend'));

app.get('/api/drive', async (req, res) => {
    try {
        const files = await asyncAwait.readAlpsDir('');
        res.send(files);
    } catch (error) {
        res.send('Pas bon');
    }
});

app.get('/api/drive/:name', async (req, res) => {

    /*if (!await asyncAwait.exists(req.params.name)) {
        return res.status(404).send(`"${req.params.name}" has been not found`);
    }*/ // permet de tester name existe
    try {
        const files = await asyncAwait.readAlpsDir(req.params.name); //req.params voir doc express route parameters

        /*files.then((result) => {
            res.send(result);
        });*/ // equivalent await en promesse

        res.send(files);
    } catch (error) {
        res.status(404).send(req.params.name + 'existe pas');
    }
});
app.delete('/api/drive/:name', async (req, res) => {
    // si le req.params.name contient des caractère alphanumérique j'execute
    if (reg.test(req.params.name)){
        try {
            //console.log(req.params.name);
            await asyncAwait.removeDirectory('', req.params.name); //obliger de faire await sinon obliger de rafraichir
            //console.log('ok');
            res.send('Deleted');
        } catch (error) {
            console.log(error);
            res.send('Pas deleted');
        }
    //sinon erreur 400
    }else {
        res.status(400).send('AH !');
    }
});

app.delete('/api/drive/:folder/:name', async (req, res) => {
    if (reg.test(req.params.folder)) {
        try {
            //console.log(req.params.name);
            await asyncAwait.removeDirectory(req.params.folder, req.params.name); //obliger de faire await sinon obliger de rafraichir
            //console.log('ok');
            res.send('Deleted');
        } catch (error) {
            console.log(error);
            res.status(404).send('Pas deleted');
        }
    }else {
        res.status(400).send('AH !');
    }
});

app.post('/api/drive', async (req, res) => {
    if (reg.test(req.query.name)) {
        try {
            //console.log(req.params.name);
            console.log(req.query.name);
            await asyncAwait.createFolder('', req.query.name); //obliger de faire await sinon obliger de rafraichir
            //console.log('ok');
            res.send('Created');
        } catch (error) {
            console.log(error);
            res.send('Pas created');
        }
    }else {
        res.status(400).send('AH !');
    }
});

app.post('/api/drive/:folder', async (req, res) => {
    if (reg.test(req.query.name)) {
        try {
            //console.log(req.params.name);
            //console.log(req.query.name);
            await asyncAwait.createFolder(req.params.folder, req.query.name); //obliger de faire await sinon obliger de rafraichir
            //console.log('ok');
            res.send('Created');
        } catch (error) {
            console.log(error);
            res.status(404).send(req.params.name + 'existe pas');
        }
    }else {
        res.status(400).send('AH !');
    }
});

app.put('/api/drive', async (req, res) => {
    console.log(req.files.file.filename);
    try {
        await asyncAwait.uploadFile('', req.files.file.file, req.files.file.filename); //obliger de faire await sinon obliger de rafraichir
        //console.log('ok');
        res.send('Created');
    } catch (error) {
        console.log(error);
        res.send('Aucun fichier présent dans la requête');
    }
});

app.put('/api/drive/:folder', async (req, res) => {
    console.log(req.files.file.filename);
    try {
        await asyncAwait.uploadFile(req.params.folder, req.files.file.file, req.files.file.filename); //obliger de faire await sinon obliger de rafraichir
        //console.log('ok');
        res.send('Created');
    } catch (error) {
        console.log(error);
        res.status(404).send(req.params.folder + 'nexiste pas');
    }
});
// ... Tout le code de gestion des routes (app.get) se trouve au-dessus

app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

function start() {
    app.listen(3000, function () {
        console.log('Example app listening on port 3000!')
    });
}
exports.start = start;