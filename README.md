# 🐴 Sistema de Votação GOHO (Go Horse Voting)

[![License: MIT](https://img.shields.io/badge/License-MIT-5965E0.svg?labelColor=121214&style=for-the-badge)](https://opensource.org/licenses/MIT) ![Polygon](https://img.shields.io/badge/Polygon-8247E5?logo=polygon&logoColor=white&style=for-the-badge) ![Foundry](https://img.shields.io/badge/Foundry-F5A623?logo=ethereum&logoColor=black&style=for-the-badge)   [![Solidity](https://img.shields.io/badge/Solidity-%20-363636?style=for-the-badge&logo=solidity&logoColor=white)](https://soliditylang.org/) [![Ethers.js](https://img.shields.io/badge/Ethers.js-%20-204991?style=for-the-badge&logo=ethers&logoColor=white)](https://ethers.io/) [![OpenZeppelin](https://img.shields.io/badge/OpenZeppelin-%20-4E5EE4?style=for-the-badge&logo=openzeppelin&logoColor=white)](https://www.openzeppelin.com/)
![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) 

Projeto que visa estender o [ecossistema do token GOHO](https://goho-view.vercel.app/docs) por meio da criação de um sistema de votos que simulam a participação em uma organização autônoma descentralizada (DAO). Este repositório contém os smart contracts do sistema de votação e uma interface de usuário para interagir com eles.

## Resultado (interface) ✨
Você pode conferir a aplicação facilmente no seguinte link:
[VERCEL](https://goho-vote.vercel.app/sobre)

<img width="1847" height="932" alt="image" src="https://github.com/user-attachments/assets/f4b62604-f29d-4075-8feb-6ee3267748a0" />


## 🌟 Features Principais

- **Contrato de Votação:** Permite que detentores de tokens GOHO criem e votem em propostas.
- **Frontend Descentralizado:** Interface para criar propostas, votar e ver resultados.
- **Integração com GOHO Token:** Utiliza o token GOHO (ERC20) como poder de voto.
- **Segurança:** Baseado em OpenZeppelin e melhores práticas de desenvolvimento.
- **Modo de Demonstração (Mock):** Permite explorar a interface com dados de exemplo, sem a necessidade de uma carteira ou conexão real com a blockchain.

## 🏗️ Arquitetura do Projeto

| Componente         | Tecnologias                     | Descrição                                       |
| ------------------ | ------------------------------- | ----------------------------------------------- |
| **Smart Contract** | Solidity, Foundry, OpenZeppelin | Lógica do sistema de votação e propostas        |
| **Frontend**       | Angular 19+, Ethers.js, SCSS    | Interface para usuários interagirem com o sistema |

## 📂 Estrutura do Repositório

```
.
├── contracts/         # Contratos, testes e scripts de deploy (Foundry)
│   ├── src/GohoVoting.sol
│   ├── test/
│   └── script/
│
├── frontend/          # Aplicação Angular
│   ├── src/app/
│   └── assets/
│
└── README.md          # Este arquivo
```

## 🔗 Contratos Deployados

Para interagir com o contrato, você precisará do endereço e da ABI. O contrato foi deployado na rede de testes Amoy da Polygon.

| Rede             | Endereço do Contrato                                                                                     | 
| ---------------- | -------------------------------------------------------------------------------------------------------- | 
| **Polygon Amoy** | [`0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`](https://amoy.polygonscan.com/address/0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9) | 
| **Polygon Mainnet** | EM BREVE |


## 🚀 Começando

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v20+)
- [Foundry](https://getfoundry.sh/)
- [Metamask](https://metamask.io/) (ou outra carteira Web3)

### Smart Contracts

Para compilar e testar os contratos:

```bash
# 1. Navegue até a pasta dos contratos
cd contracts

# 2. Instale as dependências
forge install

# 3. Compile os contratos
forge build

# 4. Rode os testes
forge test
```

### Frontend

Para rodar a interface localmente:

```bash
# 1. Navegue até a pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm start

# 4. Abra http://localhost:4200 no seu navegador
```

> **Dica:** Após iniciar a aplicação, você pode usar o seletor de redes na barra lateral para escolher a opção **"Mock Data"**. Isso permite testar a interface com dados de exemplo sem precisar conectar uma carteira Web3.



---

#### Autor 👷

#

<a href="https://www.linkedin.com/in/araujocode/" target="_blank"> 
<img src="https://avatars.githubusercontent.com/u/97068163?s=400&u=d1268d73901476caf5e9f8fc10d7237576413f92&v=4" width=180 height=180/>
</a>

[Adriano P Araujo](https://www.linkedin.com/in/araujocode/)
