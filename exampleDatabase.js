//Set example localStorage variables

//Valid Logins:
localStorage.setItem("vpValidLogins", JSON.stringify([
    { 
        id: 1,
        username: "Vitor", 
        email: "vitor.rohling.becker@gmail.com", 
        password: "123456",
        role: "Gerente"
    },
    {
        id: 2,
        username: "Eduardo",
        email: "eduardo@gmail.com",
        password: "CastanhasSaoLegais",
        role: "Doutor Veterinário"
    }
]));

//Logins Info:
localStorage.setItem("vpLoginsInfo", JSON.stringify([
    { 
        id: 1,
        username: "Vitor", 
        email: "vitor.rohling.becker@gmail.com", 
        password: "123456",
        role: "Gerente"
    },
    {
        id: 2,
        username: "Eduardo",
        email: "eduardo@gmail.com",
        password: "CastanhasSaoLegais",
        role: "Doutor Veterinário"
    }
]));

//Clientes:
localStorage.setItem("vpClientes", JSON.stringify([
    {
        id: 1,
        name: "Maria Oliveira",
        phone: "(11) 99999-9999",
        email: "maria@email.com",
        cpf: "999.999.999-99",
        gender: "Feminino",
        birthDate: "07/08/2008"
    },
    {
        id: 2,
        name: "João Souza",
        phone: "(11) 98888-8888",
        email: "joao@email.com",
        cpf: "888.888.888-88",
        gender: "Masculino",
        birthDate: "25/12/2001"
    },
    {
        id: 3,
        name: "Fernanda Lima",
        phone: "(21) 97777-7777",
        email: "fernanda@email.com",
        cpf: "777.777.777-77",
        gender: "Feminino",
        birthDate: "12/01/1987"
    },
    {
        id: 4,
        name: "Carlos Mendes",
        phone: "(31) 96666-4444",
        email: "carlos@email.com",
        cpf: "666.666.666-66",
        gender: "Masculino",
        birthDate: "14/03/1995"
    },
    {
        id: 5,
        name: "Ana Clara Torres",
        phone: "(85) 91111-2222",
        email: "ana.clara@email.com",
        cpf: "111.111.111-11",
        gender: "Feminino",
        birthDate: "02/05/2000"
    },
    {
        id: 6,
        name: "Bruno Silva",
        phone: "(41) 91234-5678",
        email: "bruno@email.com",
        cpf: "123.456.789-00",
        gender: "Masculino",
        birthDate: "30/05/1992"
    },
    {
        id: 7,
        name: "Larissa Gomes",
        phone: "(71) 93456-7890",
        email: "larissa@email.com",
        cpf: "234.567.890-12",
        gender: "Feminino",
        birthDate: "18/06/1998"
    },
    {
        id: 8,
        name: "Pedro Henrique Costa",
        phone: "(62) 97654-3210",
        email: "pedro@email.com",
        cpf: "345.678.901-23",
        gender: "Masculino",
        birthDate: "09/04/1990"
    },
    {
        id: 9,
        name: "Juliana Castro",
        phone: "(27) 96543-2109",
        email: "juliana@email.com",
        cpf: "456.789.012-34",
        gender: "Feminino",
        birthDate: "21/02/1985"
    },
    {
        id: 10,
        name: "Rodrigo Almeida",
        phone: "(47) 97890-1234",
        email: "rodrigo@email.com",
        cpf: "567.890.123-45",
        gender: "Masculino",
        birthDate: "11/07/1993"
    }
]));

//Vendas
localStorage.setItem("vpVendas", JSON.stringify([
    {
        id: 1,
        idCliente: 1,
        soldDate: "12/05/2025",
        products: {
            1: {
                idProduct: 1,
                amount: 3
            },
            2:  {
                idProduct: 2,
                amount: 1
            }
        },
        services: {
            1: {
                idService: 1
            }
        },
        totalValue: 500.00
    },
    {
        id: 2,
        idCliente: 3,
        soldDate: "15/05/2025",
        products: {
            1: {
                idProduct: 1,
                amount: 3
            },
            2:  {
                idProduct: 2,
                amount: 1
            }
        },
        services: {
            1: {
                idService: 1
            }
        },
        totalValue: 500.00
    },
    {
        id: 3,
        idCliente: 8,
        soldDate: "15/03/2025",
        products: {
            1: {
                idProduct: 1,
                amount: 3
            },
            2:  {
                idProduct: 2,
                amount: 1
            }
        },
        services: {
            1: {
                idService: 1
            }
        },
        totalValue: 500.00
    },
    {
        id: 4,
        idCliente: 1,
        soldDate: "15/05/2025",
        products: {
            1: {
                idProduct: 1,
                amount: 3
            },
            2:  {
                idProduct: 2,
                amount: 1
            }
        },
        services: {
            1: {
                idService: 1
            }
        },
        totalValue: 500.00
    }
]));

//Produtos
localStorage.setItem("vpProdutos", JSON.stringify([
    {
        id: 1,
        name: "Spray de lavagem a seco",
        price: 15.00,
        brand: "Pet Society",
        amount: "200ml" 
    }
]));

//Serviços
localStorage.setItem("vpServicos", JSON.stringify([
    {
        id: 1,
        name: "Tosa na tesoura",
        price: 52.00
    }
]));