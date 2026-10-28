
const entrada = document.getElementById("nuevaTarea");
const agregar = document.getElementById("agregar");
const lista = document.getElementById("listaTareas");
const mensaje = document.getElementById("mensaje");

let tareas = [];
let filtro = "todas";

function mostrarTareas() {
    lista.innerHTML = "";

    const visibles = tareas.filter(function (tarea) {
        if (filtro === "pendientes") return !tarea.completada;
        if (filtro === "completadas") return tarea.completada;
        return true;
    });

    visibles.forEach(function (tarea) {
        const elemento = document.createElement("li");
        const texto = document.createElement("span");
        const completar = document.createElement("button");
        const eliminar = document.createElement("button");

        texto.textContent = tarea.texto;
        completar.textContent = tarea.completada ? "↩" : "✓";
        eliminar.textContent = "X";

        if (tarea.completada) {
            texto.style.textDecoration = "line-through";
        }

        completar.addEventListener("click", function () {
            tarea.completada = !tarea.completada;
            mostrarTareas();
        });

        eliminar.addEventListener("click", function () {
            tareas = tareas.filter(function (item) {
                return item.id !== tarea.id;
            });

            mostrarTareas();
        });

        elemento.append(texto, completar, eliminar);
        lista.appendChild(elemento);
    });
}

agregar.addEventListener("click", function () {
    const texto = entrada.value.trim();

    tareas.push({
        id: Date.now(),
        texto: texto,
        completada: false
    });

    entrada.value = "";
    mostrarTareas();
});

document.querySelectorAll("[data-filtro]").forEach(function (boton) {
    boton.addEventListener("click", function () {
        filtro = boton.dataset.filtro;
        mostrarTareas();
    });
});

mostrarTareas();
