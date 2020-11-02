const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const jsonParser = bodyParser.json();

let json = require('./Lab3-timetable-data.json');
var schedules = {
    scheduleNames: [],
    subjects: [],
    courseCodes: []
};

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

app.get('/api/timetable/new/:schedName', (req, res) => {
    console.log(`Get request for ${req.url}`);
    if (schedules["scheduleNames"].every(item => item != req.params.schedName)) {
        schedules["scheduleNames"] = schedules["scheduleNames"].concat(req.params.schedName);
        schedules["subjects"] = schedules["subjects"].concat([[]]);
        schedules["courseCodes"] = schedules["courseCodes"].concat([[]]);
        res.send(schedules);
    }
    else
        res.status(404).send("The name entered already exists");
});

app.post('/api/timetable/modify/:schedName', jsonParser, (req, res) => {
    console.log(`Post request for ${req.url}`);
    if (schedules["scheduleNames"].find(item => item == req.params.schedName)) {
        var index = schedules["scheduleNames"].findIndex(item => item === req.params.schedName);
        console.log(index);
        console.log(req.body);
        schedules["subjects"][index] = req.body.subjects;
        schedules["courseCodes"][index] = req.body.courseCodes;
        res.send(schedules);
    }
    else
        res.status(404).send(`The given schedule name: ${req.params.schedName} is not defined`);
});

app.get('/api/timetable/:subjCode/:courseCode', (req, res) => {
    console.log(`Get request for ${req.url}`);
    var times = [];
    for (var i=0; i<json.length; i++) {
        if (json[i]["subject"] === req.params.subjCode && json[i]["catalog_nbr"] === req.params.courseCode) {
            times = times.concat(json[i]["course_info"][0]["start_time"]);
            times = times.concat(json[i]["course_info"][0]["end_time"]);
            times = times.concat(json[i]["course_info"][0]["days"]);
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
    var times = [];
    for (var i=0; i<json.length; i++) {
        if (json[i]["subject"] === req.params.subjCode && json[i]["catalog_nbr"] === req.params.courseCode && json[i]["course_info"][0]["ssr_component"] === req.params.component) {
            times = times.concat(json[i]["course_info"][0]["start_time"]);
            times = times.concat(json[i]["course_info"][0]["end_time"]);
            times = times.concat(json[i]["course_info"][0]["days"]);
        }
    }
    if (times.length > 0)
        res.send(times);
    else
        res.status(404).send("The subject code and course code combination is not valid");
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