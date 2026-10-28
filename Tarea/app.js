const entrada = document.getElementById("nuevaTarea");
const agregar = document.getElementById("agregar");
const lista = document.getElementById("listaTareas");
const mensaje = document.getElementById("mensaje");
const botonesFiltro = document.querySelectorAll("[data-filtro]");

let tareas = [];
let filtro = "todas";
let tareaEliminada = null;

function mostrarMensaje(texto, permitirDeshacer = false) {
    mensaje.replaceChildren();
    mensaje.appendChild(document.createTextNode(texto + " "));

    if (permitirDeshacer && tareaEliminada) {
        const deshacer = document.createElement("button");
        deshacer.textContent = "Deshacer";
        deshacer.type = "button";

        deshacer.addEventListener("click", function () {
            if (!tareaEliminada) return;

            tareas.push(tareaEliminada);
            tareaEliminada = null;

            mostrarTareas();
            mostrarMensaje("Tarea recuperada correctamente.");
        });

        mensaje.appendChild(deshacer);
    }
}

function actualizarFiltros() {
    botonesFiltro.forEach(function (boton) {
        const tipo = boton.dataset.filtro;

        boton.classList.toggle("activo", tipo === filtro);
        boton.setAttribute("aria-pressed", String(tipo === filtro));

        if (tipo === "pendientes") {
            boton.textContent = `Pendientes (${tareas.filter(t => !t.completada).length})`;
        } else if (tipo === "completadas") {
            boton.textContent = `Completadas (${tareas.filter(t => t.completada).length})`;
        } else {
            boton.textContent = `Todas (${tareas.length})`;
        }
    });
}

function mostrarTareas() {
    lista.innerHTML = "";

    const visibles = tareas.filter(function (tarea) {
        if (filtro === "pendientes") return !tarea.completada;
        if (filtro === "completadas") return tarea.completada;
        return true;
    });

    if (visibles.length === 0) {
        const vacio = document.createElement("li");
        const texto = document.createElement("span");

        texto.textContent = tareas.length === 0
            ? "Todavía no tienes tareas. ¡Agrega la primera!"
            : "No hay tareas en esta categoría.";

        vacio.appendChild(texto);
        lista.appendChild(vacio);
    }

    visibles.forEach(function (tarea) {
        const elemento = document.createElement("li");
        const texto = document.createElement("span");
        const completar = document.createElement("button");
        const eliminar = document.createElement("button");

        texto.textContent = tarea.texto;

        completar.textContent = tarea.completada ? "↩" : "✓";
        completar.type = "button";
        completar.setAttribute(
            "aria-label",
            tarea.completada
                ? `Marcar ${tarea.texto} como pendiente`
                : `Completar ${tarea.texto}`
        );

        eliminar.textContent = "Eliminar";
        eliminar.type = "button";
        eliminar.setAttribute("aria-label", `Eliminar ${tarea.texto}`);

        if (tarea.completada) {
            texto.style.textDecoration = "line-through";
            texto.style.color = "#a1a1aa";
        }

        completar.addEventListener("click", function () {
            tarea.completada = !tarea.completada;

            mostrarTareas();
            mostrarMensaje(
                tarea.completada
                    ? "Tarea completada."
                    : "Tarea marcada como pendiente."
            );
        });

        eliminar.addEventListener("click", function () {
            tareaEliminada = tarea;
            tareas = tareas.filter(item => item.id !== tarea.id);

            mostrarTareas();
            mostrarMensaje("Tarea eliminada.", true);
        });

        elemento.append(texto, completar, eliminar);
        lista.appendChild(elemento);
    });

    actualizarFiltros();
}

function agregarTarea() {
    const texto = entrada.value.trim();

    if (texto === "") {
        mostrarMensaje("Escribe una tarea antes de agregarla.");
        entrada.focus();
        return;
    }

    tareas.push({
        id: Date.now(),
        texto: texto,
        completada: false
    });

    entrada.value = "";
    filtro = "todas";

    mostrarTareas();
    mostrarMensaje("Tarea agregada correctamente.");
    entrada.focus();
}

agregar.addEventListener("click", agregarTarea);

entrada.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter") {
        agregarTarea();
    }
});

botonesFiltro.forEach(function (boton) {
    boton.addEventListener("click", function () {
        filtro = boton.dataset.filtro;
        mostrarTareas();
    });
});

mostrarTareas();
