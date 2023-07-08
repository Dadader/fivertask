module.exports = (sequelize, Sequelize) => {
    const RentalSpace = sequelize.define('RentalSpace', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        location: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        size: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        hasOutdoorSpace: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        cateringIncluded: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        image: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
      });

      return RentalSpace;
  };