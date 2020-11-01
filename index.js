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

app.get('/api/timetable/:subjCode/:courseCode', (req, res) => {
    console.log(`Get request for ${req.url}`);
    var times = [];
    for (var i=0; i<json.length; i++) {
        if (json[i]["subject"] === req.params.subjCode && json[i]["catalog_nbr"] === req.params.courseCode) {
            times = times.concat(json[i]["course_info"][0]["start_time"]);
            times = times.concat(json[i]["course_info"][0]["end_time"]);
            times = times.concat(json[i]["course_info"][0]["ssr_component"]);
        }
    }
    if (times.length > 0)
        res.send(times);
    else
        res.status(404).send("The subject code and course code combination is not valid");
});

app.get('/api/timetable/:subjCode/:courseCode/:component', (req, res) => {
    console.log(`Get request for ${req.url}`);
    
});

// Function for outputting the few items that are not lecture components
app.get('/api/coursecomponents', (req, res) => {
    console.log(`Get request for ${req.url}`);
    var count = 0;
    for (var i=0; i<json.length; i++) {
        if (json[i]["course_info"][0]["ssr_component"] != 'LEC') {
            console.log(json[i]);
            count++;
        }
    }
    res.send(count.toString());
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});