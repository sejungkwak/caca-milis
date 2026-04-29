/**
 * Receives the user input from the sign in form.
 * Validates the data against the database.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @returns {Response} A JSON response containing the validation result
 */
export async function GET(req, res) {
  // log a message to the console indicating that the request has reached the API.
  console.log("in the api page");

  // extract the email and password from the request
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("username");
  const pass = searchParams.get("pass");

  console.log(email);
  console.log(pass);

  // database call ========================================

  // import the MongoDB library
  const { MongoClient } = require("mongodb");

  // create a MongoDB client instance using the Atlas connection string
  const url = process.env.MONGO_CONNECTION;
  const client = new MongoClient(url);

  // store database and collection names in variables
  const dbName = "caca-milis";
  const collName = "sign_in";

  // connect to MongoDB
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection(collName);

  // query the collection for a corresponding user record based on the username
  const findResult = await collection.find({ username: email }).toArray();
  console.log("Found documents =>", findResult);

  // ======================================== end database call

  let valid = false;
  // valid only if both the username and password match the record
  if (findResult.length > 0 && findResult[0]["pass"] === pass) {
    valid = true;
    console.log("login valid");
  } else {
    valid = false;
    console.log("login invalid");
  }

  // return the validation result
  return Response.json({ data: "" + valid + "" });
}
