var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(__dirname + '/src'));

app.get('/pwa*', function(req, res) {
    res.sendFile(path.join(__dirname + '/lifecycle.html'));
});

app.listen(3000);
