const db = require("../models");

const Booking = db.booking;
const RentalSpace = db.rentalSpace;



exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
  
exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
};
  
exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};
  
exports.book = async (req, res) => {
    try {
      const { rentalSpaceId, startDateTime, endDateTime } = req.body;
  
      // Check if the rental space is available for the specified dates
      const isAvailable = await checkAvailability(rentalSpaceId, startDateTime, endDateTime);
      if (!isAvailable) {
        return res.status(409).json({ error: 'Space is not available for the specified dates.' });
      }
  
      // Create the booking
      const booking = await Booking.create({
        rentalSpaceId,
        startDateTime,
        endDateTime,
      });
  
      return res.status(201).json({ booking });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while booking the space.' });
    }
};

exports.rentalSpace = async (req, res) => {
  try {
    const { name, location, size, hasOutdoorSpace, cateringIncluded,image } = req.body;

    // Create the rental space
    const rentalSpace = await RentalSpace.create({
      name,
      location,
      size,
      hasOutdoorSpace,
      cateringIncluded,
      image,
    });

    return res.status(201).json({ rentalSpace });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while creating the rental space.' });
  }
};

async function checkAvailability(rentalSpaceId, startDateTime, endDateTime) {
    const previousBooking = await Booking.findOne({
      where: {
        rentalSpaceId,
        endDateTime: {
          [sequelize.Op.gte]: endDateTime,
        },
      },
      order: [['endDateTime', 'DESC']],
    });
  
    if (previousBooking) {
      const nextAvailableDateTime = new Date(previousBooking.endDateTime);
      nextAvailableDateTime.setDate(nextAvailableDateTime.getDate() + 1);
  
      return startDateTime >= nextAvailableDateTime;
    }
  
    return true;
  }
  