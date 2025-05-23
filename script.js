const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
const headerPlaceholder = document.getElementById("header-placeholder");
const pagePlaceholder = document.getElementById("page-placeholder");
const validLogins = JSON.parse(localStorage.getItem("vpValidLogins")) || [];

function verifyLogin() {
    const login = JSON.parse(localStorage.getItem("vpLogin")) || [];

    if (!login || !login.username || !login.password) return false;

    const userFound = validLogins.some(
        (user) =>
            user.username === login.username && user.password === login.password
    );

    return userFound;
}

if (verifyLogin()) {
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
} else {
    Promise.all([
        fetch("templates/login.html")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar a página de login");
                }
                return response.text();
            })
            .then((data) => {
                document.body.innerHTML = data;
            }),
    ])
        .then(() => {
            loginPage();
        })
        .catch((error) => {
            console.error("Erro:", error);
        });
}

function loginPage() {
    const loginBox = document.querySelector(".login-box");

    loginBox.addEventListener("submit", (e) => {
        e.preventDefault();

        const usernameInput = document.getElementById("user").value.trim();
        const passwordInput = document.getElementById("passwd").value;

        const user = validLogins.find(
            (user) =>
                user.username == usernameInput && user.password == passwordInput
        );

        if (user) {
            let username = user.username;
            let password = user.password;
            const login = { username, password };

            localStorage.setItem("vpLogin", JSON.stringify(login));
            alert("Login realizado com sucesso!");
        } else {
            alert("Usuário ou senha inválidos!");
        }
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function initializeCode() {
    const sidebarBtn = document.querySelector(".menu");
    const headerMenu = document.querySelector("header");
    const sidebar = document.querySelector(".sidebar");
    const sidebarBtns = document.querySelectorAll("#sidebarBtn");
    const username = document.querySelector("username");
    const login = JSON.parse(localStorage.getItem("vpLogin"));
    const pageTitle = document.getElementById("page-title");

    let paginationContainer = document.querySelector(".pagination");

    const rowsPerPage = 5;
    let currentPage = 1;

    const tableOptions = {
        page: currentPage,
        exclude: ["id"],
        actions: [
            {
                label: "Editar",
                class: "btn btn-warning",
                onClick: (item) => alert("Editar: " + item.name),
            },
            {
                label: "Excluir",
                class: "btn btn-danger",
                onClick: (item) => alert("Excluir: " + item.name),
            },
        ],
    };

    var page = document.querySelector(".content");

    username.textContent = login.username;

    function renderTable(options) {
        const tbody = pagePlaceholder.querySelector("table tbody");
        const pageName = pagePlaceholder.querySelector(".content").id;
        const data = JSON.parse(localStorage.getItem("vp" + pageName)) || [];

        if (!data.length) {
            let page = pageName.toLowerCase().slice(0, -1);
            let text =
                page === "venda"
                    ? "Nenhuma venda encontrada."
                    : "Nenhum " + page + " encontrado";
            tbody.innerHTML =
                "<tr><td style='text-align: center;' colspan='99'>" +
                text +
                "</td></tr>";
            return;
        }

        const fields = Object.keys(data[0]).filter(
            (f) => !options.exclude?.includes(f)
        );

        const startIndex = (options.page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const rowsToDisplay = data.slice(startIndex, endIndex);

        tbody.innerHTML = "";

        rowsToDisplay.forEach((item) => {
            const tr = document.createElement("tr");

            fields.forEach((key) => {
                const td = document.createElement("td");
                td.textContent = item[key];
                tr.appendChild(td);
            });

            if (options.actions) {
                const td = document.createElement("td");
                options.actions.forEach((action) => {
                    const btn = document.createElement("button");
                    btn.className = action.class || "btn";
                    btn.textContent = action.label;
                    btn.onclick = () => action.onClick(item);
                    td.appendChild(btn);
                });
                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        });
    }

    function renderPagination() {
        const pageName = pagePlaceholder.querySelector(".content").id;
        const data = JSON.parse(localStorage.getItem("vp" + pageName)) || [];
        const totalPages = Math.ceil(data.length / rowsPerPage);

        paginationContainer.innerHTML = "";

        const prev = document.createElement("button");
        prev.innerHTML = "&laquo;";
        prev.disabled = currentPage === 1;
        prev.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                tableOptions.page = currentPage;
                renderTable(tableOptions);
                renderPagination();
            }
        });
        paginationContainer.appendChild(prev);

        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.textContent = i;
            if (i === currentPage) btn.classList.add("active");
            btn.addEventListener("click", () => {
                currentPage = i;
                tableOptions.page = currentPage;
                renderTable(tableOptions);
                renderPagination();
            });
            paginationContainer.appendChild(btn);
        }

        const next = document.createElement("button");
        next.innerHTML = "&raquo;";
        next.disabled = currentPage === totalPages;
        next.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                tableOptions.page = currentPage;
                renderTable(tableOptions);
                renderPagination();
            }
        });
        paginationContainer.appendChild(next);
    }

    function updateDashboardCard(cardId, valueText) {
        const card = document.getElementById(cardId);
        if(!card) return;

        const text = card.querySelector("p");

        if(text) text.textContent = valueText;
    }

    function updateCountDataDashboards(dataName, pageName) {
        const data = JSON.parse(localStorage.getItem(dataName));
        if(!data) return;
        
        const countDashboards = {
            clientes: "registered",
            vendas: "totalSales"
            //TODO: Insert the remaining dashboard ids
        };

        let value = data.length + " " + pageName;
        updateDashboardCard(countDashboards[pageName.toLowerCase()], value);
    }

    renderTable(tableOptions);
    renderPagination();
    updateCountDataDashboards("vpClientes", pageTitle.textContent);

    function toggleSideBar() {
        sidebar.classList.toggle("hidden");
        headerMenu.classList.toggle("full");
        page.classList.toggle("full");
    }

    function changePage(redPage) {
        fetch("pages/" + redPage + ".html")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error ao carregar a página " + redPage);
                }
                return response.text();
            })
            .then((data) => {
                pagePlaceholder.innerHTML = data;
                requestAnimationFrame(() => {
                    page = document.querySelector(".content");
                    const pTitle = capitalizeFirstLetter(redPage);
                    pageTitle.textContent = pTitle;

                    paginationContainer = document.querySelector(".pagination");
                    tableOptions.page = 1;

                    renderTable(tableOptions);
                    renderPagination();
                    updateCountDataDashboards("vp"+pTitle, pageTitle.textContent);
                });
            });
    }

    function removeCurrActiveBtnClass() {
        sidebarBtns.forEach((btn) => {
            if (btn.classList.contains("active")) {
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

const porPagina = 4;
  let paginaAtual = 1;

  function renderTabelaProdutos() {
    const tbody = document.getElementById('tabela-produtos');
    tbody.innerHTML = '';

    const inicio = (paginaAtual - 1) * porPagina;
    const fim = inicio + porPagina;
    const pagina = produtos.slice(inicio, fim);

    pagina.forEach((p, i) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${p.nome}</td>
        <td>${p.categoria}</td>
        <td>R$ ${p.preco.toFixed(2)}</td>
        <td>${p.estoque}</td>
        <td>
          <button class="btn btn-warning" onclick="editarProduto(${inicio + i})">Editar</button>
          <button class="btn btn-danger" onclick="excluirProduto(${inicio + i})">Excluir</button>
        </td>
      `;
      tbody.appendChild(row);
    });

    renderPaginacaoProdutos();
    atualizarCardsProdutos();
  }

  function renderPaginacaoProdutos() {
    const pag = document.getElementById('paginacao-produtos');
    pag.innerHTML = '';
    const totalPaginas = Math.ceil(produtos.length / porPagina);

    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement('button');
      btn.innerText = i;
      btn.className = (i === paginaAtual) ? 'active' : '';
      btn.onclick = () => {
        paginaAtual = i;
        renderTabelaProdutos();
      };
      pag.appendChild(btn);
    }
  }

  function editarProduto(index) {
    alert("Editar produto: " + produtos[index].nome);
  }

  function excluirProduto(index) {
    if (confirm(`Deseja excluir o produto "${produtos[index].nome}"?`)) {
      produtos.splice(index, 1);
      if ((paginaAtual - 1) * porPagina >= produtos.length) {
        paginaAtual = Math.max(1, paginaAtual - 1);
      }
      renderTabelaProdutos();
    }
  }

  function atualizarCardsProdutos() {
    const total = produtos.length;
    const estoqueTotal = produtos.reduce((sum, p) => sum + p.estoque, 0);
    const valorTotal = produtos.reduce((sum, p) => sum + (p.estoque * p.preco), 0);
    const esgotados = produtos.filter(p => p.estoque === 0).length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('stockCount').textContent = `${estoqueTotal} Unidades`;
    document.getElementById('valueSum').textContent = `R$ ${valorTotal.toFixed(2)}`;
    document.getElementById('outCount').textContent = esgotados;
  }

  renderTabelaProdutos();