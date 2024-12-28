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

function createNewImage(hlink, name) {
    console.log(hlink);
    console.log(name);
    var img = IEWIN ? new Image() : document.createElement(hlink);
    img.src = hlink;
    if ( alt != null ) img.alt = name;
    if ( title != null ) img.title = name;
}