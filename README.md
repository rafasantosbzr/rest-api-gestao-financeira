
# Aplicativo de Gestão Financeira: "DinDin"

Este projeto consiste em uma API RESTful para um aplicativo de gestão financeira chamado "DinDin". Com o DinDin, os usuários podem realizar diversas operações financeiras, como cadastrar e gerenciar suas despesas e receitas, listar categorias, obter extratos, e muito mais. A API é altamente segura, garantindo que cada usuário só tenha acesso e controle sobre seus próprios dados financeiros. Além disso, ela utiliza um banco de dados PostgreSQL para armazenar todas as informações de forma organizada. O DinDin é a solução perfeita para quem deseja ter um maior controle sobre suas finanças pessoais, de maneira prática e eficiente.


## Documentação da API

#### Cadastrar um novo usuário no sistema

```http
POST /usuario
```

| Requisição                           |
| :---------------------------------- |
| Envie um objeto JSON no corpo da requisição com os campos "nome", "email" e "senha". |


#### Fazer Login

```http
POST /login
```

| Requisição                                   |
| :------------------------------------------ |
| Envie um objeto JSON no corpo da requisição com os campos "email" e "senha". |


#### Detalhar Perfil do Usuário Logado

```http
GET /usuario
```

| Requisição                                   |
| :------------------------------------------ |
| Sem parâmetros de rota ou de query. O usuário é identificado pelo token de autenticação. |


#### Editar Perfil do Usuário Logado

```http
PUT /usuario
```

| Requisição                                   |
| :------------------------------------------ |
| Envie um objeto JSON no corpo da requisição com os campos "nome", "email" e "senha". |


#### Listar Categorias

```http
GET /categoria
```

| Requisição                                   |
| :------------------------------------------ |
| Sem parâmetros de rota ou de query. |


#### Listar Transações do Usuário Logado

```http
GET /transacao
```

| Requisição                                   |
| :------------------------------------------ |
| O usuário é identificado pelo token de autenticação. 
Envie um parâmetro query opcional ```filtro``` com a descrição das categorias desejadas. |


#### Detalhar Transação do Usuário Logado

```http
GET /transacao/:id
```

| Requisição                                   |
| :------------------------------------------ |
| Envie o ID da transação como parâmetro na rota. |


#### Obter Extrato de Transações

```http
GET /transacao/extrato
```

| Requisição                                   |
| :------------------------------------------ |
| Sem parâmetros de rota ou de query. |


#### Cadastrar Transação para o Usuário Logado

```http
POST /transacao
```

| Requisição                                   |
| :------------------------------------------ |
| Envie um objeto JSON no corpo da requisição com os campos "descricao", "valor", "data", "categoria_id" e "tipo". |


#### Atualizar Transação do Usuário Logado

```http
PUT /transacao/:id
```

| Requisição                                   |
| :------------------------------------------ |
| Envie o ID da transação como parâmetro na rota e um objeto JSON no corpo da requisição com os campos a serem atualizados. |


#### Excluir Transação do Usuário Logado

```http
DELETE /transacao/:id
```

| Requisição                                   |
| :------------------------------------------ |
| Envie o ID da transação como parâmetro na rota. |










