class ImgMetadata {
    constructor(year, decade, region, author, category,
         description, source, preservation, resolution,
         format, id, keywords, hlink, hlinksmall, index) {
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
        this.hlinksmall = hlinksmall;
        this.index = index;
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
const ColunaQ = "Link pequeno"


let data = [];
let searchedImages = [];
let allKeywords = [];
let allYears = [];
let allDecades = [];
let allCategories = [];
let zoomLevel = 1;
let minZoomLevel = 0.5;
let maxZoomLevel = 10;
let zoomIncrement = 0.2;
let newPosX = 0,
    newPosY = 0,
    startPosX = 0,
    startPosY = 0;
let current = 0;

init()

function init() {
    loadImages();
    document.body.addEventListener('keydown', function (event) {
        let zoomImage = document.getElementsByClassName("overlay-img")[0];
        const imgVisibility = zoomImage.style.visibility;
        if(imgVisibility.localeCompare("visible") == 0) {
            const key = event.key;
            switch (key) {
                case "ArrowLeft":
                    left();
                    break;
                case "ArrowRight":
                    right();
                    break;
            }
        } 
        
    });
}

function mouseMove(e) {
    console.log("mouse move")
    let zoomImage = document.getElementsByClassName("overlay-img")[0];
    // calculate the new position
    newPosX = startPosX - e.clientX;
    newPosY = startPosY - e.clientY;
    // with each move we also want to update the start X and Y
    startPosX = e.clientX;
    startPosY = e.clientY;
    // set the element's new position:
    zoomImage.style.left = (zoomImage.offsetLeft - newPosX) + "px";
    zoomImage.style.top = (zoomImage.offsetTop - newPosY) + "px";
}

function loadImages() {
    var i = 0;
    console.log("INIT")
    const query = encodeURIComponent("Select A, C, D, E, F, G, H, I, O, P, Q")
    const url = `${base}&sheet=${sheetName}&tq=${query}`
    
    fetch(url)
    .then(res => res.text())
    .then(rep => {
        //Apaga textos adicionais e extrai so o JSON:
        const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
        let colz = []
        //Extrai nome das colunas
        jsonData.table.cols.forEach((heading) => {
        let column = heading.label;
        colz.push(column)
        })
    //Extrai dados das linhas
    jsonData.table.rows.forEach((rowData) => {
        let imagemColA = "";
        let idColC = "";
        let categoriaColD = "";
        let anoColE = "";
        let decadaColF = "";
        let regiaoColG = "";
        let autoriaColH = "";
        let fonteOriginalColI = "";
        let temaColJ = "";
        let estadoColK = "";
        let descColL = "";
        let resolucaoColM = "";
        let formatoColN = "";
        let palavraChaveColO = "";
        let linkBigColP = "";
        let linkSmallColQ = "";

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
                anoColE = String(rowData.c[ind].v);
            } else if (ele == ColunaF) {
                decadaColF = String(rowData.c[ind].v);
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
            } else if (ele == ColunaP) {
                linkBigColP = String(rowData.c[ind].v)
            } else if (ele == ColunaQ) {
                linkSmallColQ = String(rowData.c[ind].v)
            }
          }    
      })

      if (linkBigColP != "" && linkSmallColQ != "") {
        let img = new ImgMetadata(anoColE, decadaColF, regiaoColG, autoriaColH, 
                              categoriaColD, descColL, fonteOriginalColI,
                              estadoColK, resolucaoColM, formatoColN, idColC,
                              palavraChaveColO, linkBigColP, linkSmallColQ, i);
        
        allDecades.push(decadaColF);
        allDecades = allDecades.filter((e, i, self) => i === self.indexOf(e));
        allYears.push(anoColE);
        allYears = allYears.filter((e, i, self) => i === self.indexOf(e));
        allCategories.push(categoriaColD);
        allCategories = allCategories.filter((e, i, self) => i === self.indexOf(e));
        let kwds = palavraChaveColO.split(separator);
        for (let k = 0; k < kwds.length; k++){
            allKeywords.push(kwds[k]);
        }
        allKeywords = allKeywords.filter((e, i, self) => i === self.indexOf(e));
        imagemColA = "";
        idColC = "";
        categoriaColD = "";
        anoColE = "";
        decadaColF = "";
        regiaoColG = "";
        autoriaColH = "";
        fonteOriginalColI = "";
        temaColJ = "";
        estadoColK = "";
        descColL = "";
        resolucaoColM = "";
        formatoColN = "";
        palavraChaveColO = "";
        linkBigColP = "";
        linkSmallColQ = "";
        i = i+1;
        data.push(img)
      }
    })
    populateNavegue();
    changeVisibilitySearch("collapse");
    })
}

