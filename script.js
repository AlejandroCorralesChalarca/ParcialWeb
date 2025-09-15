const buscarPorTipo = () => {
    const tipo = document.getElementById("tipo").value.trim().toLowerCase();
    const contenedor = document.getElementById("lista");
    contenedor.innerHTML = "";

    if (!tipo) {
        contenedor.innerHTML = "<p>⚠️ Escribe un tipo de Pokémon (ejemplo: fire, water, grass).</p>";
        return;
    }

    const url = `https://pokeapi.co/api/v2/type/${tipo}`;

    axios.get(url)
        .then(res => {
            const pokemons = res.data.pokemon;
            if (!pokemons || pokemons.length === 0) {
                contenedor.innerHTML = "<p>❌ No se encontraron Pokémon de ese tipo.</p>";
                return;
            }

            pokemons.forEach(entry => {
                const nombre = entry.pokemon.name;
                const pokeUrl = `https://pokeapi.co/api/v2/pokemon/${nombre}`;

                axios.get(pokeUrl)
                    .then(pokeRes => {
                        const data = pokeRes.data;
                        const imagen = data.sprites.front_default;

                        const div = document.createElement("div");
                        div.classList.add("pokemon");
                        div.innerHTML = `
                            <img src="${imagen}" alt="${nombre}" style="cursor:pointer;">
                            <p>${nombre.charAt(0).toUpperCase() + nombre.slice(1)}</p>
                        `;

                        // Evento de clic en la imagen -> mostrar stats
                        div.querySelector("img").addEventListener("click", () => {
                            mostrarStats(data);
                        });

                        contenedor.appendChild(div);
                    })
                    .catch(err => console.error(`Error cargando ${nombre}:`, err));
            });
        })
        .catch(err => {
            console.error(err);
            contenedor.innerHTML = "<p>❌ Tipo de Pokémon inválido.</p>";
        });
};

// Función para mostrar stats del Pokémon
const mostrarStats = (pokemon) => {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    modal.innerHTML = `
        <div class="modal-content">
            <span class="cerrar">&times;</span>
            <h2>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p><b>Nivel Base:</b> ${pokemon.base_experience}</p>
            <h3>Stats:</h3>
            <ul>
                ${pokemon.stats.map(stat => `<li><b>${stat.stat.name}:</b> ${stat.base_stat}</li>`).join("")}
            </ul>
        </div>
    `;

    document.body.appendChild(modal);

    // Evento cerrar
    modal.querySelector(".cerrar").addEventListener("click", () => {
        modal.remove();
    });

    // Cerrar si hace clic fuera del contenido
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.remove();
    });
};
