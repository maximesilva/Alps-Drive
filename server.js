const express = require('express');
const asyncAwait = require('./async');
const bb = require('express-busboy');

const app = express(); // permet d'utiliser express avec la variable app

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
        res.status(500).send('Pas bon');
    }
});
app.delete('/api/drive/:name', async (req, res) => {
    try {
        //console.log(req.params.name);
        await asyncAwait.removeDirectory('', req.params.name); //obliger de faire await sinon obliger de rafraichir
        //console.log('ok');
        res.send('Deleted');
    } catch (error) {
        console.log(error);
        res.send('Pas deleted');
    }
});

app.delete('/api/drive/:folder/:name', async (req, res) => {
    try {
        //console.log(req.params.name);
        await asyncAwait.removeDirectory(req.params.folder, req.params.name); //obliger de faire await sinon obliger de rafraichir
        //console.log('ok');
        res.send('Deleted');
    } catch (error) {
        console.log(error);
        res.send('Pas deleted');
    }
});

app.post('/api/drive', async (req, res) => {
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
});

app.post('/api/drive/:folder', async (req, res) => {
    try {
        //console.log(req.params.name);
        //console.log(req.query.name);
        await asyncAwait.createFolder(req.params.folder, req.query.name); //obliger de faire await sinon obliger de rafraichir
        //console.log('ok');
        res.send('Created');
    } catch (error) {
        console.log(error);
        res.send('Pas created');
    }
});

app.put('/api/drive', async (req, res) => {
    console.log(req.files);
    try {
        await asyncAwait.uploadFile(req.params.folder, req.file); //obliger de faire await sinon obliger de rafraichir
        //console.log('ok');
        res.send('Created');
    } catch (error) {
        console.log(error);
        res.send('Pas created');
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