function removeAccents(word) {
    return word.toLowerCase();
}

function getFirstImageFromDecade(decade) {
    for (let i=0; i<data.length; i++) {
        let dataDecade = data[i].decade;
        let hasDecade = decade != null;
        let foundDecade = hasDecade ? dataDecade.toLowerCase().includes(decade) : false;
        if (foundDecade) {
            return "url('" + data[i].hlinksmall + "')";
        }
    }
    return "";
}

function populateNavegue() {
    let navegueGrid = document.getElementById("navegue-grid");
    let gridTemplateColumns = "1fr "
    navegueGrid.style.gridTemplateColumns = gridTemplateColumns.repeat(1+allDecades.length/2);
    allDecades.sort();

    for (let i=0; i<allDecades.length; i++){
        if (getFirstImageFromDecade(allDecades[i]) != "") {
            let decadeButton = document.createElement('div');
            decadeButton.className = "navegue-item";
            decadeButton.innerText = allDecades[i];
            decadeButton.onmouseover = function() {
                decadeButton.innerText = "";
                decadeButton.style.backgroundImage = getFirstImageFromDecade(allDecades[i]);
                console.log(getFirstImageFromDecade(allDecades[i]));
            };
            decadeButton.onmouseout = function() {
                decadeButton.style.color = "white";
                decadeButton.style.backgroundImage = "";
                decadeButton.innerText = allDecades[i];
                console.log(allDecades[i])
            };
            decadeButton.onclick = function() {
                changeVisibilityOfAll("collapse");
                changeVisibilitySearch("visible");
                let searchBox = document.getElementById("search-box");
                searchBox.value = allDecades[i];
                onSearched();
                showAcervo();
            };
            navegueGrid.appendChild(decadeButton);
        }
    } 
    let spacersAmount = allDecades.length % 2;
    for (let i=0; i<spacersAmount; i++) {
        let spacer = document.createElement("spacer");
        navegueGrid.appendChild(spacer);
    }
    let navegueButton = document.createElement("button");
    navegueButton.className = "explore-button";
    navegueButton.innerHTML = "EXPLORAR ACERVO COMPLETO 	&#129130;";
    navegueButton.style.gridColumn = "1 / " + Math.ceil(1+allDecades.length/2).toString();
    navegueButton.onclick = function() {
        showAcervo();
    }
    navegueGrid.appendChild(navegueButton);
}

function showAcervo() {
    searchedImages = data;
    changeVisibilityOfAll("collapse");
    changeVisibilitySearch("visible");
    populateSidebar(allKeywords);
    populateGrid();
}

function showInicio() {
    changeVisibilityOfAll("visible");
    changeVisibilitySearch("collapse");
}

function showContato(){
    window.scrollTo(0, document.body.scrollHeight);
}

function changeVisibilityOfAll(visibility) {
    elementsToHide = ["home-grid", "home-img", "header", "subheader", "subsubheader",
        "navegue", "navegue-header", "navegue-grid", 
        "iniciativa", "iniciativa-grid", 
        "bottom"];
    for (let i=0; i<elementsToHide.length; i++) {
        let elem = document.getElementById(elementsToHide[i]);
        elem.style.visibility = visibility;
        if (visibility == "collapse") {
            elem.style.maxHeight = "0";
            if (elementsToHide[i] == "home-img") {
                elem.src = ""
                let home = document.getElementById("home-container");
                home.style.backgroundColor = "#000000";
                home.style.height = "10vh";

            }
        } else {
            elem.style.maxHeight = "none";
            if (elementsToHide[i] == "home-img") {
                elem.src = "https://live.staticflickr.com/65535/54526439361_13838f3284_k.jpg"
                let home = document.getElementById("home-container");
                home.style.backgroundColor = "#26361c";
                home.style.height = "auto";
            }
        }
    }
    elementsByClass = ["upperbar", "upperbar-item",
        "navegue-item", "iniciativa-container", "explore-button",
        "iniciativa-header", "iniciativa-text", "igrejinha",
        "bottom-grid", "bottom-header", "bottom-subheader", "bottom-subsubheader", 
        "contato", "contato-item"];
    for (let i=0; i<elementsToHide.length; i++) {
        elems = document.getElementsByClassName(elementsToHide[i]);
        for (let j=0; j<elems.length; j++) {
            elems[j].style.visibility = visibility;
            if (visibility == "collapse") {
                elems[j].style.maxHeight = "0";
            } else {
                elems[j].style.maxHeight = "none";
            }
        }
    }
}

