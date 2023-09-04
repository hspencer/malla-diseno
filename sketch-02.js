
/*

Malla Curricular de la carrera de Diseño
e[ad] Escuela de Arquitectura y Diseño PUCV

por: Herbert Spencer

*/

// Declaración de variables globales
let queryUrl, data;
let asignaturas = [];

// arreglos separados por ciclo y por área de estudios

// ciclo del oficio
let co_ta = [];
let co_ct = [];
let co_ah = [];
let co_ff = [];

// ciclo de la disciplina
let cd_ta = [];
let cd_ct = [];
let cd_ah = [];
let cd_ff = [];

// ciclo profesional y de magister
let cp_ta = [];
let cp_ct = [];
let cp_ah = [];
let cp_ff = [];

// Función preload() de p5.js que se ejecuta antes de setup().
// Se utiliza para cargar recursos externos, en este caso, datos JSON.
function preload() {
  queryUrl =
    "https://wiki.ead.pucv.cl/api.php?action=ask&format=json&query=%5B%5BCategor%C3%ADa%3AAsignatura%5D%5D%5B%5BCurr%C3%ADculum%3A%3ADecreto%20Acad%C3%A9mico%2037%2F2017%5D%5D%5B%5BCarreras%20Relacionadas%3A%3ADise%C3%B1o%5D%5DOR%5B%5BCategor%C3%ADa%3AAsignatura%5D%5D%5B%5BCurr%C3%ADculum%3A%3ADecretos%20Acad%C3%A9micos%2035%20y%2037%2F2017%5D%5D%5B%5BCarreras%20Relacionadas%3A%3ADise%C3%B1o%5D%5D%20%7C%3FClave%20%7C%3FCr%C3%A9ditos%20%7C%3FCiclo%20Formativo%20%7C%3F%C3%81rea%20de%20Estudio%20%7C%3FCiclo%20Formativo%20%7C%3FTipo%20de%20Asignatura%20%7C%3FMenci%C3%B3n%20%7Climit%20%3D%20999&utf8=1&formatversion=1";
  data = loadJSON(queryUrl, gotData, "jsonp"); // Cargar datos JSON. Cuando esté listo, se llamará a gotData().
}

// Función que se llama después de cargar el JSON.
function gotData() {
  console.log(data); // Mostrar los datos en la consola para depuración.
  constructObjects(); // Construir los objetos HTML a partir de los datos JSON.
}

// Función para construir objetos HTML a partir de datos JSON.
function constructObjects() {
  // Recorrer cada resultado en data.query.results.
  for (let key in data.query.results) {
    let asig = data.query.results[key]; // 'asig' es una variable temporal que se renueva por cada nodo de data.query.results

    // Extraer datos relevantes del objeto actual.
    let name = asig.fulltext; // título de la asignatura
    let url = asig.fullurl; // link a la página en Casiopea

    // Verificar si existe la propiedad y si tiene elementos. De lo contrario, mostrar "No disponible".
    let code =
      asig.printouts.Clave && asig.printouts.Clave.length > 0
        ? asig.printouts.Clave.join(", ")
        : "No disponible";
    
    let credits =
      asig.printouts.Clave && asig.printouts["Créditos"].length > 0
        ? asig.printouts["Créditos"].join(", ")
        : "No disponible";

    let areaOfStudy =
      asig.printouts["Área de Estudio"] &&
      asig.printouts["Área de Estudio"].length > 0
        ? asig.printouts["Área de Estudio"].join(", ")
        : "No disponible";

    let cicloFormativo =
      asig.printouts["Ciclo Formativo"] &&
      asig.printouts["Ciclo Formativo"].length > 0
        ? asig.printouts["Ciclo Formativo"].join(", ")
        : "No disponible";

    let tipo =
      asig.printouts["Tipo de Asignatura"] &&
      asig.printouts["Tipo de Asignatura"].length > 0
        ? asig.printouts["Tipo de Asignatura"].join(", ")
        : "No disponible";

    let mencion =
        asig.printouts["Mención"] &&
        asig.printouts["Mención"].length > 0
          ? asig.printouts["Mención"].join(", ")
          : "-";

    // creao una asignatura de acuerdo a la clase Asignatua definida más abajo (vacía)
    let asignatura = new Asignatura();
    
    // a la asignatura vacía le copio los valores del JSON
    asignatura.name = name;
    asignatura.code = code;
    asignatura.url = url;
    asignatura.credits = parseFloat(credits);
    asignatura.ae = areaOfStudy;
    asignatura.cf = cicloFormativo;
    asignatura.type = tipo;
    asignatura.men = mencion;

    // agrego la asignatura (temporal) al arreglo de asignaturas
    asignaturas.push(asignatura);

    // le digo que la despliegue
    asignatura.sort();
  }
}

let taSelect, ctSelect, ahSelect, ffSelect;


