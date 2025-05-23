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
        
var data = []

const sheetId = '1gENPiJwJxPRm4GC1XcMnbSeXhuZkgxIaZ-TtQSwqKc8';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'metadados';
const ColunaA = "Imagem"
const ColunaB = "Sequência"
const ColunaC = "Código identificador"
const ColunaD = "Categoria"
const ColunaE = "Ano"
const ColunaF = "Década"
const ColunaG = "Bairro/Região"
const ColunaH = "Autoria"
const ColunaI = "Fonte Original"
const ColunaJ = "Tema"
const ColunaK = "Estado de Conservação"
const ColunaL = "Descrição"
const ColunaM = "Resolução"
const ColunaN = "Formato"
const ColunaO = "Palavras-chave"
const ColunaP = "Link"

init()

function init() {
    loadImages();
}

function loadImages() {
    console.log("INIT")
    const query = encodeURIComponent("Select A, C, D, E, F, G, H, I, O, P")
    const url = `${base}&sheet=${sheetName}&tq=${query}`
    
    
    fetch(url)
    .then(res => res.text())
    .then(rep => {
        //Apaga textos adicionais e extrai so o JSON:
        const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
        var colz = []
        //Extrai nome das colunas
    jsonData.table.cols.forEach((heading) => {
      let column = heading.label;
      colz.push(column)
    })
    //Extrai dados das linhas
    jsonData.table.rows.forEach((rowData) => {
        var imagemColA = "";
        var idColC = "";
        var categoriaColD = "";
        var anoColE = "";
        var decadaColF = "";
        var regiaoColG = "";
        var autoriaColH = "";
        var fonteOriginalColI = "";
        var temaColJ = "";
        var estadoColK = "";
        var descColL = "";
        var resolucaoColM = "";
        var formatoColN = "";
        var palavraChaveColO = "";
        var linkColP = "";

        colz.forEach((ele, ind) => {
          if (rowData.c[ind] != null && rowData.c[ind].v != null) {
            if (ele == ColunaA) {
                imagemColA = String(rowData.c[ind].v)
            } else if (ele == ColunaB) {
                console.log("Seq ", rowData.c[ind].v)
            } else if (ele == ColunaC) {
                idColC = String(rowData.c[ind].v)
            } else if (ele == ColunaD) {
                categoriaColD = String(rowData.c[ind].v)
            } else if (ele == ColunaE) {
                anoColE = String(rowData.c[ind].v)
            } else if (ele == ColunaF) {
                decadaColF = String(rowData.c[ind].v)
            } else if (ele == ColunaG) {
                regiaoColG = String(rowData.c[ind].v)
            } else if (ele == ColunaH) {
                autoriaColH = String(rowData.c[ind].v)
            } else if (ele == ColunaI) {
                fonteOriginalColI = String(rowData.c[ind].v)
            } else if (ele == ColunaJ) {
                temaColJ = String(rowData.c[ind].v)
            } else if (ele == ColunaK) {
                estadoColK = String(rowData.c[ind].v)
            } else if (ele == ColunaL) {
                descColL = String(rowData.c[ind].v)
            } else if (ele == ColunaM) {
                resolucaoColM = String(rowData.c[ind].v)
            } else if (ele == ColunaN) {
                formatoColN = String(rowData.c[ind].v)
            } else if (ele == ColunaO) {
                palavraChaveColO = String(rowData.c[ind].v)
            } else if (ele == ColunaP) {
                linkColP = String(rowData.c[ind].v)
            } 
          }    
      })

      if (linkColP != "") {
        console.log("Imagem nova!",anoColE, " ", decadaColF, " ", regiaoColG, " ", autoriaColH, " ", 
                              categoriaColD, " ", descColL, " ", fonteOriginalColI, " ",
                              estadoColK, " ", resolucaoColM, " ", formatoColN, " ", idColC, " ",
                              palavraChaveColO, " ", linkColP)
        var img = new ImgMetadata(anoColE, decadaColF, regiaoColG, autoriaColH, 
                              categoriaColD, descColL, fonteOriginalColI,
                              estadoColK, resolucaoColM, formatoColN, idColC,
                              palavraChaveColO, linkColP)
        linkColP = ""
        data.push(img)
      }
      })
    var grid = document.getElementById('grid-container');
    clear(grid);
    console.log("Data array length ", data.length)
    for (let i=0;i<data.length;i++) {
        createNewImage(data[i], grid);
    }
    })
}


function clear(grid) {
    while (grid.firstChild) {
        grid.removeChild(grid.lastChild);
    }
}

function hasKeywords(attr, toSearch){
    var keywords = attr.split(";");
    for (let j=0; j<keywords.length; j++) {
        console.log(keywords[j])
        if(keywords[j].includes(toSearch)) {
            return true;
        }
    }
    return false;
}

