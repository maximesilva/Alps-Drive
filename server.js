const express = require('express');
const asyncAwait = require('./async');

const app = express(); // permet d'utiliser express avec la variable app

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
    try {
        //console.log(req.params);
        const files = await asyncAwait.readAlpsDir(req.params.name); //req.params voir doc express route parameters
        res.send(files);
    } catch (error) {
        res.send('Pas bon');
    }
});
app.delete('/api/drive/:name', async (req, res) => {
    try {
        //console.log(req.params.name);
        await asyncAwait.removeDirectory(req.params.name); //obliger de faire await sinon obliger de rafraichir
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
        await asyncAwait.createFolder(req.query.name); //obliger de faire await sinon obliger de rafraichir
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