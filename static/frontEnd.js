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

// Searching for courses in a schedule button
document.getElementById('listCoursesInSchedule').addEventListener('click', function() {
    listCoursesFromSchedule(document.getElementById('listCoursesSchedName').value)});

// Showing schedules and num of courses button
document.getElementById('listSchedulesAndCourses').addEventListener('click', showSchedulesAndCourseNums);
    
// Deleting a schedule button
document.getElementById('deleteScheduleButton').addEventListener('click', function() {
    deleteSchedule(document.getElementById('deleteSchedName').value)});

// Deleting all schedules button
document.getElementById('deleteAllButton').addEventListener('click', deleteAllSchedules);

// Displaying schedule button
document.getElementById('displayScheduleButton').addEventListener('click', function() {
    displaySchedule(document.getElementById('scheduleToDisplay').value)
});


var currentTimetableData = [];
var schedules = {
    scheduleNames: [],
    subjects: [],
    courseCodes: []
};
var timeDict = {
    "8:30 AM": 1, "9:00 AM": 2,
    "9:30 AM": 3, "10:00 AM": 4,
    "10:30 AM": 5, "11:00 AM": 6,
    "11:30 AM": 7, "12:00 PM": 8,
    "12:30 PM": 9, "1:00 PM": 10,
    "1:30 PM": 11, "2:00 PM": 12,
    "2:30 PM": 13, "3:00 PM": 14,
    "3:30 PM": 15, "4:00 PM": 16,
    "4:30 PM": 17, "5:00 PM": 18,
    "5:30 PM": 19, "6:00 PM": 20,
    "6:30 PM": 21, "7:00 PM": 22,
    "7:30 PM": 23, "8:00 PM": 24,
    "8:30 PM": 25, "9:00 PM": 26,
    "9:30 PM": 27, "10:00 PM": 28
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
            newCourses["subjects"] = newCourses["subjects"].concat(document.getElementById(`course${i}SubjCode`).value);
            newCourses["courseCodes"] = newCourses["courseCodes"].concat(document.getElementById(`course${i}CourseCode`).value);
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

function listCoursesFromSchedule(schedName) {
    fetch(`/api/timetable/view/${schedName}`)
    .then(res => res.json()
    .then(data => {
        const l = document.getElementById('coursesFromScheduleList');
        if (l.getElementsByTagName('li').length > 0) {
            while (l.firstChild)
                l.removeChild(l.firstChild);
        }
        for (var i=0; i<(data.length/2); i++) {
            const item = document.createElement('li');
            item.appendChild(document.createTextNode(`${data[i*2]} - ${data[i*2+1]}`));
            l.appendChild(item);
        }
    })
    )
}

function showSchedulesAndCourseNums() {
    fetch('/api/timetable/listall')
    .then(res => res.json()
    .then(data => {
        const l = document.getElementById('allSchedulesAndCourseNumsList');
        if (l.getElementsByTagName('li').length > 0) {
            while (l.firstChild)
                l.removeChild(l.firstChild);
        }
        for (var i=0; i<(data.length/2); i++) {
            const item = document.createElement('li');
            item.appendChild(document.createTextNode(`${data[i*2]} has ${data[i*2+1]} courses`));
            l.appendChild(item);
        }
    })
    )
}

function deleteSchedule(schedName) {
    fetch(`/api/timetable/delete/${schedName}`, {
        method: 'DELETE',
        headers: {'Content-type': 'application/json'},
    })
}

function deleteAllSchedules() {
    fetch(`/api/timetable/deleteall`, {
        method: 'DELETE',
        headers: {'Content-type': 'application/json'},
    })
}

async function displaySchedule(schedName) {
    const table = document.getElementById('timetable');
    // Removing prior display functionality
    daysOfWeek = ["M", "Tu", "W", "Th", "F"];
    for (var i=1; i<28; i++) {
        for (var j=0; j<5; j++) {
            var element = document.getElementById(`time${i}`).getElementsByClassName(`${daysOfWeek[j]}`)[0];
            if (element.classList.length > 1) {
                element.classList.remove("LEC");
                element.classList.remove("TUT");
                element.classList.remove("LAB");
            }
            if (element.firstChild)
                element.removeChild(element.firstChild)
        }
    }

    const l = document.getElementById('allSchedulesAndCourseNumsList');
    if (l.getElementsByTagName('li').length > 0) {
        while (l.firstChild)
            l.removeChild(l.firstChild);
    }

    var schedIndex = schedules["scheduleNames"].findIndex(item => item == schedName);
    var subjCodes = schedules["subjects"][schedIndex];
    var courseCodes = schedules["courseCodes"][schedIndex];
    var times = [];
    var dataLengths = [];    

    for (var i=0; i<subjCodes.length; i++) {
        await fetch(`/api/times/${subjCodes[i]}/${courseCodes[i]}`)
        .then(res => res.json()
        .then(data => {
            times = times.concat(data);
            dataLengths = dataLengths.concat(data.length);
            console.log(times);
        }))
    }

    var timesIndex = 0;
    var startTime;
    var endTime;
    var days = [];
    
    for (var i=0; i<dataLengths.length; i++) {
        startTime = timeDict[`${times[timesIndex]}`];
        endTime = timeDict[`${times[timesIndex+1]}`];
        days = [];
        console.log(startTime);
        console.log(endTime);
        for (var j=timesIndex+2; j<(timesIndex+dataLengths[i]-1); j++) {
            days[j-timesIndex-2] = times[j];
        }
        console.log(days);
        for (var j=0; j<days.length; j++) {
            for (var k=startTime; k<endTime; k++) {
                var element = document.getElementById(`time${k}`).getElementsByClassName(`${days[j]}`)[0];
                element.classList.add(`${times[timesIndex+dataLengths[i]-1]}`);
                element.appendChild(document.createTextNode(`${subjCodes[i]} - ${courseCodes[i]}`));
            }
        }
        timesIndex += dataLengths[i];
    }
    
}