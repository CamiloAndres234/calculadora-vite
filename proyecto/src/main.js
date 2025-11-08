const pantalla = document.getElementById('pantalla');

function agregar(valor) {
  pantalla.value += valor;
}

function borrar() {
  pantalla.value = '';
}

function eliminar() {
  pantalla.value = pantalla.value.slice(0, -1);
}

function calcular() {
  try {
    pantalla.value = eval(pantalla.value);
  } catch (error) {
    pantalla.value = 'Error';
  }
}
