//Set example localStorage variables

//Valid Logins:
localStorage.setItem("vpValidLogins", JSON.stringify([
    { 
        id: 1,
        username: "Vitor", 
        email: "vitor.rohling.becker@gmail.com", 
        password: "123456",
        roleId: 1
    },
    {
        id: 2,
        username: "Eduardo",
        email: "eduardo@gmail.com",
        password: "123456",
        roleId: 2
    }
]));

//Cargos:
localStorage.setItem("vpCargos", JSON.stringify([
    {
        id: 1,
        name: "Gerente",
        permissionLevel: 2
    },
    {
        id: 2,
        name: "Doutor Veterinário",
        permissionLevel: 1
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
        idPet: 1,
        idCliente: 1,
        soldDate: "12/03/2025",
        products: {
            0: { id: 1, amount: 3 },
            1: { id: 2, amount: 1 }
        },
        services: {
            0: { id: 1 }
        },
        totalValue: 119.00 // (15*3) + 18 + 52
    },
    {
        id: 2,
        idPet: 2,
        idCliente: 2,
        soldDate: "13/05/2025",
        products: {
            0: { id: 3, amount: 2 }
        },
        services: {},
        totalValue: 34.00 // (17 * 2)
    },
    {
        id: 3,
        idPet: 3,
        idCliente: 3,
        soldDate: "14/05/2025",
        products: {},
        services: {
            0: { id: 4 },
            1: { id: 6 }
        },
        totalValue: 58.00 // 40 + 18
    },
    {
        id: 4,
        idPet: 4,
        idCliente: 4,
        soldDate: "14/05/2025",
        products: {
            0: { id: 5, amount: 1 },
            1: { id: 6, amount: 1 }
        },
        services: {
            0: { id: 2 }
        },
        totalValue: 69.00 // 12 + 22 + 35
    },
    {
        id: 5,
        idPet: 5,
        idCliente: 5,
        soldDate: "17/05/2025",
        products: {
            0: { id: 4, amount: 1 }
        },
        services: {},
        totalValue: 20.00
    },
    {
        id: 6,
        idPet: 6,
        idCliente: 6,
        soldDate: "15/05/2025",
        products: {
            0: { id: 7, amount: 1 },
            1: { id: 10, amount: 2 }
        },
        services: {},
        totalValue: 78.00 // 36 + 42
    },
    {
        id: 7,
        idPet: 7,
        idCliente: 7,
        soldDate: "16/05/2025",
        products: {
            0: { id: 9, amount: 2 }
        },
        services: {
            0: { id: 8 },
            1: { id: 3 }
        },
        totalValue: 100.00 // (30*2) + 42 + 28
    },
    {
        id: 8,
        idPet: 8,
        idCliente: 8,
        soldDate: "16/05/2025",
        products: {},
        services: {
            0: { id: 10 }
        },
        totalValue: 60.00
    },
    {
        id: 9,
        idPet: 9,
        idCliente: 9,
        soldDate: "17/05/2025",
        products: {
            0: { id: 4, amount: 1 }
        },
        services: {},
        totalValue: 20.00
    },
    {
        id: 10,
        idPet: 10,
        idCliente: 10,
        soldDate: "17/05/2025",
        products: {
            0: { id: 8, amount: 1 }
        },
        services: {
            0: { id: 5 }
        },
        totalValue: 47.00 // 32 + 15
    }
]));


//Produtos
localStorage.setItem("vpProdutos", JSON.stringify([
    {
        id: 1,
        name: "Spray de lavagem a seco",
        price: 15.00,
        brand: "Pet Society",
        amount: "200ml",
        stock: 2
    },
    {
        id: 2,
        name: "Shampoo Neutro para Cães",
        price: 22.90,
        brand: "Pet Clean",
        amount: "500ml",
        stock: 20
    },
    {
        id: 3,
        name: "Colônia Floral",
        price: 18.50,
        brand: "Pet Aroma",
        amount: "120ml",
        stock: 50
    },
    {
        id: 4,
        name: "Desembaraçador de Pelos",
        price: 25.00,
        brand: "Pet Soft",
        amount: "250ml",
        stock: 500
    },
    {
        id: 5,
        name: "Talco Antisséptico",
        price: 12.00,
        brand: "Pet Fresh",
        amount: "100g",
        stock: 10
    },
    {
        id: 6,
        name: "Escova de Dentes Canina",
        price: 9.90,
        brand: "Pet Dental",
        amount: "1 unidade",
        stock: 30
    },
    {
        id: 7,
        name: "Lenços Umedecidos",
        price: 16.00,
        brand: "Pet Wipes",
        amount: "50 unidades",
        stock: 70
    },
    {
        id: 8,
        name: "Condicionador para Pelos Longos",
        price: 27.50,
        brand: "Pet Beauty",
        amount: "300ml",
        stock: 1
    },
    {
        id: 9,
        name: "Hidratante de Patas",
        price: 20.00,
        brand: "PawCare",
        amount: "50g",
        stock: 4
    },
    {
        id: 10,
        name: "Spray Anti-Odor",
        price: 17.00,
        brand: "Pet Smell",
        amount: "250ml",
        stock: 0
    }
]));


//Serviços
localStorage.setItem("vpServicos", JSON.stringify([
    {
        id: 1,
        name: "Tosa na tesoura",
        price: 52.00
    },
    {
        id: 2,
        name: "Banho completo",
        price: 35.00
    },
    {
        id: 3,
        name: "Tosa higiênica",
        price: 28.00
    },
    {
        id: 4,
        name: "Hidratação de pelos",
        price: 40.00
    },
    {
        id: 5,
        name: "Corte de unhas",
        price: 15.00
    },
    {
        id: 6,
        name: "Limpeza de ouvido",
        price: 18.00
    },
    {
        id: 7,
        name: "Escovação dental",
        price: 20.00
    },
    {
        id: 8,
        name: "Banho antipulgas",
        price: 42.00
    },
    {
        id: 9,
        name: "Tosa na máquina",
        price: 45.00
    },
    {
        id: 10,
        name: "Pintura de pelos",
        price: 60.00
    }
]));

//Pets
localStorage.setItem("vpPets", JSON.stringify([
    {
        id: 1,
        name: "Rex",
        race: "Cachorro",
        age: 6,
        gender: "Macho",
        idCliente: 1
    },
    {
        id: 2,
        name: "Luna",
        race: "Gato",
        age: 3,
        gender: "Fêmea",
        idCliente: 2
    },
    {
        id: 3,
        name: "Thor",
        race: "Cachorro",
        age: 4,
        gender: "Macho",
        idCliente: 3
    },
    {
        id: 4,
        name: "Mia",
        race: "Gato",
        age: 2,
        gender: "Fêmea",
        idCliente: 4
    },
    {
        id: 5,
        name: "Bob",
        race: "Coelho",
        age: 1,
        gender: "Macho",
        idCliente: 2
    },
    {
        id: 6,
        name: "Nina",
        race: "Cachorro",
        age: 5,
        gender: "Fêmea",
        idCliente: 5
    },
    {
        id: 7,
        name: "Max",
        race: "Papagaio",
        age: 7,
        gender: "Macho",
        idCliente: 3
    },
    {
        id: 8,
        name: "Mel",
        race: "Gato",
        age: 3,
        gender: "Fêmea",
        idCliente: 6
    },
    {
        id: 9,
        name: "Tobby",
        race: "Cachorro",
        age: 8,
        gender: "Macho",
        idCliente: 4
    },
    {
        id: 10,
        name: "Amora",
        race: "Hamster",
        age: 1,
        gender: "Fêmea",
        idCliente: 7
    }
]));