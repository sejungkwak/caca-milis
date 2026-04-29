/**
 * Receives a selected cake item from the dashboard page.
 * Adds a new document to the shopping_cart collection
 * or increments an existing document's quantity by 1.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @returns {Response} A JSON response containing confirmation after adding cake to cart
 */
export async function GET(req, res) {
  // log a message to the console indicating that the request has reached the putInCart API.
  console.log("in the putInCart api page");

  // extract the cake id from the request
  const { searchParams } = new URL(req.url);
  const cakeId = searchParams.get("cakeId");
  const cakeName = searchParams.get("name");
  const cakePrice = searchParams.get("price");
  const quantity = searchParams.get("quantity");

  console.log(cakeId);

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

  // query the collection for a record based on the cake id
  const findCartObj = await collection
    .find({ username: "sample@test.com", "cake._id": cakeId })
    .toArray();

  let newQuantity;
  let cartObj;

  // assign cartObj differently depending on whether the cake is already in the cart
  if (findCartObj.length > 0) {
    // covert the current quantity and the quantity to add to integers, add them, then store the total as a string
    const currentQuantity = parseInt(findCartObj[0].cake.quantity);
    const quantityToadd = parseInt(quantity);
    const totalQuantity = (currentQuantity + quantityToadd).toString();

    newQuantity = totalQuantity;
  } else {
    newQuantity = quantity;
  }

  cartObj = {
    username: "sample@test.com",
    cake: {
      _id: cakeId,
      name: cakeName,
      price: cakePrice,
      quantity: newQuantity,
    },
  };

  // insert a new document into the shopping_cart collection,
  // or update an existing document if selected cake already exists
  const upsertResult = await collection.updateOne(
    { username: "sample@test.com", "cake._id": cakeId },
    { $set: cartObj },
    { upsert: true },
  );

  // ======================================== end database call

  // return success response
  return Response.json({ data: "" + "inserted" + "" });
}
