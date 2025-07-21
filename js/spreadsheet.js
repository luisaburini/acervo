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
let allKeywords = [];
let allYears = [];
let allDecades = [];
let allCategories = [];
let zoomLevel = 1;
let minZoomLevel = 1;
let maxZoomLevel = 2;
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
        let zoomImage = document.getElementsByClassName("overlayImg")[0];
        const imgVisibility = zoomImage.style.visibility;
        if(imgVisibility.localeCompare("visible") == 0) {
            const key = event.key;
            console.log("KEY DOWN", key);
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
    let zoomImage = document.getElementsByClassName("overlayImg")[0];
    // calculate the new position
    newPosX = startPosX - e.clientX;
    newPosY = startPosY - e.clientY;
    // with each move we also want to update the start X and Y
    startPosX = e.clientX;
    startPosY = e.clientY;
    // Restrict images from leaving containers
    if (Math.abs(zoomImage.offsetLeft - newPosX) >= Math.abs((parseInt(zoomImage.style.width, 10) - window.innerWidth) / 2) ||
        Math.abs(zoomImage.offsetTop - newPosY) >= Math.abs((parseInt(zoomImage.style.height, 10) - window.innerHeight) / 2)
    ) {
        return;
    }
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
                let kwds = String(rowData.c[ind].v).split(separator);
                for (let k = 0; k < kwds.length; k++){
                    allKeywords.push(kwds[k]);
                }
                allKeywords = allKeywords.filter((e, i, self) => i === self.indexOf(e));
            } else if (ele == ColunaP) {
                linkBigColP = String(rowData.c[ind].v)
            } else if (ele == ColunaQ) {
                linkSmallColQ = String(rowData.c[ind].v)
            }
          }    
      })

      if (linkBigColP != "" && linkSmallColQ != "") {
        console.log("Imagem nova!",anoColE, " ", decadaColF, " ", regiaoColG, " ", autoriaColH, " ", 
                              categoriaColD, " ", descColL, " ", fonteOriginalColI, " ",
                              estadoColK, " ", resolucaoColM, " ", formatoColN, " ", idColC, " ",
                              palavraChaveColO, " ", linkBigColP, " ", linkSmallColQ);
        let img = new ImgMetadata(anoColE, decadaColF, regiaoColG, autoriaColH, 
                              categoriaColD, descColL, fonteOriginalColI,
                              estadoColK, resolucaoColM, formatoColN, idColC,
                              palavraChaveColO, linkBigColP, linkSmallColQ, i);
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
    
    populateSidebar(allKeywords);
      let grid = document.getElementById('grid-container');
    clear(grid);
    console.log("Data array length ", data.length)
    for (let i=0;i<data.length;i++) {
        createNewImage(data[i], grid);
    }
    })
}

function removeAccents(word) {
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
                let searchBox = document.getElementById("searchbox");
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
            let searchBox = document.getElementById("searchbox");
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
            let searchBox = document.getElementById("searchbox");
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
            let searchBox = document.getElementById("searchbox");
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
    let grid = document.getElementById('grid-container');
    clear(grid);

    let searchBox = document.getElementById("searchbox");
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
            createNewImage(data[i], grid);
        }
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
        console.log("CLICKED IMAGE")
        showFull(imgMetaData.hlinksmall);
        current = imgMetaData.index;
    }
    div.appendChild(img);
    
    if (imgMetaData.description != "") {
        let descAttr = document.createElement("p");
        descAttr.className = "cardattribute";
        descAttr.innerText = "Descrição";
        div.appendChild(descAttr);
        let desc = document.createElement("p");
        desc.className = "description";
        desc.innerText = imgMetaData.description;
        div.appendChild(desc);
    }

    if (imgMetaData.year != "") {
        let yearAttr = document.createElement("p");
        yearAttr.className = "cardattribute";
        yearAttr.innerText = "Ano";
        div.appendChild(yearAttr);
        let year = document.createElement("p");
        year.className = "description";
        year.innerText = imgMetaData.year;
        div.appendChild(year);
    }

    if (imgMetaData.author != "") {
        let authorAttr = document.createElement("p");
        authorAttr.className = "cardattribute";
        authorAttr.innerText = "Autoria";
        div.appendChild(authorAttr);
        let author = document.createElement("p");
        author.className = "description";
        author.innerText = imgMetaData.author;
        div.appendChild(author);
    }

    if (imgMetaData.category != "") {
        let categoryAttr = document.createElement("p");
        categoryAttr.className = "cardattribute";
        categoryAttr.innerText = "Categoria";
        div.appendChild(categoryAttr);
        let category = document.createElement("p");
        category.className = "description";
        category.innerText = imgMetaData.category;
        div.appendChild(category);
    }

    if (imgMetaData.region != "" ) {
        let regionAttr = document.createElement("p");
        regionAttr.className = "cardattribute";
        regionAttr.innerText = "Bairro/Região";
        div.appendChild(regionAttr);
        let region = document.createElement("p");
        region.className = "description";
        region.innerText = imgMetaData.region;
        div.appendChild(region);
    }

    if (imgMetaData.source != "") {
        let sourceAttr = document.createElement("p");
        sourceAttr.className = "cardattribute";
        sourceAttr.innerText = "Fonte Original";
        div.appendChild(sourceAttr);
        let source = document.createElement("p");
        source.className = "description";
        source.innerText = imgMetaData.source;
        div.appendChild(source);
    }

    if (imgMetaData.keywords != "") {
        let keywordsAttr = document.createElement("p");
        keywordsAttr.className = "cardattribute";
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
    zoomLevel = 1;
    newPosX = 0;
    newPosY = 0;
    startPosX = 0;
    startPosY = 0;
    console.log("SHOW FULL")
    let zoomImage = document.getElementsByClassName("overlayImg")[0];
    zoomImage.src = link;
    zoomImage.style.visibility = "visible";
    console.log(link);
    let overlay = document.getElementById("overlay");
    overlay.style.visibility = "visible";
    overlay.style.display = "block";
    resetPositionAndSize();
}

