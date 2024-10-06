const bcrypt = require("bcryptjs");

const password = "Shahid@123";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error("Error while hashing:", err);
  } else {
    console.log("Generated hash:", hash);
    // Compare the generated hash to the one in your database
  }
});
