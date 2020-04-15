const express = require('express');

const app = express();

app.use('/', express.static('frontend/JS_alps-drive-project-frontend'));

app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Vous êtes à l\'accueil');
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