function resetPositionAndSize() {
    let zoomImage = document.getElementsByClassName("overlayImg")[0];
    let width = zoomImage.offsetWidth;
    let height = zoomImage.offsetHeight;
    if (width > height) {
        console.log
        zoomImage.style.width = "50%";
        zoomImage.style.left = "25%";
        zoomImage.style.height = "auto";
        let windowHeight = window.innerHeight;
        console.log("window innerHeight ", windowHeight, " offsetHeight ", zoomImage.offsetHeight)
        let calculatedHeight =(windowHeight-zoomImage.offsetHeight)/2 
        zoomImage.style.top = calculatedHeight.toString() + "px";
        console.log(zoomImage.style.top, " ",(windowHeight-zoomImage.offsetHeight)/2 + " px");
        
    } else {
        zoomImage.style.top = "25%";
        zoomImage.style.height = "50%";
        zoomImage.style.width = "auto";
        let windowWidth = window.innerWidth;
        console.log("window innerWidth ", windowWidth, " offsetWidth ", zoomImage.offsetWidth)
        let calculatedWidth = (windowWidth-zoomImage.offsetWidth)/2
        zoomImage.style.left = calculatedWidth.toString() + "px";
        console.log(zoomImage.style.left, " ", (windowWidth-zoomImage.offsetWidth)/2 + " px")
    }
    console.log("reset position left ", zoomImage.style.left, " top ", zoomImage.style.top)
}

function left() {
    console.log("LEFT");
    console.log(current);
    if (current-1 < 0) {
        current = data.length-1
    } else {
        current = Math.abs((current-1)%data.length);
    }
    console.log(current);
    let zoomImage = document.getElementsByClassName("overlayImg")[0];
    zoomImage.style.visibility = "hidden";
    zoomImage.src = data[current].hlink;
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
    console.log("RIGHT");
    console.log(current);
    current = Math.abs((current+1)%(data.length));
    console.log(current);
    let zoomImage = document.getElementsByClassName("overlayImg")[0];
    zoomImage.style.visibility = "hidden";
    zoomImage.src = data[current].hlink;
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
  console.log("OFF")
  document.getElementById("overlay").style.visibility = "hidden";
  let zoomImage = document.getElementsByClassName("overlayImg")[0];
  zoomImage.style.visibility = "hidden";
  zoomImage.src = "";
  zoomLevel = 1;
  newPosX = 0;
  newPosY = 0;
  startPosX = 0;
  startPosY = 0;
}

function goHome() {
    console.log("CLICKED GO HOME")
    off();
}

function onZoomIn() {
    dontHide = true;
    console.log("CLICKED ZOOM IN")
    if (zoomLevel < maxZoomLevel) {
        zoomLevel += zoomIncrement;
        zoomLevel = Math.min(zoomLevel, maxZoomLevel);
        updateZoomedImage();
    }
    if (zoomLevel === maxZoomLevel) {
        document.getElementById('zoomInButton').disabled = true;
    }
    document.getElementById('zoomOutButton').disabled = false;    

}

function onZoomOut() {
    let zoomImage = document.getElementsByClassName("overlayImg")[0];
    dontHide = true;
    console.log("CLICKED ZOOM OUT");
    if (zoomLevel > minZoomLevel) {
        zoomLevel -= zoomIncrement;
        zoomLevel = Math.max(zoomLevel, minZoomLevel);
        updateZoomedImage();
    }
    document.getElementById('zoomInButton').disabled = false;
    if (zoomLevel === 1) {
        zoomImage.style.cursor = 'move';
    }
}

function updateZoomedImage() {
    let zoomImage = document.getElementsByClassName("overlayImg")[0];
    var imageWidth = zoomImage.offsetWidth;
    var imageHeight = zoomImage.offsetHeight;
    console.log("Img width ", imageWidth);
    var newImageWidth = imageWidth * zoomLevel;
    var newImageHeight = imageHeight * zoomLevel;

    var left = zoomImage.offsetLeft;
    var top = zoomImage.offsetTop;

    zoomImage.style.transform = 'scale(' + zoomLevel + ')';
    zoomImage.style.width = newImageWidth + 'px';
    zoomImage.style.height = newImageHeight + 'px';

    // Restrict images from leaving containers
    if (Math.abs(zoomImage.offsetLeft - newPosX) >= Math.abs((parseInt(zoomImage.style.width, 10) - window.innerWidth) / 2)) {
        left = 0;
    }
    if (Math.abs(zoomImage.offsetTop - newPosY) >= Math.abs((parseInt(zoomImage.style.height, 10) - window.innerHeight) / 2)) {
        top = 0;
    }

    zoomImage.style.left = left + 'px';
    zoomImage.style.top = top + 'px';

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