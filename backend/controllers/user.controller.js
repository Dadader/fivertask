const db = require("../models");

const Booking = db.booking;
const RentalSpace = db.rentalSpace;
const User = db.user;
const Role = db.role;
var bcrypt = require("bcryptjs");

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
    const { rentalSpaceId, startDateTime, endDateTime,userId } = req.body;

    // Check if the rental space is available for the specified dates
    const isAvailable = await checkAvailability(
      rentalSpaceId,
      startDateTime,
      endDateTime
    );
    if (!isAvailable) {
      return res
        .status(409)
        .json({ error: "Space is not available for the specified dates." });
    }

    // Create the booking
    const booking = await Booking.create({
      rentalSpaceId,
      startDateTime,
      endDateTime,
      userId,
    });

    return res.status(201).json({ booking });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while booking the space." });
  }
};

exports.rentalSpace = async (req, res) => {
  try {
    const {
      name,
      location,
      size,
      hasOutdoorSpace,
      cateringIncluded,
      image,
      zip_code,
      Description,
      Price,
    } = req.body;

    // Create the rental space
    const rentalSpace = await RentalSpace.create({
      name,
      location,
      size,
      Description,
      zip_code,
      Price,
      hasOutdoorSpace,
      cateringIncluded,
      image,
    });

    return res.status(201).json({ rentalSpace });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the rental space." });
  }
};

exports.getrentalSpace = async (req, res) => {
  try {
    const rentalSpaces = await RentalSpace.findAll();
    return res.json(rentalSpaces);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while retrieving rental spaces." });
  }
};

exports.derentalSpace = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the rental space
    const deletedRentalSpace = await RentalSpace.destroy({
      where: { id },
    });

    if (deletedRentalSpace === 0) {
      return res.status(404).json({ error: "Rental space not found." });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting the rental space." });
  }
};

exports.viewrentalspace = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the rental space by ID
    const rentalSpace = await RentalSpace.findByPk(id);

    if (!rentalSpace) {
      return res.status(404).json({ error: "Rental space not found." });
    }

    // Find the associated bookings for the rental space
    const bookings = await Booking.findAll({
      where: {
        rentalSpaceId: id,
      },
    });

    const rentalData = {
      rentalSpace,
      bookings,
    };

    return res.json(rentalData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error:
        "An error occurred while retrieving rental space data and bookings.",
    });
  }
};

// Update a rental space by ID
exports.updateRentalSpace = (req, res) => {
  const rentalSpaceId = req.params.id;
  const {
    name,
    location,
    Price,
    Description,
    size,
    hasOutdoorSpace,
    cateringIncluded,
  } = req.body;

  RentalSpace.findByPk(rentalSpaceId)
    .then((rentalSpace) => {
      if (!rentalSpace) {
        return res.status(404).send({ message: "Rental space not found" });
      }

      rentalSpace.name = name;
      rentalSpace.location = location;
      rentalSpace.Price = Price;
      rentalSpace.Description = Description;
      rentalSpace.size = size;
      rentalSpace.hasOutdoorSpace = hasOutdoorSpace;
      rentalSpace.cateringIncluded = cateringIncluded;

      rentalSpace
        .save()
        .then(() => {
          res
            .status(200)
            .send({ message: "Rental space updated successfully" });
        })
        .catch((error) => {
          res.status(500).send({ message: error.message });
        });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

// Get a rental space by ID
exports.getRentalSpaceById = (req, res) => {
  const rentalSpaceId = req.params.id;

  RentalSpace.findByPk(rentalSpaceId)
    .then((rentalSpace) => {
      if (!rentalSpace) {
        return res.status(404).send({ message: "Rental space not found" });
      }

      res.status(200).send(rentalSpace);
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

async function checkAvailability(rentalSpaceId, startDateTime, endDateTime) {
  const overlappingBookings = await Booking.findAll({
    where: {
      rentalSpaceId,
      endDateTime: {
        [db.Sequelize.Op.gt]: startDateTime,
      },
      startDateTime: {
        [db.Sequelize.Op.lt]: endDateTime,
      },
    },
  });

  return overlappingBookings.length === 0;
}

// Get all users with their roles
exports.getAllUsersWithRoles = (req, res) => {
  User.findAll({
    include: [
      {
        model: Role,
        attributes: ["id", "name"],
        through: { attributes: [] }, // Exclude junction table attributes
      },
    ],
  })
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};


// Get a user by ID
exports.getUserById = (req, res) => {
  const userId = req.params.id;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      res.status(200).send(user);
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

// Update a user by ID (including optional password update)
exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { username, email, password } = req.body;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      // Update username if provided, otherwise keep the existing value
      user.username = username || user.username;

      // Update email if provided, otherwise keep the existing value
      user.email = email || user.email;

      // Update password if provided, otherwise keep the existing value
      if (password) {
        user.password = bcrypt.hashSync(password, 8);
      }

      // Save the updated user
      user.save()
        .then((updatedUser) => {
          res.status(200).send(updatedUser);
        })
        .catch((error) => {
          res.status(500).send({ message: error.message });
        });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};


// Delete a user by ID
exports.deleteUserById = (req, res) => {
  const userId = req.params.id;

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      user.destroy()
        .then(() => {
          res.status(200).send({ message: "User deleted successfully" });
        })
        .catch((error) => {
          res.status(500).send({ message: error.message });
        });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

exports.changeUserRole = (req, res) => {
  const userId = req.params.id;
  const role = req.params.role;

  console.log(role);

  User.findByPk(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      Role.findOne({ where: { name: role } })
        .then((role) => {
          if (!role) {
            return res.status(404).send({ message: "Role not found" });
          }

          user.setRoles([role])
            .then(() => {
              res.status(200).send({ message: "User role updated to admin" });
            })
            .catch((error) => {
              res.status(500).send({ message: error.message });
            });
        })
        .catch((error) => {
          res.status(500).send({ message: error.message });
        });
    })
    .catch((error) => {
      res.status(500).send({ message: error.message });
    });
};

exports.getBookingByUserId = (req, res) => {
  const userId = req.params.id;

  Booking.findAll({
    where: { userId },
    include: [
      {
        model: User,
        attributes: ["id", "username", "email"]
      },
      {
        model: RentalSpace,
        attributes: ["id", "name", "location", "size","Description","Price","zip_code","hasOutdoorSpace","cateringIncluded","image"]
      }
    ]
  })
    .then((bookings) => {
      res.status(200).json(bookings);
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
};