/**
 * Retrieves all the documents from the shopping_cart collection
 * and returns them as a JSON response.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @returns {Response} A JSON response containing the query result
 */
export async function GET(req, res) {
  // log a message to the console indicating that the request has reached the API.
  console.log("in the api page");

  // database call ========================================

  // import the MongoDB library
  const { MongoClient } = require("mongodb");

  // create a MongoDB client instance using the Atlas connection string
  const url = process.env.MONGO_CONNECTION;
  const client = new MongoClient(url);

  // store database and collection names in variables
  const dbName = "caca-milis";
  const collName = "shopping_cart";

  // connect to MongoDB
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection(collName);

  // query all documents in the collection and return them as an array
  const findResult = await collection
    .find({ username: "sample@test.com" })
    .toArray();
  console.log("Found documents =>", findResult);

  // ======================================== end database call

  // return the query result as a JSON response
  return Response.json(findResult);
}
