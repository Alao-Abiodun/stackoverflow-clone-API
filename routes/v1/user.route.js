const express = require("express");
const router = express.Router();

const {
  signUp,
  signIn,
  updateUser,
  fetchUsers,
  fetchSingleUser,
} = require("../../controller/user.controller");

router.post("/create", signUp);
router.post("/login", signIn);

router.get("/fetch", fetchUsers);
router.get("/singleUser/:id", fetchSingleUser);

router.patch("/update/:user", updateUser);

module.exports = router;
