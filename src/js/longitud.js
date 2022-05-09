let InputsHeadersCorte = Array.from(document.querySelectorAll(".longInputs"));
let tablaListaCorte = document.getElementById("listaCorte");
let botonAgregar = document.getElementById("botonAgregar");
let descripcionMaterial = document.getElementById("descripcionMaterial");
let longitudMaterial = document.getElementById("longitudMaterial");
let unidadesMedida = document.getElementById("unidadesMedida");
let grosorHta = document.getElementById("grosorHta");
let longitudCorte = document.getElementById("longCorte");
let despunteIzq = document.getElementById("despunteIzq");
let despunteDer = document.getElementById("despunteDer");
let botonCalcular = document.getElementById("botonCalcular");
let arrayCortes = []

let compararValorInputs = function (inputMayor,inputMenor) {

  let mayor = parseFloat(inputMayor.value)
  let menor = parseFloat(inputMenor.value)

  if (menor > mayor) {
    alert(`${inputMenor.name} no puede ser mayor que ${inputMayor.name}`)
    inputMenor.value = ""
    return
  }
}

longitudCorte.onchange = function () {
  //parametros: inpunMayor , input menor
  compararValorInputs(longitudMaterial,longitudCorte)
}

despunteIzq.onchange = function () {
  //parametros: inpunMayor , input menor
  compararValorInputs(longitudMaterial,despunteIzq)
}

despunteDer.onchange = function () {
  //parametros: inpunMayor , input menor
  compararValorInputs(longitudMaterial,despunteDer)
}

grosorHta.onchange = function () {
  //parametros: inpunMayor , input menor
  compararValorInputs(longitudMaterial,grosorHta)
}

function validar_corte() {
  if (descripcionMaterial.value == "") {
    alert("falta ingresar la descripción del material");
    return false;
  }
  if (longitudMaterial.value == "") {
    alert("falta ingresar la Longitud del material");
    return false;
  }
  if (unidadesMedida.value == "") {
    alert("falta ingresar las unidades de medida");
    return false;
  }
  if (grosorHta.value == "") {
    alert("falta ingresar el grosor de la herramienta");
    return false;
  }

  let esVacio = InputsHeadersCorte.some(function (item) {
    return item.value == "";
  });

  if (esVacio == true) {
    alert("debe llenar todos los campos");
    return false;
  }
}

let crearPlantilla = function () {
  const row = tablaListaCorte.insertRow();

  let idConsecutivo = new Date().getTime();
  let idFila = `fila-${idConsecutivo}`;
  let objCortes = {}

  objCortes.id = idFila
  objCortes.referencia = InputsHeadersCorte[0].value
  objCortes.longitud = parseFloat(InputsHeadersCorte[1].value)
  objCortes.cantidad = parseInt(InputsHeadersCorte[2].value)

  let newObjCortes = {...objCortes}

  arrayCortes.push(newObjCortes)

  console.log(arrayCortes)

  row.innerHTML = `
  <tr>
    <td>${idFila}</td>
    <td>${InputsHeadersCorte[0].value}</td>
    <td>${InputsHeadersCorte[1].value}</td>
    <td>${InputsHeadersCorte[2].value}</td>
  </tr>
  `
  const botonEliminar = document.createElement("button")
  botonEliminar.innerHTML = "X"
  row.id = idFila
  botonEliminar.onclick = function () {
    document.getElementById(idFila).remove();
    let indexOfCorte = arrayCortes.findIndex(i => i.id === idFila );
    arrayCortes.splice(indexOfCorte, 1)
    console.log(arrayCortes)
  }
  row.appendChild(botonEliminar);
};

function agregar_corte() {
  // tablaListaCorte.innerHTML += crearPlantilla();
 crearPlantilla();

  InputsHeadersCorte.forEach(function (element) {
    element.value = "";
  });
}

botonAgregar.onclick = function () {
  if (validar_corte() == false) {
    return;
  }
  agregar_corte();
  
};

botonCalcular.onclick = function () {

 if (arrayCortes.length == 0) {
  alert("No hay cortes para calcular")
  return

 }
  
};





