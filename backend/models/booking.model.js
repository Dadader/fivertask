module.exports = (sequelize, Sequelize) => {
    const Booking = sequelize.define('Booking', {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        startDateTime: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        endDateTime: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });

      return Booking;
  };