function onSearched() {
    var grid = document.getElementById('grid-container');
    clear(grid);

    var searchBox = document.getElementById("searchbox");
    var toSearch = searchBox.value.replace(/^\s+|\s+$/gm,'');
    searchBox.value = "";
    
    
    for (let i=0; i<data.length;i++) {
        let region = data[i].region;
        console.log(region)
        let hasRegion = region != null;
        let foundRegion = hasRegion ? region.toLowerCase().includes(toSearch) : false;
        let author = data[i].author;
        console.log(author)
        let hasAuthor = author != null;
        let foundAuthor = hasAuthor? author.toLowerCase().includes(toSearch) : false;
        let year = data[i].year;
        console.log(year)
        let hasYear = year != null;
        let foundYear = hasYear ? String(year).toLowerCase().includes(toSearch) : false;
        let decade = data[i].decade;
        let hasDecade = decade != null;
        let foundDecade = hasDecade ? decade.toLowerCase().includes(toSearch) : false;
        let category = data[i].category;
        let hasCategory = category != null;
        let foundCategory = hasCategory ? category.toLowerCase().includes(toSearch) : false;
        let desc = data[i].description;
        let hasDesc = desc != null;
        let foundDesc = hasDesc ? desc.toLowerCase().includes(toSearch) : false;
        let source = data[i].source;
        let hasSource = source != null;
        let foundSource = hasSource ? source.toLowerCase().includes(toSearch) : false;
        let preserv = data[i].preservation;
        let hasPreserv = preserv != null;
        let foundPreserv = hasPreserv? preserv.toLowerCase().includes(toSearch) : false;
        let res = data[i].resolution
        let hasRes = res != null;
        let foundRes = hasRes? res.toLowerCase().includes(toSearch) : false;
        let format = data[i].format;
        let hasFormat = format != null;
        let foundFormat = hasFormat? format.toLowerCase().includes(toSearch) : false;
        let id = data[i].id
        let hasID = id != null;
        let foundID = hasID ? id.toLowerCase().includes(toSearch) : false;


        if (foundYear ||
            foundDecade || 
            foundRegion || 
            foundAuthor || 
            foundCategory ||
            foundDesc ||
            foundSource ||
            foundPreserv ||
            foundRes ||
            foundFormat || 
            foundID ||
            hasKeywords(data[i].keywords.toLowerCase(), toSearch)) {
            createNewImage(data[i], grid);
        }
    }
 }

function createNewImage(imgMetaData, grid) {
    let div = document.createElement('div');
    div.className = "card";

    let img = document.createElement('img');
    img.className = "thumbnail";
    img.src = imgMetaData.hlink;
    img.alt = imgMetaData.keywords;
    img.title = imgMetaData.description;
    img.onclick = function() {
        showFull(imgMetaData.hlink)
    }
    div.appendChild(img);
    
    if (imgMetaData.description != "") {
        let descAttr = document.createElement("p");
        descAttr.className = "attribute";
        descAttr.innerText = "Descrição";
        div.appendChild(descAttr);
        let desc = document.createElement("p");
        desc.className = "description";
        desc.innerText = imgMetaData.description;
        div.appendChild(desc);
    }

    if (imgMetaData.year != "") {
        let yearAttr = document.createElement("p");
        yearAttr.className = "attribute";
        yearAttr.innerText = "Ano";
        div.appendChild(yearAttr);
        let year = document.createElement("p");
        year.className = "description";
        year.innerText = imgMetaData.year;
        div.appendChild(year);
    }

    if (imgMetaData.author != "") {
        let authorAttr = document.createElement("p");
        authorAttr.className = "attribute";
        authorAttr.innerText = "Autoria";
        div.appendChild(authorAttr);
        let author = document.createElement("p");
        author.className = "description";
        author.innerText = imgMetaData.author;
        div.appendChild(author);
    }

    if (imgMetaData.category != "") {
        let categoryAttr = document.createElement("p");
        categoryAttr.className = "attribute";
        categoryAttr.innerText = "Categoria";
        div.appendChild(categoryAttr);
        let category = document.createElement("p");
        category.className = "description";
        category.innerText = imgMetaData.category;
        div.appendChild(category);
    }

    if (imgMetaData.region != "" ) {
        let regionAttr = document.createElement("p");
        regionAttr.className = "attribute";
        regionAttr.innerText = "Bairro/Região";
        div.appendChild(regionAttr);
        let region = document.createElement("p");
        region.className = "description";
        region.innerText = imgMetaData.region;
        div.appendChild(region);
    }

    if (imgMetaData.source != "") {
        let sourceAttr = document.createElement("p");
        sourceAttr.className = "attribute";
        sourceAttr.innerText = "Fonte Original";
        div.appendChild(sourceAttr);
        let source = document.createElement("p");
        source.className = "description";
        source.innerText = imgMetaData.source;
        div.appendChild(source);
    }

    if (imgMetaData.keywords != "") {
        let keywordsAttr = document.createElement("p");
        keywordsAttr.className = "attribute";
        keywordsAttr.innerText = "Palavras-chave";
        div.appendChild(keywordsAttr);
        let keywords = document.createElement("p");
        keywords.className = "description";
        keywords.innerText = imgMetaData.keywords;
        div.appendChild(keywords);
    }

    grid.appendChild(div);
}

function showFull(link) {
    on(link)
}

function on(link) {
    let overlay = document.getElementById("overlay");
    overlay.style.display = "block";
    document.getElementsByClassName("overlayImg")[0].src = link;
}

function off() {
  document.getElementById("overlay").style.display = "none";
}