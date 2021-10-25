'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ItemPedidos', {
      PedidoId: {                     // não tem ID pois depende de "Servico" e "Pedido"
        allowNull: false,             // Nao permite nulo
        primaryKey: true,             // tem uma chave primaria
        type: Sequelize.INTEGER,      // O id do "Pedido" e "Servico" é numeros inteiros
        references: {                 // Esse campo vem de outra tabela (É estrangeiro) Usamos a palavra "references"
          model: 'pedidos',           // Busca a referencia "pedidos"
          key: 'id',                  // Busca o "ID" dos "pedidos"
        },
        onDelete: 'CASCADE',          // Se eu excluir que vou excluir tudo
        onUpdate: 'CASCADE',          // Se eu atualizar tbm atualiza tudo
      },
      ServicoId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,     // igual acima pois usa "servico" e "pedidos"
        references: {
          model: 'servicos',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      quantidade: {                  // alteramos pois item pedido usa "quantidade"
        type: Sequelize.INTEGER      // "INTEGER" pois a quantidade é um numero inteiro
      },
      valor: {                       // alteramos pois item pedido tbm usa "valor"
        type: Sequelize.FLOAT        // "FLOAT" significa que é um numero quebrado, pois é um valor
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ItemPedidos');
  }
};