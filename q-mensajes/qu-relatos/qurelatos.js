const scrollBtn = document.getElementById("scroll-top-btn");
        // Botón scroll arriba
        window.addEventListener("scroll", () => {
            scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
        });

        scrollBtn.onclick = () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        };