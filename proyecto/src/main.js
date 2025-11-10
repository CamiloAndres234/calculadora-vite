// Obtenemos la referencia a la pantalla
        const pantalla = document.getElementById('pantalla');
        let isResultDisplayed = false; // Bandera para saber si el valor actual es un resultado de cálculo

        // Inicializamos la pantalla al cargar
        pantalla.value = '0';

        // Función para agregar números u operadores
        function agregar(valor) {
            // Si el valor actual es "Error" o un resultado anterior, y el nuevo valor es un número, 
            // borramos la pantalla para empezar un nuevo cálculo.
            if (pantalla.value === 'Error' || (isResultDisplayed && !isNaN(Number(valor)))) {
                pantalla.value = valor;
                isResultDisplayed = false;
            // Si la pantalla es '0' y el nuevo valor no es un operador ni un punto, lo reemplazamos
            } else if (pantalla.value === '0' && valor !== '.' && isNaN(Number(valor))) {
                 pantalla.value += valor;
            } else if (pantalla.value === '0' && valor !== '.') {
                pantalla.value = valor;
            } else {
                // Previene múltiples puntos o múltiples operadores consecutivos al final
                const lastChar = pantalla.value.slice(-1);
                
                // Si el valor actual es un operador y el nuevo valor también lo es, reemplazamos el anterior
                if (['+', '-', '*', '/'].includes(lastChar) && ['+', '*', '/'].includes(valor)) {
                    pantalla.value = pantalla.value.slice(0, -1) + valor;
                    isResultDisplayed = false;
                    return;
                }
                
                // Si la pantalla muestra un resultado, y presionamos un operador, comenzamos a concatenar
                if (isResultDisplayed && ['+', '-', '*', '/'].includes(valor)) {
                    pantalla.value += valor;
                    isResultDisplayed = false;
                    return;
                }
                
                // Si estamos en un resultado y presionamos un número, borramos para empezar de nuevo
                if (isResultDisplayed && !isNaN(Number(valor))) {
                    pantalla.value = valor;
                    isResultDisplayed = false;
                    return;
                }
                
                pantalla.value += valor;
                isResultDisplayed = false;
            }
        }

        // Función para borrar toda la pantalla
        function borrar() {
            pantalla.value = '0';
            isResultDisplayed = false;
        }

        // Función para eliminar el último carácter (BackSpace)
        function eliminar() {
            if (pantalla.value === 'Error' || isResultDisplayed) {
                pantalla.value = '0';
                isResultDisplayed = false;
            } else if (pantalla.value.length === 1) {
                pantalla.value = '0';
            } else {
                pantalla.value = pantalla.value.slice(0, -1);
            }
        }

        // Función para calcular la expresión
        function calcular() {
            try {
                // Usamos una expresión regular para limpiar operadores dobles o incorrectos al final antes de evaluar
                let expression = pantalla.value.replace(/([+\-*/.]{2,})/g, (match) => match.slice(-1));
                
                // Quitamos cualquier operador al final
                expression = expression.replace(/([+\-*/.])$/, '');
                
                // Si la expresión está vacía después de la limpieza, no hacemos nada
                if (expression.length === 0) return;

                // Evaluar la expresión. Esto se usa para calculadoras simples, pero se debe evitar en apps críticas.
                let result = eval(expression);

                // Si el resultado es demasiado largo, se redondea a 10 decimales
                if (result.toString().includes('.') && result.toString().split('.')[1].length > 10) {
                    result = parseFloat(result.toFixed(10));
                }

                pantalla.value = result;
                isResultDisplayed = true;
            } catch (error) {
                pantalla.value = 'Error';
                isResultDisplayed = true;
            }
        }
        
        // Manejo de teclado (opcional, pero mejora la experiencia)
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            
            if (/[0-9]/.test(key) || ['+', '-', '*', '/', '.'].includes(key)) {
                agregar(key);
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault(); // Evita el comportamiento por defecto (e.g., submit)
                calcular();
            } else if (key === 'Backspace') {
                eliminar();
            } else if (key === 'Delete' || key.toLowerCase() === 'c') {
                borrar();
            }
        });