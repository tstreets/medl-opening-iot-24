const router = require("express").Router();

router.get("/test", function (req, res) {
  res
    .status(200)
    .json({ msg: "sucess", endpoint: "/api/creature-combat/test" });
});

module.exports = router;
