var mainCityEnterred = "";

// Return lat and lon response for city entered
function getGridValue() {
  var getGrid = "https://api.openweathermap.org/data/2.5/weather?";
  var gridLocation = {
    q: mainCityEnterred,
    appid: "35463baba77cb93af45f2339eaedb98d",
  };
  console.log(getGrid + $.param(gridLocation));
  return getGrid + $.param(gridLocation);
}

// Retrieve data to be displayed
function useWeatherApi(latValue, lonValue) {
  var openW = "https://api.openweathermap.org/data/2.5/onecall?";
  var getResponse = {
    lat: latValue,
    lon: lonValue,
    appid: "35463baba77cb93af45f2339eaedb98d",
  };
  console.log(openW + $.param(getResponse));
  return openW + $.param(getResponse);
}