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

class ImgMetadata {
    constructor(field, name, doctype, author, date, place, hlink) {
        this.field = field
        this.name = name
        this.doctype = doctype
        this.author = author
        this.date = date
        this.place = place
        this.hlink = hlink
    }

}