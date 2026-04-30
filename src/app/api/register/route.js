/**
 * Receives the user input from the sign up form.
 * Adds a new document to the users collection.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @returns {Response} A JSON response containing the hard-coded validity flag
 */
export async function GET(req, res) {
  // log a message to the console indicating that the request has reached the API.
  console.log("in the api page");

  // extract the email and password from the request
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const pass = searchParams.get("pass");
  const role = searchParams.get("role");

  console.log(email);
  console.log(pass);
  console.log(role);

  // database call ========================================

  // import the MongoDB library
  const { MongoClient } = require("mongodb");

  // create a MongoDB client instance using the Atlas connection string
  const url = process.env.MONGO_CONNECTION;
  const client = new MongoClient(url);

  // store database and collection names in variables
  const dbName = "caca-milis";
  const collName = "users";

  // connect to MongoDB
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection(collName);

  // insert a new document into the users collection
  const insertResult = await collection.insertOne({
    email: email,
    password: pass,
    role: role,
  });

  // ======================================== end database call

  let valid = true;

  // return the hard-coded validity flag
  return Response.json({ data: "" + valid + "" });
}
