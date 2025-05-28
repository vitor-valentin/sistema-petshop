//TODO: Finish the initVendas!!!!

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

function formatReal(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

function isValidCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let sum = 0,
        rest;
    for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    return rest === parseInt(cpf[10]);
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
    return data <= today;
}

function isValidMoney(value) {
    const clean = value.replace("R$", "").replace(",", ".").trim();
    const parsed = parseFloat(clean);
    return !isNaN(parsed) && parsed > 0;
}

function initializeCode() {
    const sidebarBtn = document.querySelector(".menu");
    const headerMenu = document.querySelector("header");
    const sidebar = document.querySelector(".sidebar");
    const sidebarBtns = document.querySelectorAll("#sidebarBtn");
    const username = document.querySelector("username");
    const login = JSON.parse(localStorage.getItem("vpLogin"));
    const pageTitle = document.getElementById("page-title");
    const vendaDetails = document.querySelector(".vendas-details");
    const closeBtn = vendaDetails.querySelector(".close-btn");
    const userConfigOpenBtn = document.querySelector(".user i");

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

    username.textContent = login.username;

    renderTable(tableOptions);
    renderPagination();
    updateSectionCards("Clientes");

    checkPermissionLevel();

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

        Object.keys(dataArray).forEach((key) => {
            const tr = document.createElement("tr");
            const innerData = retrieveVendaData(type, dataArray[key].id);

            Object.keys(innerData).forEach((innerKey) => {
                if (innerKey != "id") {
                    const td = document.createElement("td");

                    if (innerKey === "price") {
                        td.textContent = formatReal(innerData[innerKey]);
                    } else {
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
        const data = JSON.parse(localStorage.getItem(`vp${pageName}`)) || [];

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

        tbody.innerHTML = "";

        rowsToDisplay.forEach((item) => {
            const tr = document.createElement("tr");

            fields.forEach((key) => {
                const td = document.createElement("td");

                if (pageName === "Vendas" && key === "idCliente") {
                    td.textContent = getClientNameById(item[key]);
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
                } else if (key === "price" || key === "totalValue") {
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
            produtos: "totalProducts",
            servicos: "totalServices",
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
            totalStock += product.stock;
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
        }
    }

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
                    updateSectionCards(capitalizeFirstLetter(redPage));
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

    function submitForm(entityKey) {
        const form = document.getElementById("data-form");
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const dataForm = new FormData(form);
            const data = Object.fromEntries(dataForm.entries());

            if (data.cpf && !isValidCPF(data.cpf)) {
                alert("CPF inválido.");
                return;
            }

            if (
                (data.birthDate || data.soldDate) &&
                !isValidDate(data.birthDate || data.soldDate)
            ) {
                alert("Data inválida. Use o formato dd/mm/aaaa.");
                return;
            }

            if (
                (data.price || data.totalValue) &&
                !isValidMoney(data.price || data.totalValue)
            ) {
                alert("Informe um valor monetário válido maior que R$ 0,00.");
                return;
            }

            const editId = form.getAttribute("data-edit-id");
            const storageKey = `vp${capitalizeFirstLetter(entityKey)}`;
            let registers = JSON.parse(localStorage.getItem(storageKey)) || [];

            if (data.price)
                data.price = parseFloat(
                    data.price
                        .replace("R$", "")
                        .replace(/\s/g, "")
                        .replace(",", ".")
                );
            if (data.totalValue)
                data.totalValue = parseFloat(
                    data.totalValue
                        .replace("R$", "")
                        .replace(/\s/g, "")
                        .replace(",", ".")
                );
            if (data.idCliente) data.idCliente = parseInt(data.idCliente);

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
            //TODO: Add a cool success popup!
            alert(`${capitalizeFirstLetter(entityKey)} salvo com sucesso!`);
        });
    }

    function deleteRegister(id) {
        //TODO: Add custom confirm popup
        //TODO: Create custom and cool popup! :)
        const entityName = pagePlaceholder
            .querySelector(".content")
            ?.id?.toLowerCase();
        if (!entityName) {
            console.warn("Entidade não identificada.");
            return;
        }

        const storageKey = `vp${capitalizeFirstLetter(entityName)}`;
        let registers = JSON.parse(localStorage.getItem(storageKey));

        const confirmDelete = confirm(
            "Tem certeza que deseja excluir este registros?"
        );
        if (!confirmDelete) return;

        registers = registers.filter((item) => item.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(registers));

        alert("Registro excluído com sucesso!");
        renderTable(tableOptions);
        renderPagination();
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
        const login = JSON.parse(localStorage.getItem("vpLogin"));
        const loginInfo = validLogins.filter(
            (vl) =>
                vl.username === login.username && vl.password === login.password
        )[0];
        
        if(loginInfo.permissionLevel < 2) {
            const controlPanel = document.getElementById("controlPanel");
            controlPanel.remove();
        } 
    };

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

                    pageTitle.textContent = `${formTitle} ${capitalizeFirstLetter(
                        entityName
                    )}`;

                    if (dataToEdit) {
                        formBoxTitle.textContent = `Editando ${capitalizeFirstLetter(
                            entityName
                        ).slice(0, -1)} de ID: ${dataToEdit.id}`;
                    }

                    applyInputMasks();
                    submitForm(entityName);
                });

                if (dataToEdit) {
                    for (const key in dataToEdit) {
                        const input = document.querySelector(`[name="${key}"]`);
                        if (input) input.value = dataToEdit[key];
                    }

                    document
                        .getElementById("data-form")
                        .setAttribute("data-edit-id", dataToEdit.id);
                }
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
}

