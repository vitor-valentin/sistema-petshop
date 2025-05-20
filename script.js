const sidebar = document.getElementById("sidebar-placeholder");
const header = document.getElementById("header-placeholder");
const page = document.getElementById("page-placeholder");

fetch('templates/header.html')
    .then(response => {
        if (!response.ok) {
        throw new Error('Erro ao carregar a sidebar');
        }
        return response.text();
    })
    .then(data => {
        header.innerHTML = data;
    })
    .catch(error => {
        console.error('Erro:', error);
});

fetch('pages/clientes.html')
    .then(response => {
        if (!response.ok) {
        throw new Error('Erro ao carregar a sidebar');
        }
        return response.text();
    })
    .then(data => {
        page.innerHTML = data;
    })
    .catch(error => {
        console.error('Erro:', error);
});

fetch('templates/sidebar.html')
    .then(response => {
        if (!response.ok) {
        throw new Error('Erro ao carregar a sidebar');
        }
        return response.text();
    })
    .then(data => {
        sidebar.innerHTML = data;
    })
    .catch(error => {
        console.error('Erro:', error);
});