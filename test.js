// CRUD create read

const { MongoClient, ObjectId } = require("mongodb");

const connectionURL = "mongodb://127.0.0.1:27017";
const database_name = "task_manager";

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    return console.log(err);
  }

  //   console.log("Connected correctly");

  const db = client.db(database_name);
  //   db.collection("users").insertOne(
  //     {
  //       name: "Andres",
  //       age: 47,
  //     },
  //     (err, result) => {
  //       if (err) {
  //         console.log("Unable to insert user");
  //       } else {
  //         console.log(result);
  //       }
  //     }
  //   );
  //   db.collection("users").insertMany(
  //     [
  //       { name: "Silvia", age: 95 },
  //       { name: "Albert", age: 99 },
  //     ],
  //     (err, result) => {
  //       if (err) return console.log("Docs are not inserted to database");
  //       console.log(result.acknowledged);
  //     }
  //   );
  db.collection("task-app").findOne(
    {
      _id: new ObjectId("6203dd812f9366dfe0e6bfd1"),
    },
    (err, data) => {
      if (err) {
        console.log("Network error");
      }
      if (!data) {
        console.log("No data found");
      } else {
        console.log("Here is your data", data);
      }
    }
  );
  //   db.collection("task-app").insertMany(
  //     [
  //       {
  //         description: "Plead your love",
  //         completed: false,
  //       },
  //       {
  //         description: "Listen to your song",
  //         completed: true,
  //       },
  //       {
  //         description: "Read the book",
  //         completed: false,
  //       },
  //     ],
  //     (err, result) => {
  //       if (err) {
  //         return console.log("Unable to insert");
  //       }
  //     }
  //   );
  //   db.collection("task-app").insertMany(
  //     [
  //       { description: "Boolean Algebra", completed: false },
  //       { description: "Greek Mythology", completed: true },
  //       { description: "English Literature", completed: false },
  //     ],
  //     (err, result) => {
  //       if (err) return console.log(err);
  //       const mb = db.collection("task-app").find({}).toArray();
  //       console.log(mb);
  //     }
  //   );
  //   db.collection("task-app").findOne({ completed: false }, (err, result) => {
  //     if (err) {
  //       console.log("Unsuccessfull fetching");
  //     }
  //     console.log(result);
  //   });

  //   db.collection("users")
  //     .find({ age: 47 })
  //     .toArray((err, result) => {
  //       console.log(result);
  //     });
  //   db.collection("users")
  //     .find({ age: 47 })
  //     .count((err, count) => {
  //       console.log(count);
  //     });
});
// Goal: Insert 3 tasks into a new task collection
// description (string), completed (boolean)
