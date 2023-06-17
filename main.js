let plataformaActual = ""; 

const nombreArchivo = window.location.pathname.split("/").pop(); 
if (nombreArchivo === "nes.html") {
plataformaActual = "NES";
} else if (nombreArchivo === "sega.html") {
plataformaActual = "SEGA";
}



function generarListaJuegos(juegos) {
    const lista = document.getElementById("lista-juegos");
    lista.innerHTML = "";

    const juegosPlataforma = juegos.filter(
        (juego) => juego.plataforma === plataformaActual
    ); 

    if (juegosPlataforma.length > 0) {
        juegosPlataforma.forEach((juego) => {
            const item = document.createElement("div");
            item.classList.add("card");

            item.innerHTML = `
            <div class="card-body">
            <h5 class="card-title">${juego.nombre}</h5>
            <p class="card-text"><strong>Fecha de creación:</strong> ${juego.fecha_creacion}</p>
            <p class="card-text">${juego.descripcion}</p>
            </div>`;
            lista.appendChild(item);
        });
    } else {
        lista.innerHTML = `<p>No existen juegos de ${plataformaActual}.</p>`; 
    }
}


let juegosNES = [];

function cargarJuegos() {
    fetch("juegos.json")
        .then((response) => response.json())
        .then((data) => {
            juegosNES = data.filter((juego) => juego.plataforma === plataformaActual);
            generarListaJuegos(juegosNES);
        })
        .catch((error) => {
            console.log("Error al cargar los juegos:", error);
        });
}


let juegosFiltrados = [];

function filtrarJuegosPorNombre(nombre) {
    juegosFiltrados = juegosNES.filter(juego =>
        juego.nombre.toLowerCase().includes(nombre.toLowerCase())
    );

    if (juegosFiltrados.length === 0) {
        const lista = document.getElementById("lista-juegos");
        lista.innerHTML = "<p>No existen juegos con ese nombre.</p>";
    } else {
        generarListaJuegos(juegosFiltrados);
    }
}

const restablecerBtn = document.getElementById("restablecer-btn");
restablecerBtn.addEventListener("click", () => {
    generarListaJuegos(juegosNES);
});

function ordenarJuegos(orden) {
    const juegosOrdenados = [...juegosNES];

    if (orden === "nuevo") {
        juegosOrdenados.sort(
            (a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion)
        );
    } else if (orden === "alfabetico") {
        juegosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    generarListaJuegos(juegosOrdenados);
}

const buscador = document.getElementById("buscador");
buscador.addEventListener("input", (event) => {
    const nombre = event.target.value;
    if (nombre.length >= 3) {
        filtrarJuegosPorNombre(nombre);
    }
});

const ordenDesplegable = document.getElementById("orden-desplegable");
ordenDesplegable.addEventListener("change", (event) => {
    const orden = event.target.value;
    ordenarJuegos(orden);
});

cargarJuegos()