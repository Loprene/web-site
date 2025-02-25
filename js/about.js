let currentPage = 1;
const totalPages = 4;

document.addEventListener("DOMContentLoaded", () => {
    updatePages();

    // Ajouter un écouteur d'événements sur chaque page
    document.querySelectorAll(".page").forEach(page => {
        page.addEventListener("click", (event) => {
            const pageWidth = page.offsetWidth;
            const clickX = event.offsetX;

            if (clickX < pageWidth / 2) {
                turnLeft(); // Clic à gauche → Page précédente
            } else {
                turnRight(); // Clic à droite → Page suivante
            }
        });
    });
});

function turnLeft() {
    if (currentPage > 1) {
        currentPage--;
        updatePages();
    }
}

function turnRight() {
    if (currentPage < totalPages) {
        currentPage++;
        updatePages();
    }
}

function updatePages() {
    document.querySelectorAll(".page").forEach((page, index) => {
        if (index + 1 === currentPage || index + 1 === currentPage + 1) {
            page.classList.remove("hidden");
        } else {
            page.classList.add("hidden");
        }
    });
}

