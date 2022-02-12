require("./src/db/mongoose");

const Task = require("./src/models/task");
const _id = "62054138c9d8ef780e56645e";
Task.findByIdAndRemove(_id)
  .then((user) => {
    if (!user) {
      console.log("No item found to delete");
    } else {
      console.log("The item that was deleted", user);
    }
    return Task.countDocuments({ completed: true });
  })
  .then((count) => {
    console.log(count);
  })
  .catch((err) => {
    console.log("Network error: " + err);
  });

const deleteTaskandCount = async (id) => {
  const task = await Task.findByIdAndDelete(id);
  const count = await Task.countDocuments({});
  return count;
};

deleteTaskandCount("6204df6cebac33b76a2e0968")
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
