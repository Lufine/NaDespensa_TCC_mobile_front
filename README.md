# 📱 NaDespensa – Mobile Frontend  

<div align="center">

<h2>NADESPENSA_TCC_MOBILE_FRONT</h2>
<p><em>Empowering Seamless Food Management, Anytime, Anywhere</em></p>

<img alt="last-commit" src="https://img.shields.io/github/last-commit/Lufine/NaDespensa_TCC_mobile_front?style=flat&logo=git&logoColor=white&color=0080ff">
<img alt="repo-top-language" src="https://img.shields.io/github/languages/top/Lufine/NaDespensa_TCC_mobile_front?style=flat&color=0080ff">
<img alt="repo-language-count" src="https://img.shields.io/github/languages/count/Lufine/NaDespensa_TCC_mobile_front?style=flat&color=0080ff">

<br>

### 🛠️​​ Built with:
<img alt="JSON" src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white">
<img alt="Markdown" src="https://img.shields.io/badge/Markdown-000000.svg?style=flat&logo=Markdown&logoColor=white">
<img alt="npm" src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white">
<img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black">
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white">
<img alt="React" src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black">
<img alt="Expo" src="https://img.shields.io/badge/Expo-000020.svg?style=flat&logo=Expo&logoColor=white">
<img alt="Axios" src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white">
<img alt="datefns" src="https://img.shields.io/badge/datefns-770C56.svg?style=flat&logo=date-fns&logoColor=white">

</div>

---

## 📑 Sumário | Table of Contents

- [📖 Visão Geral | Overview](#visão-geral--overview)
- [✨ Funcionalidades | Features](#funcionalidades--features)
- [🏗 Arquitetura | Architecture](#arquitetura--architecture)
- [Protótipo no Figma | Figma Prototype](#capturas-de-tela--screenshots)
- [Documentação da API (Swagger) | API Documentation (Swagger)](#documentação-da-api-swagger--api-documentation-swagger)
- [Roadmap & Futuras Melhorias | Roadmap & Future Enhancements](#roadmap--futuras-melhorias--roadmap--future-enhancements)
- [🚀 Começando | Getting Started](#começando--getting-started)
  - [✅ Pré-requisitos | Prerequisites](#pré-requisitos--prerequisites)
  - [⚙️ Instalação | Installation](#instalação--installation)
  - [▶️ Uso | Usage](#uso--usage)
  - [🧪 Testes | Testing](#testes--testing)

---

## 📖 Visão Geral | Overview

**PT-BR:**  
**NaDespensa** é um aplicativo mobile desenvolvido como Trabalho de Conclusão de Curso em Engenharia de Software. Auxilia no **gerenciamento da despensa**, permitindo registrar, acompanhar e organizar alimentos, evitando **desperdício**, fomentando **economia**, e promovendo **consumo consciente**.

**EN:**  
**NaDespensa** is a mobile app developed as a Final Year Project in Software Engineering. It supports **pantry management**, enabling registering, tracking, and organizing food items to prevent **waste**, promote **savings**, and encourage **sustainable consumption**.

---

## ✨ Funcionalidades | Features

- 📦 Cadastro, edição e exclusão de produtos  
- 📷 Leitura de **código de barras** com câmera para busca automática  
- ⏰ Notificações de itens prestes a vencer  
- 📊 Painel com estatísticas de consumo e economia  
- 📚 Sugestão de receitas com base nos itens disponíveis  
- 👤 Perfil de usuário com personalização  
- 🌐 Integração com API RESTful e documentação via **Swagger**

---

## 🏗 Arquitetura | Architecture

**PT-BR:**  
O front-end foi desenvolvido com **React Native + Expo**, utilizando **TypeScript** para garantir tipagem segura e código mais robusto. A comunicação com a API ocorre via **Axios**.  
Componentização baseada em Context API para estado, **React Navigation** para navegação e estilo com **Styled Components** ou CSS-in-JS.

**EN:**  
The frontend is built with **React Native + Expo**, using **TypeScript** for strong typing and maintainability. It communicates with the backend via **Axios**. State is managed using Context API, navigation with **React Navigation**, and styling with **Styled Components** or CSS-in-JS.

---

##  Protótipo no Figma | Figma Prototype

Explore o protótipo completo das telas no Figma:  
[Figma – NaDespensa (mobile)](https://www.figma.com/proto/fUtorGfVGX64MFEcBjx7qO/NaDespensa---Screens--mobile-?node-id=4-75&p=f&t=1bcE3Y7N7LFCXoHE-1&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=4%3A75)

---

##  Documentação da API (Swagger) | API Documentation (Swagger)

A API utilizada pelo app está documentada no SwaggerHub. A versão atual pode ser acessada via [SwaggerHub](https://app.swaggerhub.com/apis/Leozin/NaDespensa-API/1.0.0).

**PT-BR:**  
Essa documentação lista todos os **endpoints**, métodos HTTP, schemas de **request** e **response**, parâmetros, códigos de status e exemplos de uso — permitindo testar as chamadas diretamente no navegador.

**EN:**  
This documentation provides all **API endpoints**, HTTP methods, request/response schemas, parameters, status codes, and usage examples — allowing in-browser testing of requests.

---

##  Roadmap & Futuras Melhorias | Roadmap & Future Enhancements

| Funcionalidade | Status | Descrição |
|----------------|--------|-----------|
| Multi-usuário / Perfis |  Planejado | Permitir múltiplos perfis com configurações individuais |
| Sincronização offline |  Em andamento | Salvar dados localmente com sincronização posterior |
| Alertas customizáveis |  Planejado | Notificações baseadas em quantidade, validade, etc. |
| Compartilhamento de despensas |  Em estudo | Compartilhar conteúdo da despensa entre usuários |
| ChatGPT para receitas |  Futuro | Sugestões de receitas dinâmicas com IA generativa |

---

## 🚀 Começando | Getting Started

### ✅ Pré-requisitos | Prerequisites

- **Node.js** (versão recomendada >= 18.x)  
- **npm** ou **yarn**  
- **Expo Go** instalado no dispositivo (Android/iOS)

### ⚙️ Instalação | Installation

```bash
# Clone o repositório / Clone the repo
git clone https://github.com/Lufine/NaDespensa_TCC_mobile_front.git

# Navegue até o diretório / Navigate into the repo
cd NaDespensa_TCC_mobile_front

# Instale as dependências / Install dependencies
npm install

### ▶️ Uso | Usage

# Inicie o app em modo de desenvolvimento / Run the app
npm start

Abra o aplicativo Expo Go no seu celular e escaneie o QR Code exibido no terminal para iniciar.

### 🧪 Testes | Testing

# Execute os testes / Run tests
npm test
```

⬆ [Voltar ao topo | Back to Top](#-nadespensa--mobile-frontend) 
