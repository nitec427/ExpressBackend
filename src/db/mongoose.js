const mongoose = require("mongoose");
// const validator = require("validator");
mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
});

// const task1 = new Task({
//   //   description: "Clean the furnitures",
//   completed: false,
// });

// task1
//   .save()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => console.log(err.message));
