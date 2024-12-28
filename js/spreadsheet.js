fields = [
    "Filme"
]

names = [
    "Spectros - algum nome nenhum rosto"
]

doctypes = [
    "Documentário"
]

authors = [
    "Ciro Lubliner"
]

dates = [
    "20/12/2024"
]

places = [
    "Sorocaba, SP, São Paulo"
]

hlinks = [
    "https://live.staticflickr.com/65535/54232250160_c844033733_b.jpg"
]


function onSearched() {
    var x = document.getElementById("searchbox").value;
    for (let i=0; i<fields.length;i++) {
        if (fields[i].toLowerCase().includes(x) || names[i].toLowerCase().includes(x) || 
        doctypes[i].toLowerCase().includes(x) || authors[i].toLowerCase().includes(x) || 
        dates[i].toLowerCase().includes(x) || places[i].toLowerCase().includes(x)) {
            createNewImage(hlinks[i], names[i])
        }
    }
}

function createNewImage(hlink, name) {
    var img = IEWIN ? new Image() : document.createElement(hlink);
    img.src = hlink;
    if ( alt != null ) img.alt = name;
    if ( title != null ) img.title = name;
}