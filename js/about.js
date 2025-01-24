let currentPage = 1;
const totalPages = 4;

document.addEventListener("DOMContentLoaded", () => {
    const leftButton = document.createElement("button");
    leftButton.innerText = "Précédent";
    leftButton.classList.add("nav-button", "left");
    leftButton.addEventListener("click", turnLeft);

    const rightButton = document.createElement("button");
    rightButton.innerText = "Suivant";
    rightButton.classList.add("nav-button", "right");
    rightButton.addEventListener("click", turnRight);

    document.body.appendChild(leftButton);
    document.body.appendChild(rightButton);

    updatePages();
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
