require("./src/db/mongoose");
const User = require("./src/models/user");

// Promises is used with await keyword and they behave as if they are sync functions
// User.findByIdAndUpdate("6204de3db9d08d0a187d1ce0", { age: 18 })
//   .then((user) => {
//     console.log(user);
//     return User.countDocuments({ age: 18 });
//   })
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const updateAgeAndCount = async (id, age) => {
  const user = await User.findByIdAndUpdate(id, { age: 2 }); /* age: age */
  const count = await User.countDocuments({ age });
  return count;
};

updateAgeAndCount("6204db962cc208b1c6af1a5c", 2)
  .then((count) => {
    console.log(count);
  })
  .catch((e) => {
    console.log(e);
  });
