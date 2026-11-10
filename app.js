var pantallaOperacion = document.getElementById("operacion"); 
var pantallaNumero = document.getElementById("numero"); 
 
var numeroActual = ""; 
var numeroAnterior = ""; 
 
var operadorElegido = null; 
var empezarNuevo = false; 
var contextoAudio = null;

function reproducirSonido(tipo){
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext){
        return;
    }

    if (!contextoAudio){
        contextoAudio = new AudioContext();
    }
    if (contextoAudio.state === "suspended"){
        contextoAudio.resume();
    }

    var oscilador = contextoAudio.createOscillator();
    var ganancia = contextoAudio.createGain();
    var frecuencia = tipo === "numero" ? 390 : tipo === "operador" ? 520 : tipo === "igual" ? 740 : 610;
    oscilador.type = tipo === "igual" ? "triangle" : "sine";
    oscilador.frequency.value = frecuencia;
    ganancia.gain.setValueAtTime(0.08, contextoAudio.currentTime);
    ganancia.gain.exponentialRampToValueAtTime(0.001, contextoAudio.currentTime + 0.08);
    oscilador.connect(ganancia);
    ganancia.connect(contextoAudio.destination);
    oscilador.start();
    oscilador.stop(contextoAudio.currentTime + 0.08);
}
 
function actualizarPantalla(){ 
    if (numeroActual === ""){ 
        pantallaNumero.textContent = "0"; 
    }else{ 
        pantallaNumero.textContent = numeroActual; 
    } 
 
    if (pantallaOperacion.textContent === ""){ 
        pantallaOperacion.textContent = "0"; 
    } 
} 
 
function escribirNumero(digito){ 
    if (empezarNuevo === true){ 
        numeroActual = ""; 
        empezarNuevo = false; 
    } 
    
    if (numeroActual.length >= 12){ 
    return;  
} 
 
if (numeroActual === "0" && digito === "0"){ 
    return; 
} 
 
if (numeroActual === "0" && digito !== "0"){ 
    numeroActual = digito; 
 }else { 
    numeroActual = numeroActual + digito; 
 
} 
 
actualizarPantalla(); 
} 
 
function escribirPunto(){ 
    if (empezarNuevo === true){ 
        numeroActual = "0"; 
    empezarNuevo = false; 
    } 
 
    if (numeroActual.includes(".")){ 
    return; 
 
    } 
 
    if (numeroActual === ""){ 
    numeroActual = "0."; 
    }else{ 
    numeroActual = numeroActual + "."; 
    } 
 
    actualizarPantalla(); 
} 
 
function elegirOperador(operador){ 
    if (numeroActual === "" && numeroAnterior === ""){ 
        return; 
    } 
 
    if (numeroActual === "" && numeroAnterior !== "" && operadorElegido !== null){ 
        calcularResultado(); 
    } 
 
    if (numeroActual !== ""){ 
        numeroAnterior = numeroActual; 
    } 
 
    operadorElegido = operador; 
 
    numeroActual = ""; 
    empezarNuevo = false 
 
    resaltarOperador(operador); 
 
    var simbolo = obtenerSimbolo(operador); 
    pantallaOperacion.textContent = numeroAnterior + " " + simbolo; 
 
    actualizarPantalla(); 
} 
 
function calcularResultado(){ 
    if (numeroAnterior === "" || numeroActual === "" || operadorElegido === null){ 
        return; 
    } 
 
    var numA = parseFloat(numeroAnterior); 
    var numB = parseFloat(numeroActual); 
 
    var resultado; 
 
    var simbolo = obtenerSimbolo(operadorElegido); 
    pantallaOperacion.textContent = numA + " " + simbolo + " " + numB + " ="; 
     
    if (operadorElegido === "+"){ 
        resultado = numA + numB; 
    } 
 
    if (operadorElegido === "-"){ 
        resultado = numA - numB; 
    } 
 
    if (operadorElegido === "*"){ 
        resultado = numA * numB; 
    } 
 
    if (operadorElegido === "/"){ 
        if (numB === 0){ 
            mostrarError("No se puede dividir entre cero"); 
            return; 
        } 
        resultado = numA / numB; 
    } 
    resultado = parseFloat(resultado.toPrecision(10)); 
 
    numeroActual = resultado.toString(); 
 
    numeroAnterior = ""; 
    operadorElegido = null; 
 
    empezarNuevo = true; 
 
    /*quitarResaltadoOperadores();*/
 
    animarResultado(); 
 
    actualizarPantalla(); 
} 
 
function limpiarTodo(){ 
    numeroActual = ""; 
    numeroAnterior = ""; 
    operadorElegido = null; 
    empezarNuevo = false; 
 
    pantallaOperacion.textContent = 0; 
 
    quitarResaltadoOperadores(); 
    actualizarPantalla(); 
} 
 
function borrarUltimo(){ 
    if (empezarNuevo === true){ 
        return; 
    } 
 
    numeroActual = numeroActual.slice(0, -1); 
 
    actualizarPantalla(); 
} 
 
