        const container = document.getElementById("contenedor-tarjetas");
        const scrollBtn = document.getElementById("scroll-top-btn");
        const themeBtn = document.getElementById("theme-toggle");
        const body = document.body;
        let frases = [];
        let index = 0;

        // Alternar modo claro/oscuro
        themeBtn.onclick = () => {
            const current = body.getAttribute("data-theme");
            body.setAttribute("data-theme", current === "light" ? "dark" : "light");
        };

        // Botón scroll arriba
        window.addEventListener("scroll", () => {
            scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
        });

        scrollBtn.onclick = () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        };

        // Cargar mensajes desde JSON
        async function cargarMensajes() {
            const res = await fetch("mensajes.json");
            frases = await res.json();
            cargarTarjetas();
        }

        // Crear tarjetas con botones accesibles y seguros
        function cargarTarjetas() {
            const limit = frases.length;
            for (; index < limit; index++) {
                const { color, futuro, espanol } = frases[index];
                const card = document.createElement("div");
                card.className = "card";
                card.style.borderColor = color;

                const spanFuturo = document.createElement("span");
                spanFuturo.textContent = futuro;
                spanFuturo.setAttribute("aria-label", "Mensaje del futuro");

                const spanEspanol = document.createElement("span");
                spanEspanol.textContent = espanol;
                spanEspanol.setAttribute("aria-label", "Mensaje en español");

                const botones = document.createElement("div");
                botones.className = "botones-compartir";

                const redes = [
                    { tipo: "telegram", etiqueta: "tg", aria: "Compartir en Telegram" },
                    { tipo: "twitter", etiqueta: "tx", aria: "Compartir en Twitter" },
                    { tipo: "facebook", etiqueta: "fb", aria: "Compartir en Facebook" },
                    { tipo: "descargar", etiqueta: "⭳", aria: "Descargar mensaje" }
                ];

                redes.forEach(({ tipo, etiqueta, aria }) => {
                    const boton = document.createElement("div");
                    boton.className = "boton-social";
                    boton.textContent = etiqueta;
                    boton.title = aria;
                    boton.setAttribute("role", "button");
                    boton.setAttribute("tabindex", "0");
                    boton.setAttribute("aria-label", aria);

                    // Click
                    boton.onclick = () =>
                        compartirEn(tipo, `${futuro}\n${espanol}`);

                    // Teclado (Enter y Space)
                    boton.addEventListener("keydown", (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            compartirEn(tipo, `${futuro}\n${espanol}`);
                        }
                    });

                    botones.appendChild(boton);
                });

                card.append(spanFuturo, spanEspanol, botones);
                container.appendChild(card);
            }
        }

        // Función de compartir o descargar con enlace seguro
        function compartirEn(red, mensaje) {
            const texto = `${mensaje}\n#robotsideas`;
            const encoded = encodeURIComponent(texto);

            const urls = {
                telegram: `https://t.me/share/url?url=${encoded}`,
                twitter: `https://twitter.com/intent/tweet?text=${encoded}`,
                facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`
            };

            if (red === "descargar") {
                const blob = new Blob([texto], { type: "text/plain" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "mensaje-del-futuro.txt";
                link.click();
            } else {
                const enlace = document.createElement("a");
                enlace.href = urls[red];
                enlace.target = "_blank";
                enlace.rel = "noopener";
                document.body.appendChild(enlace);
                enlace.click();
                document.body.removeChild(enlace);
            }
        }

        cargarMensajes();