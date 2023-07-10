const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.post("/api/test/book", controller.book);

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.post("/api/test/rentalSpace", controller.rentalSpace);

  app.get("/api/test/rentalSpace", controller.getrentalSpace);

  app.get(
    "/api/test/viewrentalSpace/:id",
    // [authJwt.verifyToken, authJwt.isAdmin],
    controller.viewrentalspace
  );

  app.delete(
    "/api/test/rentalSpace/:id",
    // [authJwt.verifyToken, authJwt.isAdmin],
    controller.derentalSpace
  );
};
