let cv = document.getElementById("lienzo");
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

  let areaMaterial = anchoMaterial.value * largoMaterial.value;

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

  let cutArea = tableInputs[1].value * tableInputs[2].value;

  if (cutArea > areaMaterial) {
    alert(
      "las dimensiones de la pieza a cortar no pueden ser mayores que las del material a cortar"
    );
    return;
  }

  let idConsecutivo = new Date().getTime();
  let idFila = `fila-${idConsecutivo}`;

  const newRow = cutTable.insertRow();

  newRow.innerHTML = `
  <tr class="tablaCortesBody">
    <td><input type="text" name="ref" class="inputCut disabled" value=${tableInputs[0].value}></td>
    <td><input type="number" name="ancho" class="inputCut disabled" value=${tableInputs[1].value}></td>
    <td><input type="number" name="largo" class="inputCut disabled" value=${tableInputs[2].value}></td>
    <td><input type="number" name="cant" class="inputCut disabled" value=${tableInputs[3].value}></td>
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
};

addCutButton.onclick = (e) => {
  addCut(e);
};

document.addEventListener("change", changeSize);

const getArrayCortes = () => {
  let objCortes = {};
  let arrayTrCortes = Array.from(
    document.getElementsByClassName("listaCortes")
  );

  let arrayCortes = arrayTrCortes.map((corte) => {
    let classInputs = Array.from(corte.getElementsByClassName("inputCut"));
    classInputs.forEach((input) => {
      objCortes[input.name] = input.value;
    });

    return { ...objCortes };
  });

  return arrayCortes;
};

const sortCortesByLenght = (arrayCortes) => {
  function sortByLenght(a, b) {
    if (a.largo > b.largo) return -1;
    if (a.largo < b.largo) return 1;
  }

  let sortCortes = [...arrayCortes].sort(sortByLenght);

  return sortCortes;
};

// let Tw = parseFloat(anchoMaterial.value)
// let Tl = parseFloat(largoMaterial.value)
// let Ta = Tw * Tl

// let Lw = Tw
// let Ll = Tl
// let La = Ta

// let Sw = Tw
// let Sl = Tl
// let Sa = Ta

// let Nw = 0
// let Nl = 0
// let Na = 0

// let Io = 0
// let Ic = 0

// let N = {
//   w: 0,
//   l: 0,
//   a: 0,
// };

btnCalcular.onclick = () => {
  let T = {
    w: parseFloat(anchoMaterial.value),
    l: parseFloat(largoMaterial.value),
    a: parseFloat(anchoMaterial.value) * parseFloat(largoMaterial.value),
  };

  let L = {
    w: T.w,
    l: T.l,
    a: T.a,
  };
  let S = {
    w: T.w,
    l: T.l,
    a: T.a,
  };

  let I = {
    s: 0,
    c: 0,
  };

  // let arrayCortes = getArrayCortes();

  // let sortCortes = sortCortesByLenght(arrayCortes);

  let sortCortes = [
    {
      r: "d",
      w: 200,
      l: 300,
      c: 3,
    },
    {
      r: "c",
      w: 120,
      l: 130,
      c: 4,
    },
    {
      r: "b",
      w: 110,
      l: 180,
      c: 5,
    },
    {
      r: "a",
      w: 60,
      l: 80,
      c: 3,
    },
  ];

  let Ic = sortCortes.length;

  let global = (N) => {
    if (I.s === 0) {
      T.l -= N.l;
      T.a = T.l * T.w;
      I.s = 1;
    }
  };

  let superior = (N) => {
    if (N.a < L.a) {
      S.w = L.w;
      S.l = L.l - N.l;
      S.a = S.w * S.l;

      lateral(N);

      return N;
    }

    if (N.a < S.a) {
      return rotar(N);
    }

    return "NA";
  };

  let lateral = (N) => {
    L.w -= N.w;
    L.l = N.l;
    L.a = L.w * L.l;
  };

  let rotar = (N) => {
    if (N.l > S.l) {
      let invA = N.l;
      let invL = N.w;

      N.w = invA;
      N.l = invL;
      return N;
    }
    return N
  };
  let descontar = (N) => {
    //Descontar
    //retorna los nuevos cortes
    // filtral != N
  };

  let nuevoCiclo = (N) => {
    global(N);
    return superior(N);
  };

  while (sortCortes.length > 0) {
    try {
      sortCortes.forEach((N) => {
        N.a = N.w * N.l
        let desCorte = nuevoCiclo(N);
        if (desCorte !== "NA") {
          sortCortes = sortCortes.filter((corte) => {
            return corte.r !== N.r;
          });
        }
        console.log(sortCortes);
      });
    } catch (error) {}
  }
};

let elegirArea = (N) => {
  let ubicado = false;

  for (let i = 0; i < arrayAreasDisp.length; i++) {
    let area = arrayAreasDisp[i];
    if (N.a <= area.Da && N.w < area.Dw && area.Da > 0) {
      //Rotar
      if (N.l > area.Dl) {
        let invA = N.l;
        let invL = N.w;
        N.w = invA;
        N.l = invL;
      }

      N.x = area.Dx;
      N.y = area.Dy - N.l;

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

// materialArea = 200000;
// areaDisponibleLateral = materialArea;
// anchoSuperior = anchoMaterial.value;
// largoSuperior = largoMaterial.value;

// let currentCorte = sortCortes.map((corte) => {
//   largoSuperior -= corte.largo;
//   areaDisponibleSuperior = anchoSuperior * largoSuperior;
//   anchoLateral = anchoSuperior - corte.ancho;
//   areaDisponibleLateral = (anchoSuperior - corte.ancho) * corte.largo;

//   let restCant = corte.cant;
//   let areaCorte = corte.ancho * corte.largo;

//   for (let index = 0; index < corte.cant; index++) {
//     if (areaDisponibleLateral > areaCorte && restCant > 0) {
//       areaDisponibleLateral -= areaCorte;
//       restCant -= 1;

//       console.log(
//         "area restante",
//         areaDisponibleLateral,
//         "cant restante",
//         restCant,
//         "ref",
//         corte.ref
//       );
//       continue;
//     }
//   }
// });
//}

// let ancho = prompt('por favor ingrese el ancho');
// let alto =  prompt('por favor ingrese el Alto');

// cv.setAttribute("width", `${ancho}px`);
// cv.setAttribute("height", `${alto}px`);

// addEventListener()

// var cv, cx, objetos, objetoActual = null;
//     var inicioX = 0, inicioY = 0;

//     function actualizar() {
//       cx.fillStyle = '#f0f0f0';
//       cx.fillRect(0, 0, 400, 300);

//       for (var i = 0; i < objetos.length; i++) {
//         cx.fillStyle = objetos[i].color;
//         cx.fillRect(objetos[i].x, objetos[i].y, objetos[i].width, objetos[i].height);
//       }
//     }

//     window.onload = function() {
//       objetos = [];
//       cv = document.getElementById('lienzo');
//       cx = cv.getContext('2d');
//       // agregar objetos de prueba
//       objetos.push({
//         x: 0, y: 0,
//         width: 100, height: 200,
//         color: '#00f'
//       });
//       objetos.push({
//         x: 300, y: 150,
//         width: 50, height: 100,
//         color: '#f00'
//       });
//       objetos.push({
//         x: 120, y: 50,
//         width: 50, height: 50,
//         color: '#0f0'
//       });
//       actualizar();

//       cv.onmousedown = function(event) {
//         for (var i = 0; i < objetos.length; i++) {
//           if (objetos[i].x < event.clientX
//             && (objetos[i].width + objetos[i].x > event.clientX)
//             && objetos[i].y < event.clientY
//             && (objetos[i].height + objetos[i].y > event.clientY)
//           ) {
//             objetoActual = objetos[i];
//             inicioY = event.clientY - objetos[i].y;
//             inicioX = event.clientX - objetos[i].x;

//             break;
//           }
//         }
//       }

//       cv.onmousemove = function(event) {
//         if (objetoActual != null) {
//           objetoActual.x = event.clientX - inicioX;
//           objetoActual.y = event.clientY - inicioY;
//         }
//         actualizar();
//       }

//       cv.onmouseup = function(evet) {
//         objetoActual = null;
//       }
//     }