/**
 * Fetches weather data for Dublin from Weatherapi.com
 * and returns the current temperature as JSON.
 *
 * @param {*} req HTTP request
 * @param {*} res HTTP response
 * @returns {Response} A JSON response containing the current temperature in Dublin
 */
export async function GET(req, res) {
  // log a message to the console indicating that the request has reached the API.
  console.log("in the weather api page");

  // fetch the current weather data for Dublin
  const res2 = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHERAPI_KEY}&q=Dublin&aqi=no`,
  );

  // parse the response as JSON
  const data = await res2.json();

  // extract the current temperature
  let currentTemp = data.current.temp_c;

  console.log(currentTemp);

  // return the current temperature as JSON
  return Response.json({ temp: currentTemp });
}
