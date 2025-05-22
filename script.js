const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
const headerPlaceholder = document.getElementById("header-placeholder");
const pagePlaceholder = document.getElementById("page-placeholder");

Promise.all([
    fetch("templates/header.html")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao carregar o cabeçalho");
            }
            return response.text();
        })
        .then((data) => {
            headerPlaceholder.innerHTML = data;
        }),

    fetch("pages/clientes.html")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao carregar a página clientes");
            }
            return response.text();
        })
        .then((data) => {
            pagePlaceholder.innerHTML = data;
        }),

        fetch("pages/vendas.html")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao carregar a página clientes");
            }
            return response.text();
        })
        .then((data) => {
            pagePlaceholder.innerHTML = data;
        }),

    fetch("templates/sidebar.html")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao carregar a sidebar");
            }
            return response.text();
        })
        .then((data) => {
            sidebarPlaceholder.innerHTML = data;
        }),
])
.then(() => {
    initializeCode();
})
.catch((error) => {
    console.error("Erro:", error);
});

function initializeCode() {
    const sidebarBtn = document.querySelector(".menu");
    const headerMenu = document.querySelector("header");
    const sidebar = document.querySelector(".sidebar");
    const sidebarBtns = document.querySelectorAll("#sidebarBtn");
  

    var page = document.querySelector(".content");
    

    function toggleSideBar() {
        sidebar.classList.toggle("hidden");
        headerMenu.classList.toggle("full");
        page.classList.toggle("full");
    }

    function changePage(redPage) {
        fetch("pages/" + redPage + ".html")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar a página " + redPage);
                }
                return response.text();
            })
            .then((data) => {
                pagePlaceholder.innerHTML = data;
                page = document.querySelector(".content");
                const pageTitle = document.getElementById("page-title");
                if (redPage === "clientes") {
                    pageTitle.textContent = "Clientes";
                } else if (redPage === "vendas") {
                    pageTitle.textContent = "Vendas";
                } else if (redPage === "produtos") {
                    pageTitle.textContent = "Produtos";
                }
                else if (redPage === "servicos") {
                    pageTitle.textContent = "Serviços";
                }
                else {
                    pageTitle.textContent = "";
                }
                
            });
    }

    function removeCurrActiveBtnClass()
    {
        sidebarBtns.forEach((btn) => {
            if(btn.classList.contains("active"))
            {
                btn.classList.remove("active");
            }
        });
    }

    sidebarBtn.addEventListener("click", () => {
        toggleSideBar();
    });

    sidebarBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            let redirectPage = btn.getAttribute("redirectPage");
            changePage(redirectPage, btn);

            removeCurrActiveBtnClass();
            btn.classList.add("active");
        });
    });
}

