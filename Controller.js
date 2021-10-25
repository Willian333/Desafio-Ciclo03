const express = require('express');
const cors = require('cors');

const {Sequelize} = require('./models');

const models = require('./models');     // O "./" significa que a pasta "models" que estamos referenciando está no mesmo nivel

const app = express();
app.use(cors());
app.use(express.json());               // as informações vão ser passadas no formato json

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;
let compra = models.Compra;
let produto = models.Produto;
let itemcompra = models.ItemCompra;

app.get('/', function(req, res){                     // Mostrar mensagem na tela
    res.send('Olá mundo!')                           // resposta do servidor para o usuario
});

// app.post('/servicos', async(req, res) =>{            // async significa que tudo vai ser feita dentro dela (E vai ter requisição e resposta)
//     await servico.create(                            // A execução cria um novo serviço e faz na models
//         req.body                                     // A requisição vai ser passada pelo corpo da pagina (Aplicativo: Postman)
//     ).then(function(){                               // essa função vai verificar se deu tudo certo (Abaixo)
//         return res.json({
//             error: false,                            // não teve erro
//             message: "Serviço criado com sucesso!"   // mensagem avisando quando é feita criação acima
//         })
//     }).catch(function(erro){                         // catch é quando acontece um erro
//         return res.status(400).json({                // no Postman o correto retorna "200" então 400 é um erro
//             error: true,                             // teve erro
//             message: "Foi impossivel se conectar."
//         })
//     });      
// });

app.post('/servicos', async(req,res) =>{
    await servico.create({
        nome: "Limpeza completa",
        descricao: "Limpeza do gabinete, placa de video e troca de pasta termica",
    });
    res.send('Serviço criado com sucesso!');
});

app.post('/clientes', async(req,res) =>{              
    await cliente.create({
        nome: "Willian Xavier",
        endereco: "Av. Mandacaru, 2740",
        cidade: "Maringá",
        uf: "PR",
        nascimento: "1989-02-15",
        clienteDesde: "2021-10-05",
    });
    res.send('Cliente inserido com sucesso!');
});
      

app.post('/pedidos', async(req, res) =>{
    await pedido.create({
        ClienteId: 11,
        data: '2021-11-11',
    });
    res.send('Pedido criado com sucesso!');
})

app.post('/itenspedido', async(req, res) => {
    await itempedido.create({
        PedidoId: 6,
        ServicoId: 4,
        quantidade: 3,
        valor: 30.0
    });
    res.send('Item criado com sucesso!');
});

app.post('/compras', async(req, res) =>{
    await compra.create({
        ClienteId: 2,
        data: '2021-02-01',
    });
    res.send('Compra finalizada!');
});

app.post('/produtos', async(req, res) =>{
    await produto.create({
        nome: "Formatação",
        descricao: "Instalação do Windows10",
    });
    res.send('Produto Finalizado!');
});

app.post('/itenscompra', async(req, res) =>{
    await itemcompra.create({
        CompraId: 1,
        ProdutoId: 2,
        quantidade: 3,
        valor: 30.0
    });
    res.send('Item inserido com sucesso!');
});
//==============================================================================

app.get('/listaservicos', async(req, res) =>{
    await servico.findAll({
        //raw: true,
        order:[['nome', 'ASC']]
    }).then(function(servicos){
        res.json({servicos})
    });
});

app.get('/listaclientes', async(req, res)=>{
    await cliente.findAll({
        raw: true
    }).then(function(clientes){
        res.json({clientes})
    });
});

app.get('/ofertaservicos', async(req, res)=>{              // vai retornar a quantidade de serviços
    await servico.count('id').then(function(servicos){
        res.json({servicos});
    });
});

app.get('/servico/:id', async(req, res)=>{
    await servico.findByPk(req.params.id)
    .then(serv =>{
        return res.json({
            error: false,
            serv
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: Não foi possivel conectar!"
        });
    });
});

app.get('/listaclientes', async(req, res) =>{       // Aula 9 - Exercicio 1
    await cliente.findAll({
        //raw: true,
        order:[['nome', 'ASC']]                     // Aula 9 - Exercicio 2
    }).then(function(clientes){
        res.json({clientes})
    });
});

app.get('/listapedidos', async(req, res) =>{        // Aula 9 - Exercicio 3
    await pedido.findAll({
        //raw: true,
        order:[['nome', 'DESC']]                    // Aula 9 - Exercicio 4
    }).then(function(pedidos){
        res.json({pedidos})
    });
});

app.get('/quantidadeclientes', async(req, res)=>{          // Aula 9 - Exercicio 5
    await cliente.count('id').then(function(clientes){
        res.json({clientes});
    });
});

app.get('/quantidadepedidos', async(req, res)=>{           // Aula 9 - Exercicio 6
    await pedido.count('id').then(function(pedidos){
        res.json({pedidos});
    });
});

//===============================================================================

app.put('/atualizaservico', async(req, res)=>{
    await servico.update(req.body,{
        where: {id: req.body.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Serviço foi alterado com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do serviço"
        });
    });
});

//===============================================================================

app.get('/pedidos/:id', async(req, res)=>{
    await pedido.findByPk(req.params.id, {include:[{all: true}]})
    .then(ped=>{
        return res.json({ped});
    })
});

app.put('/pedidos/:id/editaritem', async(req, res)=>{
    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.valor,
    };

    if (!await pedido.findByPk(req.params.id)){
        return res.status(400).json({
            error: true,
            message: 'Pedido não foi encontrado.'
        });
    };

    if (!await servico.findByPk(req.body.ServicoId)){
        return res.status(400).json({
            error: true,
            message: 'Serviço não foi encontrado.'
        });
    };

    await itempedido.update(item, {
        where: Sequelize.and({ServicoId: req.body.ServicoId},
            {PedidoId: req.params.id}),
    }).then(function(itens){
        return res.json({
            error: false,
            message: "Pedido foi alterado com sucesso!",
            itens
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possivel alterar."
        });
    });
});

app.get('/excluircliente/:id', async(req, res)=>{
    await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error: false,
            message: "Cliente foi exlcuido com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error: true,
            messagem: "Erro ao excluir o cliente."
        });
    });
});

let port = process.env.PORT || 3001;

app.listen(port,(req,res)=>{
    console.log('Servidor ativo: http://localhost:3001');
})