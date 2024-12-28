var fields = [
    "Filme",
    "Fotografia"
]

var names = [
    "Spectros - algum nome nenhum rosto",
    "Fazenda da Prefeitura em Guaratiba"
]

var doctypes = [
    "Documentário",
    "Fotografia"
]

var authors = [
    "Ciro Lubliner",
    "Augusto Malta"
]

var dates = [
    "20/12/2024",
    "1/11/1928"
]

var places = [
    "Sorocaba, SP, São Paulo",
    "Fazenda da Prefeitura de Guaratiba, RJ, Rio de Janeiro"
]

var hlinks = [
    "https://live.staticflickr.com/65535/54232250160_c844033733_b.jpg",
    "https://live.staticflickr.com/65535/54232284053_7845082b27_b.jpg",
]


function onSearched() {
    var grid = document.getElementById('grid-container')
    while (grid.firstChild) {
        grid.removeChild(grid.lastChild);
    }

    var searchBox = document.getElementById("searchbox")
    var toSearch = searchBox.value;
    searchBox.value = ""
    
    
    for (let i=0; i<fields.length;i++) {
        console.log(names[i]);
        if (fields[i].toLowerCase().includes(toSearch) || names[i].toLowerCase().includes(toSearch) || 
            doctypes[i].toLowerCase().includes(toSearch) || authors[i].toLowerCase().includes(toSearch) || 
            dates[i].toLowerCase().includes(toSearch) || places[i].toLowerCase().includes(toSearch)) {
            console.log("Create new image")
            createNewImage(hlinks[i], names[i], grid)
        }
    }
 }

function createNewImage(hlink, name, grid) {
    console.log(hlink);
    console.log(name);
    let img = document.createElement('img');
    img.src = hlink;
    img.alt = name;
    img.title = name;
    grid.appendChild(img);
}