function setup() {
   taSelect = createSelect();
   taSelect.parent("selectors");
   taSelect.changed(addAsig);
   taSelect.option('selecciona un taller del oficio');
   for(let i = 0; i < co_ta.length; i++){
    taSelect.option(co_ta[i].name);
   }
   ctSelect = createSelect();
   ctSelect.parent("selectors");
   ctSelect.changed(addAsig);
   ctSelect.option('selecciona una asignatura científico-tecnológical');
   for(let i = 0; i < co_ct.length; i++){
    ctSelect.option(co_ct[i].name);
   }
   ahSelect = createSelect();
   ahSelect.parent("selectors");
   ahSelect.changed(addAsig);
   ahSelect.option('selecciona una asignatura artístico-humanista');
   for(let i = 0; i < co_ah.length; i++){
    ahSelect.option(co_ah[i].name);
   }
   ffSelect = createSelect();
   ffSelect.parent("selectors");
   ffSelect.changed(addAsig);
   ffSelect.option('selecciona una asignatura de formación fundamental');
   for(let i = 0; i < co_ff.length; i++){
    ffSelect.option(co_ff[i].name);
   }
}


function addAsig(){
    let selectedValue = this.value();
    let selectedIndex = this.selected();

    for(let asignatura of asignaturas){
        if(selectedValue === asignatura.name){
            asignatura.display();
        }
    }
}

class Asignatura{
  constructor(){
    // inicializo el objeto con los atributos en blanco
    this.name = "";
    this.url = "";
    this.code = "";
    this.credits = 0; // lo queremos tratar como número
    this.ae = ""; // Área de Estudios
    this.cf = ""; // Ciclo Formativo
    this.type = ""; //tipo
    this.men = "";
    this.taken = false; // si la persona la ha tomado o no
  }

  sort(){
    // se ordenan en distintos arreglos acuerdo al ciclo y al área
    if(this.cf === "Ciclo del Oficio"){
        switch (this.ae){
          case "Área Fundamental":
            co_ff.push(this);
            break;
          case "Área Taller":
            co_ta.push(this);
            break;
          case "Área Humanista":
            co_ah.push(this);
            break;
          case "Área Científica":
            co_ct.push(this)
            break;
        }
      }
  
      if(this.cf === "Ciclo Disciplinar"){
        switch (this.ae){
          case "Área Fundamental":
            cd_ff.push(this);
            break;
          case "Área Taller":
            cd_ta.push(this);
            break;
          case "Área Humanista":
            cd_ah.push(this);
            break;
          case "Área Científica":
            cd_ct.push(this);
            break;
        }
      }
  
      if(this.cf === "Ciclo Profesional y de Magister"){
        switch (this.ae){
          case "Área Fundamental":
            cp_ff.push(this)
            break;
          case "Área Taller":
            cp_ta.push(this);
            break;
          case "Área Humanista":
            cp_ah.push(this);
            break;
          case "Área Científica":
            cp_ct.push(this);
            break;
        }
      }
  }

  display(){
    // variable temporal del tipo de asignatura
    let tipoDeAsignatura;
    if(this.type === "Obligatoria"){
    tipoDeAsignatura = "<span class='tipo obligatoria'>Obligatoria</span>";
    }else{
      tipoDeAsignatura = "<span class='tipo optativa'>Optativa</span>";
    }

    // ver si tiene mención definida. Se crea una variable temporal "mención"
    let mencion;
    if(this.men === "-"){ // cuando no tiene
      mencion = "";
    }else{
      // cuando está definida, arma este string más complejo para el HTML
      mencion = "<span class='mencion'><em>Mención: </em>"+this.men+"</span>";
    }

    let asigContainer = createDiv(
      "<h4>" +
        this.code + "<span class='credits'>" + this.credits + "</span><br><a href=" +
        this.url + " target='_blank' title='Ficha de "+this.name+" en Casiopea'>" + this.name + "</a></h4>" + this.ae +"<br>"+tipoDeAsignatura+"<br>"+mencion
    );

    asigContainer.class("asig "+this.ae); // cada div de asignatura tiene una clase común 'aig' y otra por área de estudio
    
    // se ubican en el HTML de acuerdo al ciclo y al área
    if(this.cf === "Ciclo del Oficio"){
      switch (this.ae){
        case "Área Fundamental":
          asigContainer.parent("co-ff");
          break;
        case "Área Taller":
          asigContainer.parent("co-ta");
          break;
        case "Área Humanista":
          asigContainer.parent("co-ah");
          break;
        case "Área Científica":
          asigContainer.parent("co-ct");
          break;
      }
    }

    if(this.cf === "Ciclo Disciplinar"){
      switch (this.ae){
        case "Área Fundamental":
          asigContainer.parent("cd-ff");
          break;
        case "Área Taller":
          asigContainer.parent("cd-ta");
          break;
        case "Área Humanista":
          asigContainer.parent("cd-ah");
          break;
        case "Área Científica":
          asigContainer.parent("cd-ct");
          break;
      }
    }

    if(this.cf === "Ciclo Profesional y de Magister"){
      switch (this.ae){
        case "Área Fundamental":
          asigContainer.parent("cp-ff");
          break;
        case "Área Taller":
          asigContainer.parent("cp-ta");
          break;
        case "Área Humanista":
          asigContainer.parent("cp-ah");
          break;
        case "Área Científica":
          asigContainer.parent("cp-ct");
          break;
      }
    }
    
    // ahora vamos a darle la altura de acuerdo a los créditos
    
    let creditsNum = parseFloat(this.credits); // convertir de texto a número
    let heightVal = map(creditsNum, 2, 12, 120, 250); // 120-250px rango de altura mapeada
    asigContainer.style('height', heightVal + 'px');
  }
}

