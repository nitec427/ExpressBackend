const { MongoClient, ObjectId } = require("mongodb");
const connectionU_url = "mongodb://127.0.0.1:27017";
const db_name = "task_manager";

MongoClient.connect(
  connectionU_url,
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      console.log("Unable to connect to MongoDB");
    }
    const db = client.db(db_name);
    // Update Many Syntax
    // db.collection("task-app")
    //   .updateMany(
    //     {
    //       completed: true,
    //     },
    //     {
    //       $set: { completed: false },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    db.collection("task-app")
      .deleteOne({
        description: "Boolean Algebra",
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
    // const findPrem = db.collection("users").findOne({
    //   _id: new ObjectId("620381a14cea3b73bb6ea11c"),
    // });
    // findPrem
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((err) => console.error(err));
    // db.collection("users")
    //   .updateOne(
    //     {
    //       _id: new ObjectId("620381a14cea3b73bb6ea11c"),
    //     },
    //     {
    //       $set: {
    //         age: 28,
    //       },
    //     }
    //   )
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((err) => console.error(err));
  }
);
