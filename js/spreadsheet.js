class ImgMetadata {
    constructor(year, decade, region, author, category,
         description, source, preservation, resolution,
         format, id, keywords, hlink) {
        this.year = year;
        this.decade = decade;
        this.region = region;
        this.author = author;
        this.category = category;
        this.description = description;
        this.source = source;
        this.preservation = preservation;
        this.resolution = resolution;
        this.format = format;
        this.id = id;
        this.keywords = keywords;
        this.hlink = hlink;
    }

}



// var fields = [
//     "Filme",
//     "Fotografia"
// ]

// var names = [
//     "Spectros - algum nome nenhum rosto",
//     "Fazenda da Prefeitura em Guaratiba"
// ]

// var doctypes = [
//     "Documentário",
//     "Fotografia"
// ]

// var authors = [
//     "Ciro Lubliner",
//     "Augusto Malta"
// ]

// var dates = [
//     "20/12/2024",
//     "1/11/1928"
// ]

// var places = [
//     "Sorocaba, SP, São Paulo",
//     "Fazenda da Prefeitura de Guaratiba, RJ, Rio de Janeiro"
// ]

// var hlinks = [
//     "https://live.staticflickr.com/65535/54232250160_c844033733_b.jpg",
//     "https://live.staticflickr.com/65535/54232284053_7845082b27_b.jpg",
// ]


var img1 = new ImgMetadata("2024", "2020", "Sorocaba, SP, São Paulo", "Ciro Lubliner", "Filme", 
    "Spectros - algum nome nenhum rosto é um curta-metragem sobre a história das rádios livres foi exibido gratuitamente na Sala Ponto MIS, no Centro Cultural Brasital, em São Roque (SP)",
    "Video", "Arquivo digital", "1920x1080", "jpg", "sp001", 
    "radio;livre;", "https://live.staticflickr.com/65535/54232250160_c844033733_b.jpg")
var img2 = new ImgMetadata("1928", "1920", "Fazenda da Prefeitura de Guaratiba, RJ, Rio de Janeiro",
"Augusto Malta", "Fotografia", "Faz. da Pres. - Guaratiba", "Coleção Instituto Moreira Salles",
"Foto física antiga", "Restaurada","800x600", "rj002", "dominio;publico;guaratiba;rj", 
"https://live.staticflickr.com/65535/54232284053_7845082b27_b.jpg")

var data = [img1, img2]

init()

function clear(grid) {
    while (grid.firstChild) {
        grid.removeChild(grid.lastChild);
    }
}

function init() {
    var grid = document.getElementById('grid-container')
    clear(grid)
    for (let i=0;i<data.length;i++) {
        createNewImage(data[i], grid)
    }
}

function onSearched() {
    var grid = document.getElementById('grid-container')
    clear(grid)

    var searchBox = document.getElementById("searchbox")
    var toSearch = searchBox.value;
    searchBox.value = ""
    
    
    for (let i=0; i<data.length;i++) {
        if (data[i].year.toLowerCase().includes(toSearch) ||
            data[i].decade.toLowerCase().includes(toSearch) || 
            data[i].region.toLowerCase().includes(toSearch) || 
            data[i].author.toLowerCase().includes(toSearch) || 
            data[i].category.toLowerCase().includes(toSearch) ||
            data[i].description.toLowerCase().includes(toSearch) ||
            data[i].source.toLowerCase().includes(toSearch) ||
            data[i].preservation.toLowerCase().includes(toSearch) ||
            data[i].resolution.toLowerCase().includes(toSearch) ||
            data[i].format.toLowerCase().includes(toSearch) || 
            data[i].id.toLowerCase().includes(toSearch || 
            data[i].keywords.toLowerCase().includes(toSearch))) {
            createNewImage(data[i], grid);
        }
    }
 }

function createNewImage(imgMetaData, grid) {
    let img = document.createElement('img');
    img.className = "thumbnail";
    img.src = imgMetaData.hlink;
    img.alt = imgMetaData.keywords;
    img.title = imgMetaData.description;

    let descAttr = document.createElement("p");
    descAttr.className = "attribute";
    descAttr.innerText = "Descrição";
    let desc = document.createElement("p");
    desc.className = "description";
    desc.innerText = imgMetaData.description;

    let yearAttr = document.createElement("p");
    yearAttr.className = "attribute";
    yearAttr.innerText = "Ano";
    let year = document.createElement("p");
    year.className = "description";
    year.innerText = imgMetaData.year;

    let authorAttr = document.createElement("p");
    authorAttr.className = "attribute";
    authorAttr.innerText = "Autoria";
    let author = document.createElement("p");
    author.className = "description";
    author.innerText = imgMetaData.author;

    let div = document.createElement('div');
    div.className = "card";
    div.appendChild(img);
    div.appendChild(descAttr);
    div.appendChild(desc);
    div.appendChild(yearAttr);
    div.appendChild(year);
    div.appendChild(authorAttr);
    div.appendChild(author);

    grid.appendChild(div);
}