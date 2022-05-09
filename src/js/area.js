let cv, cx;
let addCutButton = document.getElementById("addCutButton");
let cutTable = document.getElementById("cutTable");
let anchoMaterial = document.getElementById("anchoMaterial");
let largoMaterial = document.getElementById("largoMaterial");
let btnCalcular = document.getElementById("btnCalcular");
let materialArea = 0;
let areaDisponibleSuperior = 0;
let areaDisponibleLateral = 0;
let anchoSuperior = 0;
let largoSuperior = 0;
let anchoLateral = 0;
let largoLateral = 0;
let arrayAreasDisp = [];
let posicionCortes = [];

const changeSize = (e) => {
  let dimensionParent = e.target.parentElement.parentElement;
  let dimensionInputs = Array.from(
    dimensionParent.getElementsByClassName("inputCut")
  );

  let inputAncho = dimensionInputs.filter((input) => {
    return input.name === "ancho";
  });

  let inputLargo = dimensionInputs.filter((input) => {
    return input.name === "largo";
  });

  if (parseInt(inputAncho[0].value) > parseInt(inputLargo[0].value)) {
    alert("El ancho no puede ser mayor que el largo");
    e.target.value = "";
    return;
  }

  if (dimensionParent.classList.contains("cortes")) {
    return;
  }

  let dimension = e.target.value;

  if (e.target.name === "ancho") {
    cv.setAttribute("width", `${dimension}px`);
  }

  if (e.target.name === "largo") {
    cv.setAttribute("height", `${dimension}px`);
  }
};

const addCut = (e) => {
  let tableTarget = e.target.parentElement.parentElement;
  let tableInputs = Array.from(tableTarget.getElementsByClassName("inputCut"));

  let anchoCorte = parseInt(tableInputs[1].value);
  let largoCorte = parseInt(tableInputs[2].value);
  let anchoMat = parseInt(anchoMaterial.value);
  let largoMat = parseInt(largoMaterial.value);

  let areaMaterial = anchoMat * largoMat;

  let arryCutEmptyInputs = tableInputs.filter((input) => {
    return input.value <= 0;
  });

  if (arryCutEmptyInputs.length > 0) {
    alert("Hay campos vacíos o negativos");
    return;
  }

  if (areaMaterial === 0) {
    alert("Falta ingresar las dimensiones del material");
    return;
  }

  let cutArea = anchoCorte * largoCorte;

  if (anchoCorte >= anchoMat || largoCorte >= largoMat) {
    alert(
      "las dimensiones de la pieza a cortar no pueden ser mayores o iguales que las del material a cortar"
    );
    return;
  }

  if (cutArea >= areaMaterial) {
    alert(
      "las dimensiones de la pieza a cortar no pueden ser mayores o iguales que las del material a cortar"
    );
    return;
  }

  let idConsecutivo = new Date().getTime();
  let idFila = `fila-${idConsecutivo}`;

  const newRow = cutTable.insertRow();

  newRow.innerHTML = `
  <tr class="tablaCortesBody">
    <td><input type="text" name="r" class="inputCut disabled" value=${tableInputs[0].value}></td>
    <td><input type="number" name="w" class="inputCut disabled" value=${tableInputs[1].value}></td>
    <td><input type="number" name="l" class="inputCut disabled" value=${tableInputs[2].value}></td>
    <td><input type="number" name="c" class="inputCut disabled" value=${tableInputs[3].value}></td>
  </tr>
  `;

  newRow.id = idFila;
  newRow.classList.add("listaCortes");

  const tdEliminar = document.createElement("td");
  const delButton = document.createElement("input");
  delButton.className = "inputBut";
  delButton.type = "button";
  delButton.value = "x";

  delButton.onclick = function () {
    document.getElementById(idFila).remove();
  };

  newRow.appendChild(tdEliminar);
  tdEliminar.appendChild(delButton);

  tableInputs.forEach((input) => {
    input.value = "";
  });

  tableInputs[0].focus();
};

addCutButton.onclick = (e) => {
  addCut(e);
};

document.addEventListener("change", changeSize);

window.onload = function () {
  cv = document.getElementById("lienzo");
  cx = cv.getContext("2d");
};

function get_random_color() {
  var color = "";
  for (var i = 0; i < 3; i++) {
    var sub = Math.floor(Math.random() * 256).toString(16);
    color += sub.length == 1 ? "0" + sub : sub;
  }
  return "#" + color;
}

const getArrayCortes = () => {
  let objCortes = {};
  let arrayTrCortes = Array.from(
    document.getElementsByClassName("listaCortes")
  );

  let arrayCortes = arrayTrCortes.map((corte) => {
    let classInputs = Array.from(corte.getElementsByClassName("inputCut"));
    classInputs.forEach((input) => {
      objCortes[input.name] = parseFloat(input.value)
        ? parseFloat(input.value)
        : input.value;
    });

    let color = get_random_color();

    return { ...objCortes, color: color };
  });

  return arrayCortes;
};

const sortCortesByLenght = (arrayCortes) => {
  function sortByLenght(a, b) {
    if (a.l > b.l) return -1;
    if (a.l < b.l) return 1;
  }

  let sortCortes = [...arrayCortes].sort(sortByLenght);

  return sortCortes;
};