function changeVisibilitySearch(visibility) {
    elementsToHide = ["search", "search-box", "search-button", 
        "outer-container", "sidebar", "pagination",
        "img-container"];
    for (let i=0; i<elementsToHide.length; i++) {
        elem = document.getElementById(elementsToHide[i]);
        elem.style.visibility = visibility;
        if (visibility == "collapse") {
            elem.style.maxHeight = "0";
        } else {
            elem.style.maxHeight = "none";
        }
    }
}

function populateGrid() {
    let grid = document.getElementById('img-container');
    clear(grid);
    let pagination = document.getElementById('pagination');
    if (searchedImages.length > 0) {
        pagination.innerText = "1 de " + searchedImages.length;
    } else {
        pagination.innerText = "nenhum resultado encontrado";
    }
    for (let i=0;i<searchedImages.length;i++) {
        createNewImage(searchedImages[i], grid);
    }
}

function populateSidebar(allKeywords) {
    let sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = "";

    // Adiciona categoria
    let categoryHeader = document.createElement('div');
    categoryHeader.className = "attribute";
    categoryHeader.innerText = "Categorias"
    let categoryDiv = document.createElement('div');
    categoryDiv.className = "dropdown-menu"
    categoryHeader.appendChild(categoryDiv)
    allCategories.sort();
    for (let i=0; i<allCategories.length; i++){
        let label = document.createElement("label")
        label.innerText = allCategories[i];
        label.className = "container"
        let radioInput = document.createElement('input');
        radioInput.type = "radio";
        radioInput.value = allCategories[i];
        radioInput.name = "categories";
        radioInput.addEventListener('change', function (e) {
            if (this.checked) {
                let searchBox = document.getElementById("search-box");
                let noAccent = removeAccents(allCategories[i]);
                searchBox.innerHTML = noAccent;
                searchBox.value = noAccent;
                onSearched();
            }
        });
        label.appendChild(radioInput)
        let span = document.createElement("span");
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
    allYears.sort();
    for (let i=0; i<allYears.length; i++){
        let label = document.createElement("label")
        label.innerText = allYears[i];
        label.className = "container"
        let radioInput = document.createElement('input');
        radioInput.type = "radio";
        radioInput.value = allYears[i];
        radioInput.name = "years";
        radioInput.addEventListener('change', function (e) {
            let searchBox = document.getElementById("search-box");
            let noAccent = removeAccents(allYears[i]);
            searchBox.innerHTML = noAccent;
            searchBox.value = noAccent;
            onSearched()
        });
        label.appendChild(radioInput)
        let span = document.createElement("span");
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
    allDecades.sort();
    for (let i=0; i<allDecades.length; i++){
        let label = document.createElement("label")
        label.innerText = allDecades[i];
        label.className = "container"
        let radioInput = document.createElement('input');
        radioInput.type = "radio";
        radioInput.value = allDecades[i];
        radioInput.name = "decades";
        radioInput.addEventListener('change', function (e) {
            let searchBox = document.getElementById("search-box");
            let noAccent = removeAccents(allDecades[i]);
            searchBox.innerHTML = noAccent;
            searchBox.value = noAccent;
            onSearched()
        });
        label.appendChild(radioInput)
        let span = document.createElement("span");
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
    allKeywords.sort();
    for (let i=0; i<allKeywords.length; i++){
        let label = document.createElement("label")
        label.innerText = allKeywords[i];
        label.className = "container"
        let radioInput = document.createElement('input');
        radioInput.type = "radio";
        radioInput.value = allKeywords[i];
        radioInput.name = "keywords";
        radioInput.addEventListener('change', function (e) {
            let searchBox = document.getElementById("search-box");
            searchBox.innerHTML = allKeywords[i];
            searchBox.value = allKeywords[i];
            onSearched()
        });
        label.appendChild(radioInput)
        let span = document.createElement("span");
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
    let keywords = attr.split(separator);
    for (let j=0; j<keywords.length; j++) {
        if(keywords[j].normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(toSearch.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
            return true;
        }
    }
    return false;
}

function onSearched() {
    let grid = document.getElementById('img-container');
    grid.style.display = "grid";
    clear(grid);
    searchedImages = [];
    
    let searchBox = document.getElementById("search-box");
    let toSearch = searchBox.value.replace(/^\s+|\s+$/gm,'');
    searchBox.value = "";
    
    for (let i=0; i<data.length;i++) {
        let region = data[i].region;
        let hasRegion = region != null;
        let foundRegion = hasRegion ? region.toLowerCase().includes(toSearch) : false;
        let author = data[i].author;
        let hasAuthor = author != null;
        let foundAuthor = hasAuthor? author.toLowerCase().includes(toSearch) : false;
        let year = data[i].year;
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
                searchedImages.push(data[i]);
                createNewImage(data[i], grid);
            }
        }
        let pagination = document.getElementById('pagination');
        if (searchedImages.length > 0) {
            pagination.innerText = "1 de " + searchedImages.length;
        } else {
            pagination.innerText = "nenhum resultado encontrado";
        } 
 }

function createNewImage(imgMetaData, grid) {
    let div = document.createElement('div');
    div.className = "card";
    let img = document.createElement('img');
    img.className = "thumbnail";
    img.src = imgMetaData.hlinksmall;
    img.alt = imgMetaData.keywords;
    img.title = imgMetaData.description;
    img.onclick = function() {
        showFull(imgMetaData.hlinksmall);
        current = imgMetaData.index;
    }
    div.appendChild(img);
    if (imgMetaData.description != "") {
        let descAttr = document.createElement("p");
        descAttr.className = "cardattribute";
        descAttr.innerHTML = "<b>Descrição:<b> " + imgMetaData.description;
        div.appendChild(descAttr);
    }
    if (imgMetaData.year != "") {
        let yearAttr = document.createElement("p");
        yearAttr.className = "cardattribute";
        yearAttr.innerHTML = "<b>Ano:<b> " + imgMetaData.year;
        div.appendChild(yearAttr);
    }
    if (imgMetaData.author != "") {
        let authorAttr = document.createElement("p");
        authorAttr.className = "cardattribute";
        authorAttr.innerHTML = "<b>Autoria:<b> " + imgMetaData.author;
        div.appendChild(authorAttr);
    }
    if (imgMetaData.category != "") {
        let categoryAttr = document.createElement("p");
        categoryAttr.className = "cardattribute";
        categoryAttr.innerHTML = "<b>Categoria:<b> " + imgMetaData.category;
        div.appendChild(categoryAttr);
    }
    if (imgMetaData.region != "" ) {
        let regionAttr = document.createElement("p");
        regionAttr.className = "cardattribute";
        regionAttr.innerHTML = "<b>Bairro/Região:<b> " + imgMetaData.region;
        div.appendChild(regionAttr);
    }
    if (imgMetaData.source != "") {
        let sourceAttr = document.createElement("p");
        sourceAttr.className = "cardattribute";
        sourceAttr.innerHTML = "<b>Fonte Original:<b> " + imgMetaData.source;
        div.appendChild(sourceAttr);
    }
    if (imgMetaData.keywords != "") {
        let keywordsAttr = document.createElement("p");
        keywordsAttr.className = "cardattribute";
        keywordsAttr.innerHTML = "<b>Palavras-chave:<b> " + imgMetaData.keywords;
        div.appendChild(keywordsAttr);
    }
    div.style.height = "auto";
    grid.appendChild(div);
}

function showFull(link) {
    zoomLevel = 1;
    newPosX = 0;
    newPosY = 0;
    startPosX = 0;
    startPosY = 0;
    let zoomImage = document.getElementsByClassName("overlay-img")[0];
    zoomImage.src = link;
    zoomImage.style.visibility = "visible";
    let overlay = document.getElementById("overlay");
    overlay.style.visibility = "visible";
    overlay.style.display = "block";
    resetPositionAndSize();
}

function resetPositionAndSize() {
    let zoomImage = document.getElementsByClassName("overlay-img")[0];
    let width = zoomImage.offsetWidth;
    let height = zoomImage.offsetHeight;
    if (width > height) {
        zoomImage.style.width = "50%";
        zoomImage.style.left = "25%";
        zoomImage.style.height = "auto";
        let windowHeight = window.innerHeight;
        let calculatedHeight =(windowHeight-zoomImage.offsetHeight)/2 
        zoomImage.style.top = calculatedHeight.toString() + "px";
    } else {
        zoomImage.style.top = "25%";
        zoomImage.style.height = "50%";
        zoomImage.style.width = "auto";
        let windowWidth = window.innerWidth;
        let calculatedWidth = (windowWidth-zoomImage.offsetWidth)/2
        zoomImage.style.left = calculatedWidth.toString() + "px";
    }
}

function left() {
    if (current-1 < 0) {
        current = searchedImages.length-1
    } else {
        current = Math.abs((current-1)%searchedImages.length);
    }
    let zoomImage = document.getElementsByClassName("overlay-img")[0];
    zoomImage.style.visibility = "collapse";
    zoomImage.src = searchedImages[current].hlink;
    zoomLevel = 1;
    newPosX = 0;
    newPosY = 0;
    startPosX = 0;
    startPosY = 0;
    zoomImage.style.visibility = "visible";
    updateZoomedImage();
    resetPositionAndSize();
}

function right() {
    current = Math.abs((current+1)%(searchedImages.length));
    let zoomImage = document.getElementsByClassName("overlay-img")[0];
    zoomImage.style.visibility = "collapse";
    zoomImage.src = searchedImages[current].hlink;
    zoomLevel = 1;
    newPosX = 0;
    newPosY = 0;
    startPosX = 0;
    startPosY = 0;
    zoomImage.style.visibility = "visible";
    updateZoomedImage();
    resetPositionAndSize();
}

let dontHide = false;

function off() {
  if (dontHide) {
      dontHide = false;
      return;
  }
  document.getElementById("overlay").style.visibility = "collapse";
  let zoomImage = document.getElementsByClassName("overlay-img")[0];
  zoomImage.style.visibility = "collapse";
  zoomImage.src = "";
  zoomLevel = 1;
  newPosX = 0;
  newPosY = 0;
  startPosX = 0;
  startPosY = 0;
}

function goHome() {
    off();
}

function onZoomIn() {
    dontHide = true;
    if (zoomLevel < maxZoomLevel) {
        zoomLevel += zoomIncrement;
        zoomLevel = Math.min(zoomLevel, maxZoomLevel);
        updateZoomedImage();
    }
}

function onZoomOut() {
    dontHide = true;
    if (zoomLevel > minZoomLevel) {
        zoomLevel -= zoomIncrement;
        zoomLevel = Math.max(zoomLevel, minZoomLevel);
        updateZoomedImage();
    }
}

function updateZoomedImage() {
    let zoomImage = document.getElementsByClassName("overlay-img")[0];
    var imageWidth = zoomImage.offsetWidth;
    var imageHeight = zoomImage.offsetHeight;
    var newImageWidth = imageWidth * zoomLevel;
    var newImageHeight = imageHeight * zoomLevel;
    zoomImage.style.transform = 'scale(' + zoomLevel + ')';
    zoomImage.style.width = newImageWidth + 'px';
    zoomImage.style.height = newImageHeight + 'px';

    // when the user clicks down on the element
    zoomImage.addEventListener('mousedown', function(e) {
        e.preventDefault();
        // get the starting position of the cursor
        startPosX = e.clientX;
        startPosY = e.clientY;
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', mouseMove);
        });
    });
}


function inicio() {
    window.scrollTo(0, 0);
}