function cambiarSigno(){ 
    if (numeroActual === ""|| numeroActual === "0"){ 
        return 
    } 
    if (numeroActual.startsWith("-")){ 
        numeroActual = numeroActual.slice(1); 
    }else{ 
        numeroActual = "-" + numeroActual; 
    } 
    actualizarPantalla(); 
} 
 
function calcularPorcentaje(){ 
    if (numeroActual === ""){ 
        return; 
    } 
    var num = parseFloat(numeroActual); 
    var resultado = num / 100; 
 
    pantallaOperacion.textContent = num + "%"; 
    numeroActual = resultado.toString(); 
 
    actualizarPantalla(); 
} 
 
function calcularRaiz(){ 
    if (numeroActual === ""){ 
        return; 
    } 
    var numero = parseFloat(numeroActual); 
     
    if (numero < 0){ 
        mostrarError("el error: Raiz de negativo"); 
            return; 
        } 
var resultado = Math.sqrt(numero); 
 
pantallaOperacion.textContent = "√" + numero; 
numeroActual = parseFloat(resultado.toPrecision(10)).toString(); 
 
animarResultado(); 
actualizarPantalla(); 
} 
 
function calcularCuadrado(){ 
    if (numeroActual === ""){ 
        return; 
    } 
 
    var numero = parseFloat(numeroActual); 
    var resultado = Math.pow(numero,2); 
 
    pantallaOperacion.textContent = "(" + numero + ")²"; 
    numeroActual = parseFloat(resultado.toPrecision(12)).toString(); 
 
    animarResultado(); 
    actualizarPantalla(); 
} 
 
function calcularInverso(){ 
    if (numeroActual === ""){ 
        return; 
    } 
 
    var numero = parseFloat(numeroActual); 
 
    if (numero <= 0){ 
        mostrarError("error:log de <= 0"); 
        return; 
    } 
 
    var resultado = Math.log2(numero); 
 
    pantallaOperacion.textContent = "log(" + numero + ")"; 
    numeroActual = parseFloat(resultado.toPrecision(10)).toString(); 
 
    animarResultado(); 
    actualizarPantalla(); 
}

function obtenerSimbolo(operador){
    if (operador === "+") return "+";
    if (operador === "-") return "-";
    if (operador === "*") return "x";
    if (operador === "/") return "/";
    return operador
}

function resaltarOperador(operador){
    quitarResaltadoOperadores();
    var botones = {"+": "btn-sumar", "-": "btn-restar", "*": "btn-multiplicar", "/": "btn-dividir"};
    var boton = document.getElementById(botones[operador]);
    if (boton){
        boton.classList.add("activo");
    }
}

function quitarResaltadoOperadores(){
    document.querySelectorAll(".btn-operador, #btn-restar, #btn-multiplicar, #btn-dividir").forEach(function(boton){
        boton.classList.remove("activo");
    });
}

function iluminarBoton(id){
    var boton = document.getElementById(id);
    if (!boton){
        return;
    }
    boton.classList.add("pulsado");
    setTimeout(function(){ boton.classList.remove("pulsado"); }, 100);
}

document.querySelectorAll(".btn").forEach(function(boton){
    boton.addEventListener("click", function(){
        var esNumero = /^btn-[0-9]$/.test(boton.id);
        var esOperador = boton.classList.contains("btn-operador") || boton.id === "btn-restar" || boton.id === "btn-multiplicar" || boton.id === "btn-dividir";
        var tipo = esNumero ? "numero" : boton.id === "btn-igual" ? "igual" : esOperador ? "operador" : "simbolo";
        reproducirSonido(tipo);
    });
});

document.getElementById("btn-limpiar").addEventListener("click", limpiarTodo);

document.addEventListener("keydown", function(evento){
    var tecla = evento.key;
    if (/^[0-9]$/.test(tecla)){
        reproducirSonido("numero");
        escribirNumero(tecla);
        iluminarBoton("btn-" + tecla);
    }

    if (tecla === ".") { reproducirSonido("simbolo"); escribirPunto(); iluminarBoton("btn-punto"); }
    if (tecla === "+") { reproducirSonido("operador"); elegirOperador("+"); iluminarBoton("btn-sumar"); }
    if (tecla === "-") { reproducirSonido("operador"); elegirOperador("-"); iluminarBoton("btn-restar"); }
    if (tecla === "*") { reproducirSonido("operador"); elegirOperador("*"); iluminarBoton("btn-multiplicar"); }
    if (tecla ==="/") {
        evento.preventDefault();
        reproducirSonido("operador");
        elegirOperador("/");
        iluminarBoton("btn-dividir");
    }

    if (tecla === "Enter" || tecla === "="){
        evento.preventDefault();
        reproducirSonido("igual");
        calcularResultado();
        iluminarBoton("btn-igual");
    }

    if (tecla === "Backspace"){
        reproducirSonido("simbolo");
        borrarUltimo();
        iluminarBoton("btn-borrar");
    }

    
    if (tecla === "Escape"){
        reproducirSonido("simbolo");
        limpiarTodo();
        iluminarBoton("btn-limpiar");
    }

});
function animarResultado(){
    pantallaNumero.classList.add("animar");
    setTimeout(function(){
        pantallaNumero.classList.remove("animar");

    }, 150);
}

actualizarPantalla();



