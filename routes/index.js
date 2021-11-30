const express = require("express");
const router = express.Router();

const v1 = require("./v1/index");

router.use("/v1", v1);

// the version will be declared here
// router.use('/v2', v2);

module.exports = router;
