document.getElementById('getSubjCodeAndDescr').addEventListener('click', getSubjCodesAndDescrs);
document.getElementById('getCourseCodesWithSubjCode').addEventListener('click', function() {
    getCourseCodesWSubjCode(document.getElementById('subjCodeForCourseCodes').value)});
document.getElementById('getTimetableEntry').addEventListener('click', function() {
    getTimetableEntry(document.getElementById('subjCode1ForTimetable').value, document.getElementById('courseCode1ForTimetable').value)});    
document.getElementById('getTimetableEntryWComponent').addEventListener('click', function() {
    getTimetableEntryWComp(document.getElementById('subjCode2ForTimetable').value, document.getElementById('courseCode2ForTimetable').value, 
    document.getElementById('courseCompForTimetable').value)});
    
// Create new schedule button
document.getElementById('createNewSchedule').addEventListener('click', function() {
    createNewSchedule(document.getElementById('newSchedInput').value)});

// Submitting courses to a schedule button
document.getElementById('submitModifySchedule').addEventListener('click', function() {
    modifySchedule(document.getElementById('saveCoursesSchedName').value)});

var currentTimetableData = [];
var schedules = {
    scheduleNames: [],
    subjects: [],
    courseCodes: []
};

function getSubjCodesAndDescrs() {
    fetch("/api/subjects&description")
    .then(res => res.json()
    .then(data => {
        const l = document.getElementById('subjCodeAndDescrList');
        console.log(l.getElementsByTagName('li').length);
        if (l.getElementsByTagName('li').length == 0) {
            for (var i=0; i<(data.length/2); i++) {
                const item = document.createElement('li');
                item.appendChild(document.createTextNode(`${data[i*2]} - ${data[i*2+1]}`));
                l.appendChild(item);
            }
        }
    })
    )
}

function getCourseCodesWSubjCode(subjCode) {
    fetch(`/api/coursecodes/${subjCode}`)
    .then(res => res.json()
    .then(data => {
        console.log(data)
        const l = document.getElementById('courseCodesFromSubjList');
        if (l.getElementsByTagName('li').length > 0) {
            while (l.firstChild)
                l.removeChild(l.firstChild);
        }
        for (var i=0; i<(data.length); i++) {
            const item = document.createElement('li');
            item.appendChild(document.createTextNode(`${data[i]}`));
            l.appendChild(item);
        }
    })
    )
}

function getTimetableEntry(subjCode, courseCode) {
    fetch(`/api/times/${subjCode}/${courseCode}`)
    .then(res => res.json()
    .then(data => {
        currentTimetableData = data;
        const l = document.getElementById('timetableEntryList');
        if (l.getElementsByTagName('li').length > 0) {
            while (l.firstChild)
                l.removeChild(l.firstChild);
        }
        var item = document.createElement('li');
        if (data.length > 1) {
            item.appendChild(document.createTextNode(`${data[data.length-1]} time from ${data[0]} to ${data[1]}`));
            l.appendChild(item);
            var days = "Days: ";
            for (var i=2; i<data.length-1; i++)
                days = days.concat(`${data[i]} `);
            item = document.createElement('li');
            item.appendChild(document.createTextNode(`${days}`));
            l.appendChild(item);
        }
        else if (data.length == 1) {
            item.appendChild(document.createTextNode(`${data[0]}`));
            l.appendChild(item);
        }
    })
    )
}

function getTimetableEntryWComp(subjCode, courseCode, courseComp) {
    fetch(`/api/times/${subjCode}/${courseCode}/${courseComp}`)
    .then(res => res.json()
    .then(data => {
        currentTimetableData = data;
        const l = document.getElementById('timetableEntryWComponentList');
        if (l.getElementsByTagName('li').length > 0) {
            while (l.firstChild)
                l.removeChild(l.firstChild);
        }
        var item = document.createElement('li');
        if (data.length > 1) {
            item.appendChild(document.createTextNode(`${courseComp} time from ${data[0]} to ${data[1]}`));
            l.appendChild(item);
            var days = "Days: ";
            for (var i=2; i<data.length; i++)
                days = days.concat(`${data[i]} `);
            item = document.createElement('li');
            item.appendChild(document.createTextNode(`${days}`));
            l.appendChild(item);
        }
        else if (data.length == 1) {
            item.appendChild(document.createTextNode(`${data[0]}`));
            l.appendChild(item);
        }
    })
    )
}

function createNewSchedule(newSchedName) {
    fetch(`/api/timetable/new/${newSchedName}`)
    .then(res => res.json()
    .then(data => {
        schedules = data;
        const l = document.getElementById('scheduleNames');
        if (l.getElementsByTagName('li').length > 0) {
            while (l.firstChild)
                l.removeChild(l.firstChild);
        }
        if (data.length) {
            var item = document.createElement('li');
            item.appendChild(document.createTextNode(`${data[0]}`));
            l.appendChild(item);
            console.log(`in the if ${data}`);
        }
        else {
            for (var i=0; i<data["scheduleNames"].length; i++) {
                var item = document.createElement('li');
                item.appendChild(document.createTextNode(`${data["scheduleNames"][i]}`));
                l.appendChild(item);
            }
        }
    })
    )
}

function modifySchedule(schedName) {
    const newCourses = {
        subjects: [],
	    courseCodes: []
    }
    for (var i=1; i<=5; i++) {
        if (document.getElementById(`course${i}Check`).checked) {
            newCourses["subjects"] =  newCourses["subjects"].concat(document.getElementById(`course${i}SubjCode`).value);
            newCourses["courseCodes"] =  newCourses["courseCodes"].concat(document.getElementById(`course${i}CourseCode`).value);
        }
    }
    fetch(`/api/timetable/modify/${schedName}`, {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify(newCourses)
    })
    .then(res => res.json()
    .then(data => {
        schedules = data;
        console.log(data)
    })
    )
}