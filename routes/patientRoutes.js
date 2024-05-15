const upload = require("../middleware/uploadImage");
const express = require("express");
const router = express.Router();
const patientSchema = require("../schema/patientSchema");
const { generateToken } = require("../extra/jwt");

// Registration Route
router.post("/register",upload.single("file"), async (req, res) => {
    try {
      const { firstName, lastName, mobileNumber, email, username, password } = req.body;

      // The URL/path for the uploaded image
      const pictureUrl = req.file ? `http://localhost:4000/file/${req.file.filename}` : null;
      console.log("Hello");
  
      // Create a new user document
      const newUser = new patientSchema({
        firstName,
        lastName,
        mobileNumber,
        email,
        picture: pictureUrl,
        username,
        password,
      });
      console.log(newUser);
  
      // Save the user to the database using async/await
      const savedUser = await newUser.save();
  
      return res.status(201).send(savedUser); // Send HTTP 201 for resource creation along with the saved user's data
    } catch (err) {
      return res.status(500).send("User registration failed: " + err.message); // Handle database errors
    }
  }
);

// Login Route
router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).send("Username and Password required");
      }
  
      // async/await to find a user by username and password
      const user = await userSchema.findOne({
        username: username,
        password: password,
      });
  
      if (!user) {
        return res.status(404).send("User not found");
      }
  
      return res.status(200).json({ token: generateToken(user._id) });
    } catch (err) {
      return res.status(500).send("Login failed: " + err.message);
    }
  }
);
  

// router.post("/upload", upload.single("file"), async (req, res) => {
//     if (req.file === undefined) return res.send("you must select a file.");
//     const imgUrl = `http://localhost:8080/file/${req.file.filename}`;
//     return res.send(imgUrl);
// });

module.exports = router;