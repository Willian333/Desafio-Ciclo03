'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pedidos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      data: {
        type: Sequelize.DATEONLY
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      ClienteId: {                 // esse tipo é um padrao pra relacionar os campos
        allowNull: false,          // é obrigatorio pois o cliente não é nulo
        type: Sequelize.INTEGER,   // o Id do cliente é um tipo de dado inteiro
        references: {              // fazendo a chave estrangeira
          model: 'clientes',       // pasta models e refere ao Cliente
          key: 'id'                // O campo de indentificação
        },
        onDelete: 'CASCADE',       // para eleminar o cliente ("CASCADE" significa que na hora que eu deletar o cliente some tudo)
        onUpdate: 'CASCADE',       // Para alterar cliente ("CASCADE" significa que sera alterado tudo)
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Pedidos');
  }
};