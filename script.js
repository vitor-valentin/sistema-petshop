const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
const headerPlaceholder = document.getElementById("header-placeholder");
const pagePlaceholder = document.getElementById("page-placeholder");
const validLogins = JSON.parse(localStorage.getItem("vpLogins")) || [];
const formularioClientes = document.querySelector('#formulario-cliente');

function verifyLogin() {
    const login = JSON.parse(localStorage.getItem("vpLogin")) || null;

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
            console.error(`Erro: ${error}`);
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
            console.error(`Erro: ${error}`);
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

            //TODO: Add success message.
            location.reload();
        } else {
            alert("Usuário ou senha inválidos!");
        }
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getClientNameById(id) {
    const clientes = JSON.parse(localStorage.getItem("vpClientes"));
    const cliente = clientes.find((c) => c.id === id);
    return cliente ? cliente.name : false;
}

function formatReal(value) {
    return value.toLocaleString('pt-BR', { style: "currency", currency: "BRL" });
}

function initializeCode() {
    const sidebarBtn = document.querySelector(".menu");
    const headerMenu = document.querySelector("header");
    const sidebar = document.querySelector(".sidebar");
    const sidebarBtns = document.querySelectorAll("#sidebarBtn");
    const username = document.querySelector("username");
    const login = JSON.parse(localStorage.getItem("vpValidLogins"));
    const pageTitle = document.getElementById("page-title");
    const vendaDetails = document.querySelector(".vendas-details");
    const closeBtn = vendaDetails.querySelector(".close-btn");

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
                onClick: (item) => alert("Editar: " + item.id),
            },
            {
                label: "Excluir",
                class: "btn btn-danger",
                onClick: (item) => alert("Excluir: " + item.id),
            },
        ],
    };

    var page = document.querySelector(".content");

    username.textContent = login.username;

    function retrieveVendaData(type, id) {
        if(type === "Serviços") type = "Servicos";
        const data = JSON.parse(localStorage.getItem(`vp${type}`)).find(c => c.id === id);
        return data;
    }

    function renderVendaDetails(dataArray, type) {
        if(type === "Servicos") type = "Serviços";
        const detailsTbody = vendaDetails.querySelector("tbody");
        const detailsTypeName = vendaDetails.querySelector("detailsName");
        
        detailsTypeName.textContent = type;
        detailsTbody.innerHTML = "";

        Object.keys(dataArray).forEach(key => {
            const tr = document.createElement("tr");
            const innerData = retrieveVendaData(type, dataArray[key].id);
            
            Object.keys(innerData).forEach(innerKey => {
                if(innerKey != "id"){
                    const td = document.createElement("td");
                    
                    if(innerKey === "price") {
                        td.textContent = formatReal(innerData[innerKey]);
                    }else {
                        td.textContent = innerData[innerKey];
                    }
                    tr.appendChild(td);
                }
            });

            detailsTbody.appendChild(tr);
        });
    }

    function showVendaDetails(id, type) {
        const typeData = type === "products" ? "Produtos" : "Servicos";
        let data = JSON.parse(localStorage.getItem(`vpVendas`)).find(c => c.id === id);
        data = type === "products" ? data.products : data.services;
        
        if(!data) return;
        
        renderVendaDetails(data, typeData);
        vendaDetails.classList.add("showing");
    }

    function renderTable(options) {
        const tbody = pagePlaceholder.querySelector("table tbody");
        const pageName = pagePlaceholder.querySelector(".content").id;
        const data = JSON.parse(localStorage.getItem(`vp${pageName}`)) || [];

        if (!data.length) {
            let page = pageName.toLowerCase().slice(0, -1);
            let text =
                page === "venda"
                    ? "Nenhuma venda encontrada."
                    : `Nenhum ${page} encontrado.`;
            tbody.innerHTML =
                `<tr><td style='text-align: center;' colspan='99'> ${text} </td></tr>`;
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

                if (pageName === "Vendas" && key === "idCliente") {
                    td.textContent = getClientNameById(item[key]);
                }else if (pageName === "Vendas" && (key === "products" || key === "services")) {
                    const btn = document.createElement("button");

                    if (Object.keys(item[key]).length > 0){
                        btn.textContent = "Detalhes";
                    } else {
                        btn.textContent = "Nenhum";
                        btn.setAttribute("disabled","disabled");
                    }
                    
                    btn.className = "btn btn-info";
                    btn.id = key;
                    btn.onclick = () => showVendaDetails(item.id, key);
                    td.appendChild(btn);
                }else if (key === "price" || key === "totalValue") { 
                    td.textContent = formatReal(item[key]);
                } else {
                    td.textContent = item[key];
                }

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
        const data = JSON.parse(localStorage.getItem(`vp${pageName}`)) || [];
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
        if (!card) return;

        const text = card.querySelector("p");

        if (text) text.textContent = valueText;
    }

    function updateCountDataDashboards(dataName, pageName) {
        const data = JSON.parse(localStorage.getItem(dataName));
        if (!data) return;

        const countDashboards = {
            clientes: "registered",
            vendas: "totalSales",
            //TODO: Insert the remaining dashboard ids
        };

        let value = `${data.length} ${pageName}`;
        updateDashboardCard(countDashboards[pageName.toLowerCase()], value);
    }

    function isCurrentMonth(dateString, birthday = true) {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const [day, month, year] = dateString.split("/");

        return parseInt(month, 10) === currentMonth;
    }

    function countBirthdays() {
        const data = JSON.parse(localStorage.getItem("vpClientes")) || [];
        if (!data) return;

        let amountBirthdays = 0;

        data.forEach((item) => {
            if (isCurrentMonth(item.birthDate)) amountBirthdays++;
        });

        return amountBirthdays;
    }

    function monthBuyers() {
        const sales = JSON.parse(localStorage.getItem("vpVendas")) || [];
        if (!sales) return;

        let buyersId = [];

        sales.forEach((item) => {
            if (
                !buyersId.includes(item.idCliente) &&
                isCurrentMonth(item.soldDate, false)
            ) {
                buyersId.push(item.idCliente);
            }
        });

        return buyersId.length;
    }

    function updateSectionCards(pTitle) {
        updateCountDataDashboards("vp" + pTitle, pageTitle.textContent);

        switch (pTitle) {
            case "Clientes":
                updateDashboardCard(
                    "birthdays",
                    `${countBirthdays()} Este Mês`
                );
                updateDashboardCard("bought", `${monthBuyers()} Este Mês`);
                break;
        }
    }

    renderTable(tableOptions);
    renderPagination();
    updateSectionCards("Clientes");

    function toggleSideBar() {
        sidebar.classList.toggle("hidden");
        headerMenu.classList.toggle("full");
        page.classList.toggle("full");
    }

    function changePage(redPage) {
        fetch("pages/" + redPage + ".html")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error ao carregar a página ${redPage}`);
                }
                return response.text();
            })
            .then((data) => {
                pagePlaceholder.innerHTML = data;
                requestAnimationFrame(() => {
                    page = document.querySelector(".content");
                    var pTitle = capitalizeFirstLetter(redPage);
                    if (redPage === "servicos") {
                        pTitle = "Serviços";
                    }
                    pageTitle.textContent = pTitle;

                    paginationContainer = document.querySelector(".pagination");
                    tableOptions.page = 1;

                    renderTable(tableOptions);
                    renderPagination();
                    updateSectionCards(pTitle);
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

    closeBtn.addEventListener("click", () => {
        vendaDetails.classList.remove("showing");
    });
}

  function atualizarIndicadores() {
    const linhas = document.querySelectorAll("table tbody tr");
    let totalProdutos = linhas.length;
    let estoqueTotal = 0;
    let valorTotalEstoque = 0;
    let produtosEsgotados = 0;

    linhas.forEach(linha => {
      const precoTexto = linha.children[1].textContent.trim(); // R$ 15,00
      const estoqueTexto = linha.children[4].textContent.trim(); // 2

      const preco = parseFloat(precoTexto.replace("R$", "").replace(",", "."));
      const estoque = parseInt(estoqueTexto);

      if (estoque === 0) produtosEsgotados++;

      estoqueTotal += estoque;
      valorTotalEstoque += preco * estoque;
    });

    
    document.querySelector("#produtos-cadastrados").textContent = totalProdutos;
    document.querySelector("#estoque-total").textContent = estoqueTotal + " Unidades";
    document.querySelector("#valor-total-estoque").textContent = "R$ " + valorTotalEstoque.toFixed(2).replace(".", ",");
    document.querySelector("#produtos-esgotados").textContent = produtosEsgotados;
  }

     
     function mostrarFormulario() {
        const botaoAdicionar = document.getElementById("botaoAdicionarCliente");
        document.getElementById("tableContent").setAttribute("hidden");
        botaoAdicionar.addEventListener("click", function () {
            formularioClientes.removeAttribute("hidden");
    });
    }

    function confirmarCadastro() {
      // Obter valores
      const nome = document.getElementById("nome").value;
      const cpf = document.getElementById("cpf").value;
      const email = document.getElementById("email").value;
      const telefone = document.getElementById("telefone").value;
      const genero = document.getElementById("genero").value;
      const dataNascimento = document.getElementById("dataNascimento").value;

      if (!nome || !cpf || !email || !telefone || !genero || !dataNascimento) {
        alert("Preencha todos os campos.");
        return;
      }

      // Adicionar à tabela
      const tabela = document.getElementById("tabela-clientes").querySelector("tbody");
      const novaLinha = document.createElement("tr");

      novaLinha.innerHTML = `
        <td>${nome}</td>
        <td>${cpf}</td>
        <td>${email}</td>
        <td>${telefone}</td>
        <td>${genero}</td>
        <td>${dataNascimento}</td>
      `;

      tabela.appendChild(novaLinha);

      // Limpar formulário
      document.getElementById("nome").value = "";
      document.getElementById("cpf").value = "";
      document.getElementById("email").value = "";
      document.getElementById("telefone").value = "";
      document.getElementById("genero").value = "";
      document.getElementById("dataNascimento").value = "";

      // Voltar para lista
      document.getElementById("formulario-cliente").classList.add("hidden");
      document.getElementById("lista-clientes").classList.remove("hidden");
    }