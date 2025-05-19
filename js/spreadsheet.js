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
                imagemColA = rowData.c[ind].v
            } else if (ele == ColunaB) {
                console.log("Seq ", rowData.c[ind].v)
            } else if (ele == ColunaC) {
                idColC = rowData.c[ind].v
            } else if (ele == ColunaD) {
                categoriaColD = rowData.c[ind].v
            } else if (ele == ColunaE) {
                anoColE = rowData.c[ind].v
            } else if (ele == ColunaF) {
                decadaColF = rowData.c[ind].v
            } else if (ele == ColunaG) {
                regiaoColG = rowData.c[ind].v
            } else if (ele == ColunaH) {
                autoriaColH = rowData.c[ind].v
            } else if (ele == ColunaI) {
                fonteOriginalColI = rowData.c[ind].v
            } else if (ele == ColunaJ) {
                temaColJ = rowData.c[ind].v
            } else if (ele == ColunaK) {
                estadoColK = rowData.c[ind].v
            } else if (ele == ColunaL) {
                descColL = rowData.c[ind].v
            } else if (ele == ColunaM) {
                resolucaoColM = rowData.c[ind].v
            } else if (ele == ColunaN) {
                formatoColN = rowData.c[ind].v
            } else if (ele == ColunaO) {
                palavraChaveColO = rowData.c[ind].v
            } else if (ele == ColunaP) {
                linkColP = rowData.c[ind].v
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
            data[i].id.toLowerCase().includes(toSearch) ||
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
    overlay.getElementById("overlayImg").src = link;
}

function off() {
  document.getElementById("overlay").style.display = "none";
}