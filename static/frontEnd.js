document.getElementById('getSubjCodeAndDescr').addEventListener('click', getSubjCodesAndDescrs);
document.getElementById('getCourseCodesWithSubjCode').addEventListener('click', function() {
    getCourseCodesWSubjCode(document.getElementById('subjCodeForCourseCodes').value)});
document.getElementById('getTimetableEntry').addEventListener('click', function() {
    getTimetableEntry(document.getElementById('subjCode1ForTimetable').value, document.getElementById('courseCode1ForTimetable').value)});    
document.getElementById('getTimetableEntryWComponent').addEventListener('click', function() {
    getTimetableEntryWComp(document.getElementById('subjCode2ForTimetable').value, document.getElementById('courseCode2ForTimetable').value, 
    document.getElementById('courseCompForTimetable').value)});    

var currentTimetableData = [];

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
    fetch(`/api/timetable/${subjCode}/${courseCode}`)
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
    fetch(`/api/timetable/${subjCode}/${courseCode}/${courseComp}`)
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