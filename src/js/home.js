let categoria = document.getElementById("categorias");

let longitud = function () {
  window.location = "../../HTML/longitud.html";
};

let elegirCategoia = function () {
  let selectedIndex = categoria.selectedIndex;
  console.log("seleccionÃ³", selectedIndex);

  switch (selectedIndex) {
    case 1:
      longitud();

      break;
    case 2:
      break;
    case 3:
      break;

    default:
      alert("no seleccionÃ³ ninguno");
      break;
  }
};

categoria.addEventListener("change", elegirCategoia);
