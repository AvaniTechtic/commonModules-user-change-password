// routes/users.js
const express = require("express");
const router = express.Router();
const UserModel = require("../Models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/updateUserpassword", async (req, res) => {
  try {
    let payload = {
      password: bcrypt.hashSync(req.body.password, 16),
    };

    // update the data in database
    let whereQuery = { _id: req.body._id };

    await UserModel.findOne(whereQuery).then(async (response) => {
      if (bcrypt.compareSync(req.body.password, response.password)) {
        res.json({
          status: 401,
          message: "Please use another password as it is already used",
        });
      } else {
        const users = await UserModel.findByIdAndUpdate(whereQuery, payload, { new: true });
        res.json({
          status: 200,
          data: users,
        });
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
