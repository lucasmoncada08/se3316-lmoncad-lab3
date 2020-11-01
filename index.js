const express = require('express');
const app = express();

let json = require('./Lab3-timetable-data.json');

app.get('/api/courses', (req, res) => {
    console.log(`Get request for ${req.url}`);
    var subjAndDescr = [];
    for (var i=0; i<json.length; i++) {
        subjAndDescr = subjAndDescr.concat(json[i]["subject"]);
        subjAndDescr = subjAndDescr.concat(json[i]["className"]);
    }
    res.send(subjAndDescr);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});