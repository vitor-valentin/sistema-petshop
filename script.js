const sidebarPlaceholder = document.getElementById("sidebar-placeholder");
const headerPlaceholder = document.getElementById("header-placeholder");
const pagePlaceholder = document.getElementById("page-placeholder");

function validLogins() {
    return JSON.parse(localStorage.getItem("vpValidLogins")) || [];
}

function login() {
    return JSON.parse(localStorage.getItem("vpLogin")) || [];
}

function getUrlParams() {
    return new URLSearchParams(window.location.href);
}

function getUrlWithoutParameters() {
    const url = new URL(window.location.href);
    return url.origin + url.pathname;
}

function verifyLogin() {
    if (!login() || !login().username || !login().password) return false;

    const userFound = validLogins().some(
        (user) =>
            user.username === login().username &&
            user.password === login().password
    );

    return userFound;
}

function loadSite() {
    const headerPromise = fetch("templates/header.html")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao carregar o cabeçalho");
            }
            return response.text();
        })
        .then((data) => {
            headerPlaceholder.innerHTML = data;
        });

    let pagePromise, sidebarPromise;

    if (getUrlParams().has(`${getUrlWithoutParameters()}?controlPanel`)) {
        pagePromise = fetch("pages/usuarios.html")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar a página usuarios");
                }
                return response.text();
            })
            .then((data) => {
                pagePlaceholder.innerHTML = data;
            });

        sidebarPromise = fetch("templates/sidebar.controlpanel.html")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        "Erro ao carregar a sidebar do painel de controle"
                    );
                }
                return response.text();
            })
            .then((data) => {
                sidebarPlaceholder.innerHTML = data;
            });
    } else {
        pagePromise = fetch("pages/clientes.html")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar a página clientes");
                }
                return response.text();
            })
            .then((data) => {
                pagePlaceholder.innerHTML = data;
            });

        sidebarPromise = fetch("templates/sidebar.html")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar a sidebar");
                }
                return response.text();
            })
            .then((data) => {
                sidebarPlaceholder.innerHTML = data;
            });
    }

    // Espera todos os fetches antes de continuar
    return Promise.all([headerPromise, pagePromise, sidebarPromise]);
}

if (verifyLogin()) {
    Promise.all([loadSite()])
        .then(() => {
            requestAnimationFrame(() => {
                initializeCode();
            });
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

        const user = validLogins().find(
            (user) =>
                user.username == usernameInput && user.password == passwordInput
        );

        if (user) {
            let loginId = user.id;
            let username = user.username;
            let password = user.password;
            const login = { loginId, username, password };

            localStorage.setItem("vpLogin", JSON.stringify(login));

            showPopup("Login realizado com sucesso!", "success", 1000);
            setTimeout(() => {
                location.reload();
            }, 1000);
        } else {
            showPopup("Usuário ou senha inválidos!", "failure", 2000);
        }
    });
}

