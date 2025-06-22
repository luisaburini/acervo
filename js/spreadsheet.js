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


var data = [];
var allKeywords = [];
var allYears = [];
var allDecades = [];
var allCategories = [];

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
                allCategories.push(categoriaColD);
                allCategories = allCategories.filter((e, i, self) => i === self.indexOf(e))
            } else if (ele == ColunaE) {
                anoColE = String(rowData.c[ind].v);
                allYears.push(anoColE);
                allYears = allYears.filter((e, i, self) => i === self.indexOf(e));
            } else if (ele == ColunaF) {
                decadaColF = String(rowData.c[ind].v);
                allDecades.push(decadaColF);
                allDecades = allDecades.filter((e, i, self) => i === self.indexOf(e));
            } else if (ele == ColunaG) {
                regiaoColG = String(rowData.c[ind].v);
            } else if (ele == ColunaH) {
                autoriaColH = String(rowData.c[ind].v);
            } else if (ele == ColunaI) {
                fonteOriginalColI = String(rowData.c[ind].v);
            } else if (ele == ColunaJ) {
                temaColJ = String(rowData.c[ind].v);
            } else if (ele == ColunaK) {
                estadoColK = String(rowData.c[ind].v);
            } else if (ele == ColunaL) {
                descColL = String(rowData.c[ind].v);
            } else if (ele == ColunaM) {
                resolucaoColM = String(rowData.c[ind].v);
            } else if (ele == ColunaN) {
                formatoColN = String(rowData.c[ind].v);
            } else if (ele == ColunaO) {
                palavraChaveColO = String(rowData.c[ind].v);
                var kwds = String(rowData.c[ind].v).split(separator);
                for (let k = 0; k < kwds; k++){
                    allKeywords.push(k);
                }
                allKeywords = allKeywords.filter((e, i, self) => i === self.indexOf(e));
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
    
    populateSidebar(allKeywords);
      var grid = document.getElementById('grid-container');
    clear(grid);
    console.log("Data array length ", data.length)
    for (let i=0;i<data.length;i++) {
        createNewImage(data[i], grid);
    }
    })
}

function removeAccents(word) {
    console.log("word lower case ", word.toLowerCase());
    console.log("word lower case no accent ", word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
    return word.toLowerCase();
};

function populateSidebar(allKeywords) {
    let sidebar = document.getElementById("sidebar")

    // Adiciona categoria
    let categoryHeader = document.createElement('div');
    categoryHeader.className = "attribute";
    categoryHeader.innerText = "Categorias"
    let categoryDiv = document.createElement('div');
    categoryDiv.className = "dropdown-menu"
    categoryHeader.appendChild(categoryDiv)
    for (let i=0; i<allCategories.length; i++){
        var label = document.createElement("label")
        label.innerText = allCategories[i];
        label.className = "container"
        var radioInput = document.createElement('input');
        radioInput.type = "radio";
        radioInput.value = allCategories[i];
        radioInput.name = "categories";
        radioInput.addEventListener('change', function (e) {
            if (this.checked) {
                var searchBox = document.getElementById("searchbox");
                var noAccent = removeAccents(allCategories[i]);
                searchBox.innerHTML = noAccent;
                searchBox.value = noAccent;
                onSearched();
            }
        });
        label.appendChild(radioInput)
        var span = document.createElement("span");
        span.className = "checkmark"
        label.appendChild(span)
        categoryDiv.appendChild(label)
    }
    sidebar.appendChild(categoryHeader);

    // Adiciona ano
    let yearHeader = document.createElement('div');
    yearHeader.className = "attribute";
    yearHeader.innerText = "Ano"
    let yearDiv = document.createElement('div');
    yearDiv.className = "dropdown-menu";
    yearHeader.appendChild(yearDiv);
    for (let i=0; i<allYears.length; i++){
        var label = document.createElement("label")
        label.innerText = allYears[i];
        label.className = "container"
        var radioInput = document.createElement('input');
        radioInput.type = "radio";
        radioInput.value = allYears[i];
        radioInput.name = "years";
        radioInput.addEventListener('change', function (e) {
            var searchBox = document.getElementById("searchbox");
            var noAccent = removeAccents(allYears[i]);
            searchBox.innerHTML = noAccent;
            searchBox.value = noAccent;
            onSearched()
        });
        label.appendChild(radioInput)
        var span = document.createElement("span");
        span.className = "checkmark"
        label.appendChild(span)
        yearDiv.appendChild(label)
    }
    sidebar.appendChild(yearHeader);

    // Adiciona decada
    let decadeHeader = document.createElement('div');
    decadeHeader.className = "attribute";
    decadeHeader.innerText = "Década"
    let decadeDiv = document.createElement('div');
    decadeDiv.className = "dropdown-menu";
    decadeHeader.appendChild(decadeDiv);
    for (let i=0; i<allDecades.length; i++){
        var label = document.createElement("label")
        label.innerText = allDecades[i];
        label.className = "container"
        var radioInput = document.createElement('input');
        radioInput.type = "radio";
        radioInput.value = allDecades[i];
        radioInput.name = "decades";
        radioInput.addEventListener('change', function (e) {
            var searchBox = document.getElementById("searchbox");
            var noAccent = removeAccents(allDecades[i]);
            searchBox.innerHTML = noAccent;
            searchBox.value = noAccent;
            onSearched()
        });
        label.appendChild(radioInput)
        var span = document.createElement("span");
        span.className = "checkmark"
        label.appendChild(span)
        decadeDiv.appendChild(label)
    }
    sidebar.appendChild(decadeHeader);

    // Adiciona palavras-chave
    let keywordsHeader = document.createElement('div');
    keywordsHeader.className = "attribute";
    keywordsHeader.innerText = "Palavras-chave"
    let keywordsDiv = document.createElement('div');
    keywordsDiv.className = "dropdown-menu";
    keywordsHeader.appendChild(keywordsDiv);
    for (let i=0; i<allKeywords.length; i++){
        console.log("Keywords ", allKeywords[i])
        var label = document.createElement("label")
        label.innerText = allKeywords[i];
        label.className = "container"
        var radioInput = document.createElement('input');
        radioInput.type = "radio";
        radioInput.value = allKeywords[i];
        radioInput.name = "keywords";
        radioInput.addEventListener('change', function (e) {
            var searchBox = document.getElementById("searchbox");
            searchBox.innerHTML = allKeywords[i];
            searchBox.value = allKeywords[i];
            onSearched()
        });
        label.appendChild(radioInput)
        var span = document.createElement("span");
        span.className = "checkmark"
        label.appendChild(span)
        keywordsDiv.appendChild(label)
    }
    sidebar.appendChild(keywordsHeader);
}

function clear(grid) {
    while (grid.firstChild) {
        grid.removeChild(grid.lastChild);
    }
}

const separator = ";"

function hasKeywords(attr, toSearch){
    var keywords = attr.split(separator);
    for (let j=0; j<keywords.length; j++) {
        console.log("Keywords:", keywords[j])
        if(keywords[j].normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(toSearch.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
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
        console.log("region ", region)
        let hasRegion = region != null;
        let foundRegion = hasRegion ? region.toLowerCase().includes(toSearch) : false;
        let author = data[i].author;
        console.log("author ", author)
        let hasAuthor = author != null;
        let foundAuthor = hasAuthor? author.toLowerCase().includes(toSearch) : false;
        let year = data[i].year;
        console.log("year ", year)
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