const express = require("express");
const controller = require("../controllers/controller");
const router = express.Router();

router.post("/register", controller.Register);
router.post("/login", controller.Login);
router.post("/logout", controller.Logout);
router.post("/add-jog", controller.AddTimeJog);
router.post("/create-user", controller.CreateUser);
router.delete("/delete-jog", controller.DeleteJog);
router.delete("/delete-user", controller.DeleteUser);
router.put("/edit-jog", controller.EditJog);
router.put("/edit-user", controller.EditUSer);
router.get("/time-jogs", controller.getJogs);
router.get("/get-user", controller.GetUsers);
router.get("/filtered-jogs", controller.FilterdJogs);
router.get("/week", controller.week);
module.exports = router;
