const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    controller.userBoard
  );

  app.post(
    "/api/test/book",
    [authJwt.verifyToken],
    controller.book
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.post(
    "/api/test/rentalSpace",
    controller.rentalSpace
  );

  app.delete(
    "/api/test/rentalSpace/:",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.rentalSpace
  );
};