function logout() {
    localStorage.setItem("vpLogin", JSON.stringify([]));
    location.reload();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getClientNameById(id) {
    const clientes = JSON.parse(localStorage.getItem("vpClientes"));
    const cliente = clientes.find((c) => c.id === id);
    return cliente ? cliente.name : false;
}

function getPetNameById(id) {
    const pets = JSON.parse(localStorage.getItem("vpPets"));
    const pet = pets.find((p) => p.id === id);
    return pet ? pet.name : false;
}

function formatReal(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function isValidCPF(cpf) {
    const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    return regex.test(cpf);
}

function isValidDate(dateStr) {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;

    const [day, month, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    const isValid =
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;

    if (!isValid) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
}

function isValidMoney(value) {
    const clean =
        typeof value === "string"
            ? value.replace("R$", "").replace(",", ".").trim()
            : value;
    const parsed = parseFloat(clean);
    return !isNaN(parsed) && parsed > 0;
}

function showPopup(message, type = "success", duration = 4000) {
    const container = document.getElementById("popup-container");

    const popup = document.createElement("div");
    popup.classList.add("popup", type);
    popup.textContent = message;

    const progressBar = document.createElement("div");
    progressBar.classList.add("progress-bar");
    popup.appendChild(progressBar);

    container.appendChild(popup);

    progressBar.style.animation = `shrink ${duration}ms linear forwards`;

    setTimeout(() => {
        popup.style.opacity = "0";
        popup.style.transition = "opacity 0.5s ease";

        setTimeout(() => {
            container.removeChild(popup);
        }, 500);
    }, duration);
}

function showConfirm({
    message = "Are you sure?",
    acceptText = "Yes",
    cancelText = "No",
} = {}) {
    return new Promise((resolve) => {
        const overlay = document.getElementById("confirm-overlay");
        const messageDiv = document.getElementById("confirm-message");
        const acceptBtn = overlay.querySelector(".confirm-btn.accept");
        const cancelBtn = overlay.querySelector(".confirm-btn.cancel");

        messageDiv.textContent = message;
        acceptBtn.textContent = acceptText;
        cancelBtn.textContent = cancelText;

        overlay.style.display = "flex";

        function cleanUp() {
            acceptBtn.removeEventListener("click", onAccept);
            cancelBtn.removeEventListener("click", onCancel);
            overlay.style.display = "none";
        }

        function onAccept() {
            cleanUp();
            resolve(true);
        }

        function onCancel() {
            cleanUp();
            resolve(false);
        }

        acceptBtn.addEventListener("click", onAccept);
        cancelBtn.addEventListener("click", onCancel);
    });
}

function permissionLevelTranscript(level) {
    if (level === 1) return "Parcial";
    else return "Total";
}

function initializeCode() {
    const sidebarBtn = document.querySelector(".menu");
    const headerMenu = document.querySelector("header");
    const username = document.querySelector("username");
    const pageTitle = document.getElementById("page-title");
    const vendaDetails = document.querySelector(".vendas-details");
    const closeBtn = vendaDetails.querySelector(".close-btn");
    const userConfigOpenBtn = document.querySelector(".user i");
    const controlPanelBtn = document.getElementById("controlPanel");

    var sidebar = document.querySelector(".sidebar");
    var sidebarBtns = document.querySelectorAll("#sidebarBtn");

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
                onClick: (item) => {
                    const entityName = pagePlaceholder
                        .querySelector(".content")
                        ?.id?.toLowerCase();
                    if (entityName) {
                        openFormPage(entityName, "Editar", item);
                    } else {
                        console.warn("Entidade não identificada!");
                    }
                },
            },
            {
                label: "Excluir",
                class: "btn btn-danger",
                onClick: (item) => deleteRegister(item.id),
            },
        ],
    };

    var page = document.querySelector(".content");

    username.textContent = login().username;

    renderTable(tableOptions);
    renderPagination();

    if (getUrlParams().has(`${getUrlWithoutParameters()}?controlPanel`)) {
        pageTitle.textContent = "Usuarios";
        updateSectionCards("Usuarios");
    } else {
        pageTitle.textContent = "Clientes";
        updateSectionCards("Clientes");
    }

    responsiveWindow();

    checkPermissionLevel();

    function responsiveWindow() {
        if (window.innerWidth < 980) {
            console.log("oi");
            if (!sidebar.classList.contains("hidden")) toggleSideBar();
            headerMenu.classList.add("full");
            pagePlaceholder.querySelector(".content").classList.add("full");
            headerPlaceholder.querySelector(".user p")?.remove();
            pageTitle.style.textAlign = "center";
        }
    }

    function toggleConfigBoxUser() {
        const configBox = document.querySelector(".config-box");
        configBox.classList.toggle("open");
    }

    function retrieveVendaData(type, id) {
        if (type === "Serviços") type = "Servicos";
        const data = JSON.parse(localStorage.getItem(`vp${type}`)).find(
            (c) => c.id === id
        );
        return data;
    }

    function renderVendaDetails(dataArray, type) {
        if (type === "Servicos") type = "Serviços";
        const detailsTbody = vendaDetails.querySelector("tbody");
        const detailsTypeName = vendaDetails.querySelector("detailsName");

        detailsTypeName.textContent = type;
        detailsTbody.innerHTML = "";

        let count = 0;

        Object.keys(dataArray).forEach((key) => {
            const tr = document.createElement("tr");
            const innerData = retrieveVendaData(type, dataArray[key].id);

            Object.keys(innerData).forEach((innerKey) => {
                if (innerKey != "id") {
                    const td = document.createElement("td");

                    if (innerKey === "price") {
                        td.textContent = formatReal(innerData[innerKey]);
                    } else if (innerKey === "stock") {
                        td.textContent = dataArray[count].amount;
                    } else {
                        td.textContent = innerData[innerKey];
                    }
                    tr.appendChild(td);
                }
            });

            count++;
            detailsTbody.appendChild(tr);
        });
    }

    function showVendaDetails(id, type) {
        const typeData = type === "products" ? "Produtos" : "Servicos";
        let data = JSON.parse(localStorage.getItem(`vpVendas`)).find(
            (c) => c.id === id
        );
        data = type === "products" ? data.products : data.services;

        if (!data) return;

        renderVendaDetails(data, typeData);
        vendaDetails.classList.add("showing");
    }

    function renderTable(options) {
        const tbody = pagePlaceholder.querySelector("table tbody");
        const pageName = pagePlaceholder.querySelector(".content").id;
        var data = JSON.parse(localStorage.getItem(`vp${pageName}`)) || [];

        if (pageName === "Usuarios") {
            data = JSON.parse(localStorage.getItem("vpValidLogins"));
        }

        if (pageName === "Produtos") {
            const activeStyle = document.getElementById("activeStyle");

            activeStyle.innerHTML = "";
        }

        if (!data.length) {
            let page = pageName.toLowerCase().slice(0, -1);
            let text =
                page === "venda"
                    ? "Nenhuma venda encontrada."
                    : `Nenhum ${page} encontrado.`;
            tbody.innerHTML = `<tr><td style='text-align: center;' colspan='99'> ${text} </td></tr>`;
            return;
        }

        const fields = Object.keys(data[0]).filter(
            (f) => !options.exclude?.includes(f)
        );

        const startIndex = (options.page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const rowsToDisplay = data.slice(startIndex, endIndex);

        const fieldsName = {
            name: "Nome",
            phone: "Telefone",
            email: "E-mail",
            gender: "Sexo",
            birthDate: "Data de Nascimento",
            idCliente: "Cliente",
            idPet: "Pet",
            soldDate: "Data de Venda",
            products: "Produtos",
            services: "Serviços",
            totalValue: "Total",
            price: "Preço",
            brand: "Marca",
            amount: "Quantidade",
            stock: "Estoque",
            cpf: "CPF",
            age: "Idade",
            race: "Raça",
            roleId: "Nível de Permissão",
            username: "Nome",
        };

        tbody.innerHTML = "";

        let i = 1;

        rowsToDisplay.forEach((item) => {
            const tr = document.createElement("tr");

            fields.forEach((key) => {
                const td = document.createElement("td");
                td.setAttribute("data-label", fieldsName[key]);
                if (pageName === "Usuarios" && key === "password") return;

                if (key === "idCliente") {
                    td.textContent = getClientNameById(item[key]);
                } else if (key === "roleId") {
                    const firstTd = document.createElement("td");
                    firstTd.setAttribute("data-label", "Cargo");

                    var [cargo, permissionLvl] = getCargoAndPermissionLvlById(
                        item.id
                    );
                    permissionLvl = permissionLevelTranscript(permissionLvl);

                    firstTd.textContent = cargo;
                    tr.appendChild(firstTd);

                    td.textContent = permissionLvl;
                } else if (pageName === "Produtos" && key === "stock") {
                    td.textContent = item[key];

                    if (item[key] < 1) {
                        activeStyle.innerHTML += `tbody tr:nth-child(${i}) td:first-child:before {content: "! "; color: red; font-size: 24px;} tbody tr:nth-child(${i}) {background-color: #ffdddd !important;} tbody tr:nth-child(${i}):hover {background-color: #f5c2c2 !important;}`;
                    } else if (item[key] < 5) {
                        activeStyle.innerHTML += `tbody tr:nth-child(${i}) td:first-child:before {content: "! "; color: #ffc107; font-size: 24px;} tbody tr:nth-child(${i}) {background-color: #fbecdb !important;} tbody tr:nth-child(${i}):hover {background-color: #f5dfc7 !important;}`;
                    }
                } else if (key === "idPet") {
                    td.textContent = getPetNameById(item[key]);
                } else if (
                    pageName === "Vendas" &&
                    (key === "products" || key === "services")
                ) {
                    const btn = document.createElement("button");

                    if (Object.keys(item[key]).length > 0) {
                        btn.textContent = "Detalhes";
                    } else {
                        btn.textContent = "Nenhum";
                        btn.setAttribute("disabled", "disabled");
                    }

                    btn.className = "btn btn-info";
                    btn.id = key;
                    btn.onclick = () => showVendaDetails(item.id, key);
                    td.appendChild(btn);
                } else if (pageName === "Pets" && key === "age") {
                    let text = item[key] > 1 ? " Anos" : " Ano";
                    td.textContent = item[key] + text;
                } else if (key === "price" || key === "totalValue") {
                    td.textContent = formatReal(item[key]);
                } else {
                    td.textContent = item[key];
                }

                tr.appendChild(td);
            });

            if (options.actions) {
                const td = document.createElement("td");
                td.setAttribute("data-label", "Ações");
                options.actions.forEach((action) => {
                    const btn = document.createElement("button");
                    let dark = "";
                    if (pageName === "Usuarios" || pageName === "Cargos")
                        dark = "dark";
                    btn.className = `${action.class} ${dark}` || "btn";
                    btn.textContent = action.label;
                    btn.onclick = () => action.onClick(item);
                    td.appendChild(btn);
                });
                tr.appendChild(td);
            }

            tbody.appendChild(tr);
            i++;
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
        var data = JSON.parse(localStorage.getItem(dataName));
        if (pageName === "Usuarios")
            data = JSON.parse(localStorage.getItem("vpValidLogins"));
        if (!data) return;

        const countDashboards = {
            clientes: "registered",
            vendas: "totalSales",
            produtos: "totalProducts",
            servicos: "totalServices",
            pets: "registeredPets",
            usuarios: "registeredUsers",
        };

        let value = `${data.length} ${pageName}`;
        updateDashboardCard(countDashboards[pageName.toLowerCase()], value);
    }

    function isCurrentMonth(dateString, birthday = true) {
        const currentMonth = new Date().getMonth() + 1;
        const [day, month, year] = dateString.split("/");

        return parseInt(month, 10) === currentMonth;
    }

    function countBirthdays() {
        const data = JSON.parse(localStorage.getItem("vpClientes")) || [];

        let amountBirthdays = 0;

        data.forEach((item) => {
            if (isCurrentMonth(item.birthDate)) amountBirthdays++;
        });

        return amountBirthdays;
    }

    function monthBuyers(allowDuplicate = false) {
        const sales = JSON.parse(localStorage.getItem("vpVendas")) || [];

        let buyersId = [];

        sales.forEach((item) => {
            if (
                (!buyersId.includes(item.idCliente) || allowDuplicate) &&
                isCurrentMonth(item.soldDate, false)
            ) {
                buyersId.push(item.idCliente);
            }
        });

        return buyersId.length;
    }

    function valueSales() {
        const data = JSON.parse(localStorage.getItem("vpVendas"));
        let totalValue = 0;
        let monthValue = 0;

        Object.keys(data).forEach((key) => {
            if (isCurrentMonth(data[key].soldDate, false))
                monthValue += data[key].totalValue;
            totalValue += data[key].totalValue;
        });

        return [totalValue, monthValue];
    }

    function countTotalStockAndValue() {
        const products = JSON.parse(localStorage.getItem("vpProdutos")) || [];
        let totalStock = 0;
        let totalStockValue = 0;
        let outOfStock = 0;

        products.forEach((product) => {
            if (product.stock == 0) outOfStock++;
            totalStock += parseInt(product.stock);
            totalStockValue += product.stock * product.price;
        });

        return [totalStock, totalStockValue, outOfStock];
    }

    function calcServicesRealizedAndValue() {
        const sales = JSON.parse(localStorage.getItem("vpVendas"));
        const services = JSON.parse(localStorage.getItem("vpServicos"));

        let totalValueServices = 0;
        let realizedServicesMonth = 0;
        let monthServicesValue = 0;

        sales.forEach((sale) => {
            const servicesSale = sale.services;

            Object.keys(servicesSale).forEach((key) => {
                let saleService = services.filter(
                    (s) => s.id === servicesSale[key].id
                )[0];

                totalValueServices += saleService.price;
                if (isCurrentMonth(sale.soldDate, false)) {
                    monthServicesValue += saleService.price;
                    realizedServicesMonth++;
                }
            });
        });

        return [totalValueServices, realizedServicesMonth, monthServicesValue];
    }

    function updateSectionCards(pTitle) {
        updateCountDataDashboards(`vp${pTitle}`, pTitle);

        switch (pTitle) {
            case "Clientes":
                updateDashboardCard(
                    "birthdays",
                    `${countBirthdays()} Este Mês`
                );
                updateDashboardCard("bought", `${monthBuyers()} Este Mês`);
                break;
            case "Vendas":
                const [totalSalesValue, monthSalesValue] = valueSales();
                updateDashboardCard(
                    "monthSales",
                    `${monthBuyers(true)} Este Mês`
                );
                updateDashboardCard("salesValue", formatReal(totalSalesValue));
                updateDashboardCard(
                    "monthSalesValue",
                    formatReal(monthSalesValue)
                );
                break;
            case "Produtos":
                const [totalStock, stockValue, outOfStock] =
                    countTotalStockAndValue();
                updateDashboardCard("totalStock", `${totalStock} Unidade(s)`);
                updateDashboardCard("totalValue", formatReal(stockValue));
                updateDashboardCard("outOfStock", `${outOfStock} Produto(s)`);
                break;
            case "Servicos":
                const [totalValue, realizedMonth, monthValue] =
                    calcServicesRealizedAndValue();
                updateDashboardCard("serviceRevenue", formatReal(totalValue));
                updateDashboardCard(
                    "monthServices",
                    `${realizedMonth} Este Mês`
                );
                updateDashboardCard(
                    "monthServiceRevenue",
                    `${formatReal(monthValue)} Este Mês`
                );
                break;
            case "Pets":
                const mediumPetsClients =
                    Math.round(calcMediumPetsClients() * 100) / 100;
                updateDashboardCard(
                    "mediumPetsClients",
                    `${mediumPetsClients} Pet(s)`
                );
                break;
        }
    }

    function calcMediumPetsClients() {
        const pets = JSON.parse(localStorage.getItem("vpPets"));
        const clients = JSON.parse(localStorage.getItem("vpClientes"));

        var medium = pets.length / clients.length;
        return medium;
    }

    function toggleSideBar() {
        sidebar.classList.toggle("hidden");
        if (window.innerWidth > 980) headerMenu.classList.toggle("full");
        page.classList.toggle("full");
    }

    window.changePage = function (redPage) {
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
                    currentPage = 1;

                    if (sidebar.classList.contains("hidden"))
                        page.classList.add("full");

                    renderTable(tableOptions);
                    renderPagination();
                    updateSectionCards(capitalizeFirstLetter(redPage));

                    responsiveWindow();
                });
            });
    };

    function removeCurrActiveBtnClass() {
        sidebarBtns.forEach((btn) => {
            if (btn.classList.contains("active")) {
                btn.classList.remove("active");
            }
        });
    }

    function submitFormLogic(entityKey, form, dataEdited) {
        if (!form) return;

        const dataForm = new FormData(form);
        const data = Object.fromEntries(dataForm.entries());

        if (entityKey === "vendas") {
            try {
                data.idPet = parseInt(data.idPet);
                data.idCliente = parseInt(data.idCliente);
                data.products = data.products ? JSON.parse(data.products) : {};
                data.services = data.services ? JSON.parse(data.services) : {};
                data.totalValue = parseFloat(
                    data.totalValue.replace("R$", "").replace(",", ".").trim()
                );

                if (!data.soldDate) {
                    const today = new Date();
                    data.soldDate = `${String(today.getDate()).padStart(
                        2,
                        "0"
                    )}/${String(today.getMonth() + 1).padStart(
                        2,
                        "0"
                    )}/${today.getFullYear()}`;
                }

                const products =
                    JSON.parse(localStorage.getItem("vpProdutos")) || [];

                const editId = form.getAttribute("data-edit-id");

                if (data.products) {
                    const previousSale = editId
                        ? (
                              JSON.parse(localStorage.getItem("vpVendas")) || []
                          ).find((v) => v.id == editId)
                        : null;

                    for (const key in data.products) {
                        const item = data.products[key];
                        const product = products.find((p) => p.id == item.id);
                        if (!product) continue;

                        const newAmount = parseInt(item.amount);
                        let previousAmount = 0;

                        if (previousSale && previousSale.products) {
                            const previousEntry = Object.values(
                                previousSale.products
                            ).find((p) => p.id == item.id);
                            if (previousEntry)
                                previousAmount = parseInt(previousEntry.amount);
                        }

                        const diff = newAmount - previousAmount;

                        if (diff > 0 && product.stock < diff) {
                            showPopup(
                                `Estoque insuficiente para o produto: ${product.name}`,
                                "failure",
                                2000
                            );
                            return;
                        }

                        product.stock -= diff;
                    }

                    localStorage.setItem(
                        "vpProdutos",
                        JSON.stringify(products)
                    );
                }

                localStorage.setItem("vpProdutos", JSON.stringify(products));
            } catch (e) {
                console.log(e);
                showPopup("Erro ao processar dados da venda.", "failure", 2000);
                return;
            }
        }

        if (data.cpf && !isValidCPF(data.cpf)) {
            showPopup("CPF Inválido!", "failure", 2000);
            return;
        }

        if (
            (data.birthDate || data.soldDate) &&
            !isValidDate(data.birthDate || data.soldDate)
        ) {
            showPopup(
                "Data inválida. Use o formato dd/mm/aaaa.",
                "failure",
                2000
            );
            return;
        }

        if (
            (data.price || data.totalValue) &&
            !isValidMoney(data.price || data.totalValue)
        ) {
            showPopup(
                "Informe um valor monetário válido maior que R$ 0,00.",
                "failure",
                2000
            );
            return;
        }

        const editId = form.getAttribute("data-edit-id");
        var storageKey = `vp${capitalizeFirstLetter(entityKey)}`;
        if (entityKey === "usuarios") storageKey = "vpValidLogins";
        let registers = JSON.parse(localStorage.getItem(storageKey)) || [];

        if (data.price)
            data.price = parseFloat(
                data.price
                    .replace("R$", "")
                    .replace(/\s/g, "")
                    .replace(",", ".")
            );
        if (data.totalValue) data.totalValue = parseFloat(data.totalValue);
        if (data.idCliente) data.idCliente = parseInt(data.idCliente);
        if (data.roleId) data.roleId = parseInt(data.roleId);

        if (entityKey == "vendas") delete data.nomeCliente;
        if (entityKey == "vendas") delete data.nomePet;

        if (editId) {
            const index = registers.findIndex((item) => item.id == editId);
            if (index !== -1) {
                registers[index] = { ...registers[index], ...data };
            }
        } else {
            const newId = registers.length
                ? Math.max(...registers.map((r) => r.id)) + 1
                : 1;
            registers.push({ id: newId, ...data });
        }

        localStorage.setItem(storageKey, JSON.stringify(registers));
        showPopup(
            `${capitalizeFirstLetter(entityKey)} salvo com sucesso!`,
            "success",
            2000
        );

        if (entityKey === "usuarios") {
            const findLogin = validLogins().filter(
                (vl) =>
                    data.username === vl.username &&
                    data.password === vl.password
            )[0];
            if (findLogin.id === login().loginId) {
                localStorage.setItem(
                    "vpLogin",
                    JSON.stringify({
                        loginId: login().loginId,
                        username: data.username,
                        password: data.password,
                    })
                );
            }
        }

        if (!dataEdited) {
            form.reset();

            if (entityKey === "vendas") {
                document.getElementById("product-list").innerHTML = "";
                document.getElementById("service-list").innerHTML = "";
                document.getElementById("totalValue").value = formatReal(0);
            } else if (entityKey === "vendas" || entityKey === "pets") {
                document.getElementById("idCliente").value = "";
            }
        }
    }

    function deleteRegister(id) {
        const entityName = pagePlaceholder
            .querySelector(".content")
            ?.id?.toLowerCase();
        if (!entityName) {
            console.warn("Entidade não identificada.");
            return;
        }

        const storageKey = `vp${capitalizeFirstLetter(entityName)}`;
        let registers = JSON.parse(localStorage.getItem(storageKey));

        showConfirm({
            message: "Tem certeza que deseja excluir este registros?",
            acceptText: "Sim",
            cancelText: "Não",
        }).then((confirmed) => {
            if (!confirmed) return;

            registers = registers.filter((item) => item.id !== id);
            localStorage.setItem(storageKey, JSON.stringify(registers));

            showPopup("Registro excluído com sucesso!", "success", "1000");
            renderTable(tableOptions);
            renderPagination();
        });
    }

    function applyInputMasks() {
        const cpfInput = document.querySelector('[name="cpf"]');
        const phoneInput = document.querySelector('[name="phone"]');
        const dateInput = document.querySelector(
            '[name="birthDate"], [name="soldDate"]'
        );
        const moneyInputs = document.querySelectorAll(
            '[name="price"], [name="totalValue"]'
        );

        if (cpfInput) {
            cpfInput.addEventListener("input", (e) => {
                let digits = cpfInput.value.replace(/\D/g, "").slice(0, 11);
                cpfInput.value = digits
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d)/, "$1.$2")
                    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            });
        }

        if (phoneInput) {
            phoneInput.addEventListener("input", () => {
                let digits = phoneInput.value.replace(/\D/g, "").slice(0, 11);
                phoneInput.value = digits
                    .replace(/(\d{2})(\d)/, "($1) $2")
                    .replace(/(\d{5})(\d{1,4})$/, "$1-$2");
            });
        }

        if (dateInput) {
            dateInput.addEventListener("input", () => {
                let digits = dateInput.value.replace(/\D/g, "").slice(0, 8);
                dateInput.value = digits
                    .replace(/(\d{2})(\d)/, "$1/$2")
                    .replace(/(\d{2})(\d{1,4})$/, "$1/$2");
            });
        }

        moneyInputs.forEach((input) => {
            input.addEventListener("input", () => {
                let value = input.value.replace(/\D/g, "").slice(0, 10);

                if (value.length < 3) {
                    value = value.padStart(3, "0");
                }

                let numeric = parseFloat(value) / 100;
                input.value = "R$ " + numeric.toFixed(2).replace(".", ",");
            });

            input.addEventListener("focus", () => {
                if (!input.value.startsWith("R$")) {
                    input.value = "R$ 0,00";
                }
            });
        });
    }

    function checkPermissionLevel() {
        const cargos = JSON.parse(localStorage.getItem("vpCargos"));

        const loginInfo = validLogins().filter(
            (vl) =>
                vl.username === login().username &&
                vl.password === login().password
        )[0];

        const permissionLvl = cargos.filter((c) => c.id === loginInfo.roleId)[0]
            .permissionLevel;

        if (permissionLvl < 2) {
            const controlPanel = document.getElementById("controlPanel");
            controlPanel.remove();
        }
    }

    function getCargoAndPermissionLvlById(id) {
        const cargos = JSON.parse(localStorage.getItem("vpCargos"));
        const roleId = validLogins().filter((vl) => vl.id === id)[0].roleId;
        const userCargo = cargos.filter((c) => c.id === roleId)[0];

        return [userCargo.name, userCargo.permissionLevel];
    }

    function enforceStockLimit(qtyInput, selectInput) {
        const produtos = JSON.parse(localStorage.getItem("vpProdutos")) || [];
        const selectedProductId = parseInt(selectInput.value);
        const produto = produtos.find((p) => p.id == selectedProductId);
        if (!produto) return;

        const estoque = parseInt(produto.stock) || 0;

        if (parseInt(qtyInput.value) > estoque) {
            qtyInput.value = estoque;
        }
    }

    function initVendaForm(dataToEdit = null) {
        const clientes = JSON.parse(localStorage.getItem("vpClientes")) || [];
        const produtos = JSON.parse(localStorage.getItem("vpProdutos")) || [];
        const servicos = JSON.parse(localStorage.getItem("vpServicos")) || [];
        const allPets = JSON.parse(localStorage.getItem("vpPets")) || [];
        var pets = allPets;

        const idClienteInput = document.getElementById("idCliente");
        const suggestionsBox = document.getElementById("client-suggestions");
        const totalValueInput = document.getElementById("totalValue");
        const idPetInput = document.getElementById("idPet");
        const petSuggestionsBox = document.getElementById("pet-suggestions");
        let selectedCliente = null;
        let selectedPet = null;
        let selectedProdutos = [];
        let selectedServicos = [];

        function updateTotal() {
            let total = 0;
            selectedProdutos.forEach((item) => {
                const produto = produtos.find((p) => p.id == item.idProduct);
                if (produto) total += produto.price * item.amount;
            });
            selectedServicos.forEach((item) => {
                const servico = servicos.find((s) => s.id == item.idService);
                if (servico) total += servico.price;
            });
            totalValueInput.value = formatReal(total);
        }

        function addVendaHiddenInputs(form) {
            const clienteId = idClienteInput.getAttribute("data-id");
            const petId = idPetInput.getAttribute("data-id");
            if (
                !clienteId ||
                !selectedCliente ||
                idClienteInput.value !==
                    `${selectedCliente.name} (${selectedCliente.cpf})`
            ) {
                showPopup("Selecione um cliente válido.", "failure", 2000);
                return null;
            }

            if (
                !petId ||
                !selectedPet ||
                idPetInput.value !== `${selectedPet.name}` ||
                selectedPet.idCliente != selectedCliente.id
            ) {
                showPopup("Selecione um pet válido.", "failure", 2000);
                return null;
            }

            ["idPet", "idCliente", "products", "services"].forEach((name) => {
                const existing = form.querySelector(`input[name="${name}"]`);
                if (existing) existing.remove();
            });

            const hiddenPet = document.createElement("input");
            hiddenPet.type = "hidden";
            hiddenPet.name = "idPet";
            hiddenPet.value = petId;
            form.appendChild(hiddenPet);

            const hiddenCliente = document.createElement("input");
            hiddenCliente.type = "hidden";
            hiddenCliente.name = "idCliente";
            hiddenCliente.value = clienteId;
            form.appendChild(hiddenCliente);

            const hiddenProducts = document.createElement("input");
            hiddenProducts.type = "hidden";
            hiddenProducts.name = "products";
            hiddenProducts.value = JSON.stringify(
                Object.fromEntries(
                    selectedProdutos.map((p, i) => [
                        i,
                        { id: p.idProduct, amount: p.amount },
                    ])
                )
            );
            form.appendChild(hiddenProducts);

            const hiddenServices = document.createElement("input");
            hiddenServices.type = "hidden";
            hiddenServices.name = "services";
            hiddenServices.value = JSON.stringify(
                Object.fromEntries(
                    selectedServicos.map((s, i) => [i, { id: s.idService }])
                )
            );
            form.appendChild(hiddenServices);

            return true;
        }

        idClienteInput.addEventListener("input", () => {
            const query = idClienteInput.value.toLowerCase();
            suggestionsBox.innerHTML = "";
            if (!query) {
                suggestionsBox.style.display = "none";
                return;
            }

            const matches = clientes.filter((c) => {
                const cleanedQuery = query.trim().toLowerCase();
                const nameMatch = c.name.toLowerCase().includes(cleanedQuery);
                const cleanedCpfQuery = cleanedQuery.replace(/\D/g, "");
                const cpfMatch = cleanedCpfQuery
                    ? c.cpf.replace(/\D/g, "").includes(cleanedCpfQuery)
                    : false;
                return nameMatch || cpfMatch;
            });

            matches.forEach((c) => {
                const li = document.createElement("li");
                li.textContent = `${c.name} (${c.cpf})`;
                li.addEventListener("click", () => {
                    selectedCliente = c;
                    idClienteInput.value = `${c.name} (${c.cpf})`;
                    idClienteInput.setAttribute("data-id", c.id);
                    suggestionsBox.style.display = "none";

                    selectedPet = null;
                    idPetInput.value = "";
                    idPetInput.removeAttribute("data-id");

                    pets = allPets;
                    pets = pets.filter((p) => {
                        return p.idCliente === c.id;
                    });
                });
                suggestionsBox.appendChild(li);
            });

            suggestionsBox.style.display = matches.length ? "block" : "none";
        });

        idPetInput.addEventListener("input", () => {
            const query = idPetInput.value.toLowerCase();
            petSuggestionsBox.innerHTML = "";
            if (!query) {
                petSuggestionsBox.style.display = "none";
                return;
            }

            const matches = pets.filter((c) => {
                const cleanedQuery = query.trim().toLowerCase();
                const nameMatch = c.name.toLowerCase().includes(cleanedQuery);
                return nameMatch;
            });

            matches.forEach((p) => {
                const li = document.createElement("li");
                li.textContent = `${p.name}`;
                li.addEventListener("click", () => {
                    selectedPet = p;
                    idPetInput.value = `${p.name}`;
                    idPetInput.setAttribute("data-id", p.id);
                    petSuggestionsBox.style.display = "none";

                    let c = clientes.find((c) => c.id === p.idCliente);
                    selectedCliente = c;
                    idClienteInput.value = `${c.name} (${c.cpf})`;
                    idClienteInput.setAttribute("data-id", c.id);
                });
                petSuggestionsBox.appendChild(li);
            });

            petSuggestionsBox.style.display = matches.length ? "block" : "none";
        });

        document.addEventListener("click", (e) => {
            if (
                !suggestionsBox.contains(e.target) &&
                e.target !== idClienteInput
            ) {
                suggestionsBox.style.display = "none";
            }

            if (
                !petSuggestionsBox.contains(e.target) &&
                e.target !== idPetInput
            ) {
                petSuggestionsBox.style.display = "none";
            }
        });

        window.addProduto = function (id = null, qtd = 1) {
            const container = document.createElement("div");
            container.className = "dynamic-item";

            const select = document.createElement("select");
            produtos.forEach((p) => {
                if (p.stock > 0) {
                    const opt = document.createElement("option");
                    opt.value = p.id;
                    opt.textContent = `${p.name} - ${formatReal(
                        p.price
                    )} (Estoque: ${p.stock})`;
                    if (id && p.id == id) opt.selected = true;
                    select.appendChild(opt);
                }
            });

            if (select.options.length === 0) {
                showPopup(
                    "Nenhum produto com estoque disponível.",
                    "failure",
                    2000
                );
                return;
            }

            const qty = document.createElement("input");
            qty.type = "number";
            qty.min = 1;
            qty.value = qtd || 1;
            qty.addEventListener("input", () => {
                if (qty.value < 1) qty.value = 1;
                enforceStockLimit(qty, select);
            });

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.textContent = "🗑";
            removeBtn.className = "btn btn-danger";
            removeBtn.onclick = () => {
                container.remove();
                selectedProdutos = selectedProdutos.filter(
                    (i) => i.element !== container
                );
                updateTotal();
            };

            container.append(select, qty, removeBtn);
            document.getElementById("product-list").appendChild(container);

            const item = {
                element: container,
                get idProduct() {
                    return parseInt(select.value);
                },
                get amount() {
                    return parseInt(qty.value);
                },
            };

            [select, qty].forEach((el) =>
                el.addEventListener("input", updateTotal)
            );
            selectedProdutos.push(item);
            updateTotal();
        };

        window.addServico = function (id = null) {
            const container = document.createElement("div");
            container.className = "dynamic-item";

            const select = document.createElement("select");
            servicos.forEach((s) => {
                const opt = document.createElement("option");
                opt.value = s.id;
                opt.textContent = `${s.name} - ${formatReal(s.price)}`;
                if (id && s.id == id) opt.selected = true;
                select.appendChild(opt);
            });

            const removeBtn = document.createElement("button");
            removeBtn.type = "button";
            removeBtn.textContent = "🗑";
            removeBtn.className = "btn btn-danger";
            removeBtn.onclick = () => {
                container.remove();
                selectedServicos = selectedServicos.filter(
                    (i) => i.element !== container
                );
                updateTotal();
            };

            container.append(select, removeBtn);
            document.getElementById("service-list").appendChild(container);

            const item = {
                element: container,
                get idService() {
                    return parseInt(select.value);
                },
            };

            select.addEventListener("change", updateTotal);
            selectedServicos.push(item);
            updateTotal();
        };

        if (dataToEdit) {
            const pet = pets.find((p) => p.id == dataToEdit.idPet);
            if (pet) {
                selectedPet = pet;
                idPetInput.value = `${pet.name}`;
                idPetInput.setAttribute("data-id", pet.id);
            }

            pets = pets.filter((p) => {
                return p.idCliente === dataToEdit.idCliente;
            });

            const cliente = clientes.find((c) => c.id == dataToEdit.idCliente);
            if (cliente) {
                selectedCliente = cliente;
                idClienteInput.value = `${cliente.name} (${cliente.cpf})`;
                idClienteInput.setAttribute("data-id", cliente.id);
            }

            if (dataToEdit.products) {
                const produtosObj =
                    typeof dataToEdit.products === "string"
                        ? JSON.parse(dataToEdit.products)
                        : dataToEdit.products;

                Object.values(produtosObj).forEach((p) => {
                    addProduto(p.id, p.amount);
                });
            }

            if (dataToEdit.services) {
                const servicosObj =
                    typeof dataToEdit.services === "string"
                        ? JSON.parse(dataToEdit.services)
                        : dataToEdit.services;

                Object.values(servicosObj).forEach((s) => {
                    addServico(s.id);
                });
            }

            document.getElementById("soldDate").value = dataToEdit.soldDate;
            document.getElementById("totalValue").value = formatReal(
                dataToEdit.totalValue || 0
            );
        }

        const form = document.getElementById("data-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const isValid = addVendaHiddenInputs(form);
            if (!isValid) return;

            submitFormLogic("vendas", form, dataToEdit ? true : false);
        });
    }

    function initPetsForm(dataToEdit = null) {
        const clientes = JSON.parse(localStorage.getItem("vpClientes")) || [];
        const idClienteInput = document.getElementById("idCliente");
        const suggestionsBox = document.getElementById("client-suggestions");
        let selectedCliente = null;

        function addVendaHiddenInputs(form) {
            const clienteId = idClienteInput.getAttribute("data-id");
            if (
                !clienteId ||
                !selectedCliente ||
                idClienteInput.value !==
                    `${selectedCliente.name} (${selectedCliente.cpf})`
            ) {
                showPopup("Selecione um cliente válido.", "failure", 2000);
                return null;
            }

            const existingInput = form.querySelector('input[name="idCliente"]');
            if (existingInput) existingInput.remove();

            const hiddenCliente = document.createElement("input");
            hiddenCliente.type = "hidden";
            hiddenCliente.name = "idCliente";
            hiddenCliente.value = clienteId;
            form.appendChild(hiddenCliente);

            return true;
        }

        idClienteInput.addEventListener("input", () => {
            const query = idClienteInput.value.toLowerCase();
            suggestionsBox.innerHTML = "";
            if (!query) {
                suggestionsBox.style.display = "none";
                return;
            }

            const matches = clientes.filter((c) => {
                const cleanedQuery = query.trim().toLowerCase();
                const nameMatch = c.name.toLowerCase().includes(cleanedQuery);
                const cleanedCpfQuery = cleanedQuery.replace(/\D/g, "");
                const cpfMatch = cleanedCpfQuery
                    ? c.cpf.replace(/\D/g, "").includes(cleanedCpfQuery)
                    : false;
                return nameMatch || cpfMatch;
            });

            matches.forEach((c) => {
                const li = document.createElement("li");
                li.textContent = `${c.name} (${c.cpf})`;
                li.addEventListener("click", () => {
                    selectedCliente = c;
                    idClienteInput.value = `${c.name} (${c.cpf})`;
                    idClienteInput.setAttribute("data-id", c.id);
                    suggestionsBox.style.display = "none";
                });
                suggestionsBox.appendChild(li);
            });

            suggestionsBox.style.display = matches.length ? "block" : "none";
        });

        document.addEventListener("click", (e) => {
            if (
                !suggestionsBox.contains(e.target) &&
                e.target !== idClienteInput
            ) {
                suggestionsBox.style.display = "none";
            }
        });

        if (dataToEdit) {
            const cliente = clientes.find((c) => c.id == dataToEdit.idCliente);
            if (cliente) {
                selectedCliente = cliente;
                idClienteInput.value = `${cliente.name} (${cliente.cpf})`;
                idClienteInput.setAttribute("data-id", cliente.id);
            }
        }

        const form = document.getElementById("data-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const isValid = addVendaHiddenInputs(form);
            if (!isValid) return;

            submitFormLogic("pets", form, dataToEdit ? true : false);
        });
    }

    function initUsersForm(dataToEdit = null) {
        const cargos = JSON.parse(localStorage.getItem("vpCargos")) || [];
        const selectForm = document.getElementById("roleId");

        cargos.forEach((role) => {
            const option = document.createElement("option");
            option.value = role.id;
            option.textContent = role.name;
            selectForm.appendChild(option);
        });

        if (dataToEdit) {
            const cargo = cargos.find((c) => c.id == dataToEdit.roleId);
            if (cargo) {
                var opts = selectForm.options;
                for (var i = 0; i < opts.length; i++) {
                    if (opts[i].value == cargo.id) {
                        opts[i].selected = true;
                        break;
                    }
                }
            }
        }

        const form = document.getElementById("data-form");
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            submitFormLogic("usuarios", form, dataToEdit ? true : false);
        });
    }

    function changeToControlPanel() {
        Promise.all([
            fetch("templates/sidebar.controlpanel.html")
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            "Erro ao carregar a sidebar do painel de controle."
                        );
                    }
                    return response.text();
                })
                .then((data) => {
                    sidebarPlaceholder.innerHTML = data;
                    sidebar = document.querySelector(".sidebar");
                    sidebarBtns = document.querySelectorAll(
                        ".sidebar.dark #sidebarBtn"
                    );

                    sidebarBtns.forEach((btn) => {
                        btn.addEventListener("click", () => {
                            let redirectPage = btn.getAttribute("redirectPage");
                            changePage(redirectPage, btn);

                            removeCurrActiveBtnClass();
                            btn.classList.add("active");
                        });
                    });

                    const newUrl = `${window.location.pathname}?controlPanel`;
                    history.pushState(null, "", newUrl);
                }),
        ])
            .then(() => {
                changePage("usuarios");
                toggleConfigBoxUser();
            })
            .catch((error) => {
                console.error(`Erro: ${error}`);
            });
    }

    window.openFormPage = function (
        entityName,
        formTitle = "Cadastrar",
        dataToEdit = null
    ) {
        fetch(`pages/${entityName}.form.html`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `Erro ao carregar o formulário de ${entityName}`
                    );
                }
                return response.text();
            })
            .then((html) => {
                pagePlaceholder.innerHTML = html;

                requestAnimationFrame(() => {
                    const formBoxTitle = document.getElementById("form-title");
                    const form = document.getElementById("data-form");

                    pageTitle.textContent = `${formTitle} ${capitalizeFirstLetter(
                        entityName
                    )}`;

                    if (dataToEdit) {
                        formBoxTitle.textContent = `Editando ${capitalizeFirstLetter(
                            entityName
                        ).slice(0, -1)} de ID: ${dataToEdit.id}`;
                        for (const key in dataToEdit) {
                            const input = document.querySelector(
                                `[name="${key}"]`
                            );
                            if (input) input.value = dataToEdit[key];
                        }

                        document
                            .getElementById("data-form")
                            .setAttribute("data-edit-id", dataToEdit.id);
                    }

                    let boolDataEdit = dataToEdit ? true : false;

                    applyInputMasks();

                    if (entityName == "vendas") {
                        initVendaForm(dataToEdit || null);
                    } else if (entityName == "pets") {
                        initPetsForm(dataToEdit || null);
                    } else if (entityName == "usuarios") {
                        initUsersForm(dataToEdit || null);
                    } else {
                        form.addEventListener("submit", (e) => {
                            e.preventDefault();

                            submitFormLogic(entityName, form, boolDataEdit);
                        });
                    }

                    responsiveWindow();
                });
            })
            .catch((err) => {
                console.error(err);
            });
    };

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

    userConfigOpenBtn.addEventListener("click", () => {
        toggleConfigBoxUser();
    });

    window.addEventListener(
        "resize",
        function (event) {
            responsiveWindow();
        },
        true
    );

    controlPanelBtn.addEventListener("click", () => {
        changeToControlPanel();
    });
}
