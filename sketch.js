let queryUrl, data;
let asignaturas = [];
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

// Función setup() de p5.js que se ejecuta una vez al inicio.
function setup() {
  // No hay contenido aquí porque estamos construyendo los objetos en gotData().
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
          : " ";

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
    asignatura.display();
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

  display(){

    let tipoDeAsignatura;
    if(this.type === "Obligatoria"){
    tipoDeAsignatura = "<span class='tipo obligatoria'>Obligatoria</span>";
    }else{
      tipoDeAsignatura = "<span class='tipo optativa'>Optativa</span>";
    }

    let asigContainer = createDiv(
      "<h4>" +
        this.code + "<span class='credits'>" + this.credits + "</span><br><a href=" +
        this.url + " target='_blank' title='Ficha de "+this.name+" en Casiopea'>" + this.name + "</a></h4>" + this.ae +"<br>"+tipoDeAsignatura+"<br><span class='mencion'>"+this.men+"</span>"
    );

    asigContainer.class("asig "+this.ae); // cada div de asignatura tiene una clase común 'aig' y otra por área de estudio
    
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
    let heightVal = map(creditsNum, 2, 12, 120, 300);
    asigContainer.style('height', heightVal + 'px');
  }
}