let sortCortesFijos = [
  {
    r: "h",
    w: 140,
    l: 160,
    c: 3,
    color: "#01FF00",
  },
  {
    r: "g",
    w: 110,
    l: 180,
    c: 4,
    color: "#FE8B01",
  },
  {
    r: "f",
    w: 120,
    l: 145,
    c: 1,
    color: "#F8A79A",
  },
  {
    r: "e",
    w: 90,
    l: 150,
    c: 7,
    color: "#0101FE",
  },
  {
    r: "d",
    w: 60,
    l: 80,
    c: 5,
    color: "#FEFE02",
  },
  {
    r: "c",
    w: 29,
    l: 70,
    c: 8,
    color: "#8D1682",
  },
  {
    r: "b",
    w: 28,
    l: 69,
    c: 3,
    color: "#ADD5FA",
  },
  {
    r: "a",
    w: 27,
    l: 68,
    c: 1,
    color: "#FA5F49",
  },
];

btnCalcular.onclick = () => {
  // let sortCortes = [...sortCortesFijos];

  arrayAreasDisp = [];
  posicionCortes = [];

  let canvasContainer = document.getElementById("lienzoContainer");

  canvasContainer.innerHTML = "";

  let sortCortes = getArrayCortes();

  sortCortes = sortCortesByLenght([...sortCortes]);

  let T = {
    w: parseFloat(anchoMaterial.value),
    l: parseFloat(largoMaterial.value),
    a: parseFloat(anchoMaterial.value) * parseFloat(largoMaterial.value),
  };

  const agregarNuevoMaterial = (canvasIndex) => {
    arrayAreasDisp.push({
      Dw: T.w,
      Dl: T.l,
      Da: T.a,
      Dx: 0,
      Dy: T.l,
      Dc: canvasIndex,
    });

    const nuevoLienzo = document.createElement("canvas");
    nuevoLienzo.className = "lienzo";
    nuevoLienzo.width = anchoMaterial.value;
    nuevoLienzo.height = largoMaterial.value;
    canvasContainer.appendChild(nuevoLienzo);
  };

  agregarNuevoMaterial(0);

  const sortDispAreas = () => {
    function sortByArea(a, b) {
      if (a.Da > b.Da) return 1;
      if (a.Da < b.Da) return -1;
    }

    arrayAreasDisp.sort(sortByArea);
  };

  let elegirArea = (N) => {
    let ubicado = false;

    for (let i = 0; i < arrayAreasDisp.length; i++) {
      let area = arrayAreasDisp[i];
      let rotado = false;
      if (N.a <= area.Da && N.w < area.Dw && area.Da > 0) {
        //Rotar
        if (N.l > area.Dl) {
          let invW = N.l;
          let invL = N.w;
          N.w = invW;
          N.l = invL;
          rotado = true;
        }

        N.x = area.Dx;
        N.y = area.Dy - N.l;
        N.canvasIndex = area.Dc;

        if (N.w > area.Dw || N.l > area.Dl) {
          continue;
        }

        if (N.x < 0 || N.y < 0) {
          if (rotado) {
            let invW = N.l;
            let invL = N.w;
            N.w = invW;
            N.l = invL;
          }
          continue;
        }

        let L = { ...area };

        //lateral
        L.Dw -= N.w;
        L.Dl = N.l;
        L.Da = L.Dw * L.Dl;
        L.Dx += N.w;

        arrayAreasDisp.push({
          Dw: L.Dw,
          Dl: L.Dl,
          Da: L.Da,
          Dx: L.Dx,
          Dy: L.Dy,
          Dc: L.Dc,
        });

        //superior
        area.Dl -= N.l;
        area.Da = area.Dw * area.Dl;
        area.Dy -= N.l;

        ubicado = true;

        sortDispAreas();

        posicionCortes.push({ ...N });

        break;
      }
    }

    if (ubicado) {
      return N;
    } else {
      return "NA";
    }
  };

  let nuevoCiclo = (N) => {
    return elegirArea(N);
  };

  let cantidadMaterial = 0;

  while (sortCortes.length > 0) {
    sortCortes.forEach((N) => {
      N.a = N.w * N.l;

      let corteCantidad = N.c;

      for (let i = 0; i < corteCantidad; i++) {
        let desCorte = nuevoCiclo(N);

        if (desCorte !== "NA") {
          canvasArray = Array.from(document.getElementsByClassName("lienzo"));
          let lienzoIndex = desCorte.canvasIndex;
          let context = canvasArray[lienzoIndex].getContext("2d");

          context.lineWidth = 1;
          context.strokeStyle = "black";
          context.fillStyle = desCorte.color;
          debugger;
          context.beginPath(); //Limpia los estilos del ultimo objeto proyectado en el canvas
          context.rect(desCorte.x, desCorte.y, desCorte.w, desCorte.l);
          context.fill();
          context.stroke();
          context.font = "15px Arial Bold";
          context.fillStyle = "black";
          context.fillText(
            desCorte.r,
            desCorte.x + desCorte.w / 2 - desCorte.r.length * 4.5,
            desCorte.y + desCorte.l / 2
          );
          N.c -= 1;
        }
      }
      if (N.c <= 0) {
        sortCortes = sortCortes.filter((corte) => {
          return corte.r !== N.r;
        });
      }
    });

    cantidadMaterial += 1;

    if (sortCortes.length > 0) {
      sortCortes = sortCortesByLenght([...sortCortes]);
      agregarNuevoMaterial(cantidadMaterial); //el parametro Se debe cambiar por el nuevo ancho de material
    }
  }
};
