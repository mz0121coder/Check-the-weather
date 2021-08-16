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
  var getResponseFromApi = {
    lat: latValue,
    lon: lonValue,
    appid: "35463baba77cb93af45f2339eaedb98d",
  };
  console.log(openW + $.param(getResponseFromApi));
  return openW + $.param(getResponseFromApi);
}

// Use title case for searches
function titleCaseInput(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

// Log searches with local storage
function logSearch() {
  var loggedValue = titleCaseInput($("#cityName").val());
  console.log(loggedValue + "storage");
  var getCityEnterred = !!localStorage.getItem("city-entered") ?
    JSON.parse(localStorage.getItem("city-entered")) : [];
// Test if city was searched with boolean 
  var cityTest = getCityEnterred.includes(loggedValue);
  console.log(cityTest + "Boolean test");
  if (cityTest == false){
  getCityEnterred.push(loggedValue);
  localStorage.setItem("city-entered", JSON.stringify(getCityEnterred));
  citySearch();
  }
}