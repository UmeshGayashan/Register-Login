const upload = require("../middleware/uploadImage");
const express = require("express");
const router = express.Router();
const patientSchema = require("../schema/patientSchema");
const { generateToken } = require("../extra/jwt");
const createHttpError = require("http-errors");

// Registration Route
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, email, username, password } = req.body;

    const { image } = req.files;
    if (req.files == undefined) {
      return res.status(400).send("Please upload a image file!");
    }
    if (!image.mimetype.startsWith('image')) {
      throw createHttpError(400, 'Only images are allowed');
    }
    let filepath = __dirname + '/../public/products/' + image.name
    image.mv(filepath);

    let filepathtoUplaod = '/images/' + image.name

    if (!firstName || !lastName || !mobileNumber || !email || !username || !password) {
      throw createHttpError(400, 'Please provide all the required fields');
    }

    // The URL/path for the uploaded image
    // const pictureUrl = req.file ? `http://localhost:4000/public/file/${req.file.filename}` : null;
    console.log("Hello");

    // Create a new user document
    const newUser = new patientSchema({
      firstName,
      lastName,
      mobileNumber,
      email,
      picture: filepathtoUplaod,
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


router.post("/upload", async (req, res) => {
  try {
    if (req.files === null) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const image = req.files.file;
    //  console.log(file);

    let filepath = __dirname + '/../public/products/' + image.name
    console.log(filepath);
    image.mv(filepath);

  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
})



module.exports = router;