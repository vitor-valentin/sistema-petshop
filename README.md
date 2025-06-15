# Sistema Petshop

Aplicação web front‑end para gerenciamento de petshop, com CRUD de clientes, produtos, serviços, pets, vendas e controle de permissões. Projeto desenvolvido usando HTML, CSS e JavaScript puro.

---

## ⚙️ Funcionalidades

- **Autenticação**: login com verificação de usuários pré‑cadastrados.
- **CRUD completo**:
  - Clientes, Produtos, Serviços, Pets e Vendas.
  - Formulários com validações (CPF, telefone, datas, formatos).
  - Máscaras automáticas (CPF, data, moeda).
- **Paginação** dinamicamente gerada (5 itens por página).
- **Validação de permissões**: usuários sem nível de acesso são redirecionados.
- **Estoque controlado**: não permite vender mais que o disponível; estoque é ajustado automaticamente.
- **Edição segura de vendas**: mesmo que estoque vá para zero, produtos anteriores aparecem no formulário.
- **Exclusão em cascata**: remover cliente apaga pets e vendas; remover produto/serviço reajusta vendas e total.

---

## 🗂️ Estrutura do projeto

```
/
├── index.html            # Página inicial
├── style.css             # Estilos globais
├── script.js             # Lógica JS (CRUD, paginação, validações, etc.)
├── exampleDatabase.js    # Base de dados inicial via localStorage
├── start‑sistema‑petshop.exe  # Executável para iniciar localmente
├── pages/                # Arquivos HTML de páginas (clientes, vendas, etc.)
└── templates/            # Cabeçalho, login e sidebar (componentes)
```

---

## 🚀 Como executar

### ✅ Opção 1: Usando o executável
Execute `start‑sistema‑petshop.exe`, o navegador abrirá automaticamente.

### 💻 Opção 2: Rodar localmente (sem servidor backend)
1. Abra `index.html` com Live Server (VS Code) ou similar.
2. Navegue na interface normalmente — o `exampleDatabase.js` carrega os dados apenas na primeira execução.

---

## 📌 Observações

- Todo o sistema roda **inteiramente no front‑end**, sem necessidade de backend ou banco de dados reais.
- Dados são armazenados via `localStorage` e persistem após recarregar.
- Para redefinir o sistema, exclua os dados armazenados no DevTools (ou use ferramenta específica).

---

## 🔐 Logins de exemplo

O sistema já vem com os seguintes usuários cadastrados para facilitar o acesso:

| Usuário       | Senha       | Permissão      |
|---------------|-------------|----------------|
| `Vitor`       | `123456`    | Total          |
| `Eduardo`     | `123456`    | Parcial        |

> 📌 *Você pode alterar ou excluir esses logins diretamente no painel de usuários (se tiver permissão).*
