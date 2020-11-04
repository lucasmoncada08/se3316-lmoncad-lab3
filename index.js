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

app.use('/', express.static('static'))

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
        res.status(404).send(["The course ID given does not exist"]);
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
        res.status(404).send(["The name entered already exists"]);
});

app.get('/api/timetable/view/:schedName', (req, res) => {
    console.log(`Get request for ${req.url}`);
    if (schedules["scheduleNames"].find(item => item == req.params.schedName)) {
        var index = schedules["scheduleNames"].findIndex(item => item === req.params.schedName);
        var subjAndCode = [];
        for (var i=0; i<schedules["subjects"][index].length; i++) {
            subjAndCode = subjAndCode.concat(schedules["subjects"][index][i]);
            subjAndCode = subjAndCode.concat(schedules["courseCodes"][index][i]);
        }
        res.send(subjAndCode);
    }
    else
        res.status(404).send([`The given schedule name: ${req.params.schedName} is not defined`]);
});

app.get('/api/timetable/listall', (req, res) => {
    console.log(`Get request for ${req.url}`);
    var len = schedules["scheduleNames"].length;
    var schedAndNumCourses = [];
    for (var i=0; i<len; i++) {
        schedAndNumCourses = schedAndNumCourses.concat(schedules["scheduleNames"][i]);
        schedAndNumCourses = schedAndNumCourses.concat(schedules["courseCodes"][i].length);
    }
    res.send(schedAndNumCourses);
});

app.delete('/api/timetable/deleteall', (req, res) => {
    console.log(`Get request for ${req.url}`);
    var len = schedules["scheduleNames"].length;
    schedules["scheduleNames"].splice(0, len);
    schedules["subjects"].splice(0, len);
    schedules["courseCodes"].splice(0, len);
    res.send(schedules);
});

app.delete('/api/timetable/delete/:schedName', (req, res) => {
    console.log(`Post request for ${req.url}`);
    if (schedules["scheduleNames"].find(item => item == req.params.schedName)) {
        var index = schedules["scheduleNames"].findIndex(item => item === req.params.schedName);
        schedules["scheduleNames"].splice(index, 1);
        schedules["subjects"].splice(index, 1);
        schedules["courseCodes"].splice(index, 1);
        res.send(schedules);
    }
    else
        res.status(404).send([`The given schedule name: ${req.params.schedName} is not defined`]);
});

app.post('/api/timetable/modify/:schedName', jsonParser, (req, res) => {
    console.log(`Post request for ${req.url}`);
    if (schedules["scheduleNames"].find(item => item == req.params.schedName)) {
        var index = schedules["scheduleNames"].findIndex(item => item === req.params.schedName);
        var match = false;
        var allMatches = true;
        schedules["subjects"][index] = req.body.subjects;
        schedules["courseCodes"][index] = req.body.courseCodes;
        for (var i=0; i<schedules["subjects"][index].length; i++) {
            match = false;
            for (var j=0; j<json.length; j++) {
                if (json[j]["subject"] == schedules["subjects"][index][i] && json[j]["catalog_nbr"] == schedules["courseCodes"][index][i])
                    match = true;
            }
            if (!match) {
                allMatches = false;
                break;
            }
        }
        if (allMatches)
            res.send(schedules);
        else
            res.status(404).send(["The subject code and course code combination is not valid"]);
    }
    else
        res.status(404).send([`The given schedule name: ${req.params.schedName} is not defined`]);
});

app.get('/api/times/:subjCode/:courseCode', (req, res) => {
    console.log(`Get request for ${req.url}`);
    var times = [];
    for (var i=0; i<json.length; i++) {
        if (json[i]["subject"] == req.params.subjCode && json[i]["catalog_nbr"] == req.params.courseCode) {
            times = times.concat(json[i]["course_info"][0]["start_time"]);
            times = times.concat(json[i]["course_info"][0]["end_time"]);
            times = times.concat(json[i]["course_info"][0]["days"]);
            times = times.concat(json[i]["course_info"][0]["ssr_component"]);
        }
    }
    if (times.length > 0)
        res.send(times);
    else
        res.status(404).send(["The subject code and course code combination is not valid"]);
});

app.get('/api/times/:subjCode/:courseCode/:component', (req, res) => {
    console.log(`Get request for ${req.url}`);
    var times = [];
    for (var i=0; i<json.length; i++) {
        if (json[i]["subject"] == req.params.subjCode && json[i]["catalog_nbr"] == req.params.courseCode && json[i]["course_info"][0]["ssr_component"] == req.params.component) {
            times = times.concat(json[i]["course_info"][0]["start_time"]);
            times = times.concat(json[i]["course_info"][0]["end_time"]);
            times = times.concat(json[i]["course_info"][0]["days"]);
        }
    }
    if (times.length > 0)
        res.send(times);
    else
        res.status(404).send(["The subject code and course code combination is not valid"]);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});