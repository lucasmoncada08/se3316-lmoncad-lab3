const express = require('express');
const app = express();

let json = require('./Lab3-timetable-data.json');

app.get('/api/subjects&description', (req, res) => {
    console.log(`Get request for ${req.url}`);
    var subjAndDescr = [];
    for (var i=0; i<json.length; i++) {
        subjAndDescr = subjAndDescr.concat(json[i]["subject"]);
        subjAndDescr = subjAndDescr.concat(json[i]["className"]);
    }
    res.send(subjAndDescr);
});


app.get('/api/coursecodes/:code', (req, res) => {
    console.log(`Get request for ${req.url}`);
    var courseCodes = [];
    for (var i=0; i<json.length; i++) {
        if (json[i]["subject"] === req.params.code)
            courseCodes = courseCodes.concat(json[i]["catalog_nbr"]);
    }
    if (courseCodes.length > 0)
        res.send(courseCodes)
    else
        res.status(404).send("The course ID given does not exist");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});