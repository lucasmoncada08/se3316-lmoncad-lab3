document.getElementById('getSubjCodeAndDescr').addEventListener('click', getSubjCodesAndDescrs);

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

