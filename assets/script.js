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

// Show previous search list
function citySearch() {
  var $listOfSearchedCities = $("ul#list-of-searches");
  $listOfSearchedCities.empty();
  var getCityEnterred = !!localStorage.getItem("city-entered") ?
    JSON.parse(localStorage.getItem("city-entered")) : [];
  console.log(getCityEnterred);
  for (i = 0; i < getCityEnterred.length; i++) {
    var recentCity = $("<li>");
    recentCity.text(getCityEnterred[i]);
    recentCity.attr("");  
    $listOfSearchedCities.prepend(recentCity);
  }

  // On click response for list
  $("li").on("click", function(){
    console.log($(this).text());
    mainCityEnterred = ($(this).text());  
    trackSearch();
    });
}

// Date conversion from response
function dateConvert(dt) {
  var dateTest = new Date(dt * 1000);
  return dateTest.toLocaleDateString();
}

// Change units to celsius
function kelvinToCelsius(kelvinUnitsValue) {
  return Math.round(kelvinUnitsValue - 273.15);
}

// Current weather values
function todayDisplay(
  mainCityEnterred,
  todayDate,
  weatherSymbol,
  tempValueCelsius,
  humidValuePercent,
  speedOfWind,
  todayUvReading
) {
  $("#searchedName").text(mainCityEnterred);
  $("#todayDate").text(todayDate);
  $("#weatherSymbol").attr(
    "src",
    "http://openweathermap.org/img/wn/" + weatherSymbol + "@2x.png"
  );
  $("#tempValueCelsius").text(tempValueCelsius + "°C");
  $("#humidValuePercent").text(humidValuePercent + "%");
  $("#speedOfWind").text(speedOfWind + " metres/sec");
  $("#todayUvReading").text(todayUvReading);
}

// Five day values
function displayFiveDay(response) {
  var $outlookFiveDay = $("#outlookFiveDay");
  for (i = 1; i < 6; i++) {
    var dashboard = $("<div>");
    dashboard.attr("class", "card");
    $outlookFiveDay.append(dashboard);
    var dashboardMain = $("<div>");
    dashboardMain.attr("class", "card-body fiveDayValues",);
    dashboard.append(dashboardMain);

    console.log(response.daily[i].temp.day);
    var fiveDayDateValue = dateConvert(response.daily[i].dt);
    var h5 = $("<h5>");
    h5.text(fiveDayDateValue);
    dashboardMain.append(h5);

    console.log(response.daily[i].weather[0].icon);
    var futureWeatherSymbol = response.daily[i].weather[0].icon;
    var smallImg = $("<img>");
    smallImg.attr(
      "src",
      "http://openweathermap.org/img/wn/" + futureWeatherSymbol + "@2x.png"
    );
    dashboardMain.append(smallImg);

    var fiveDayOutlook = kelvinToCelsius(response.daily[i].temp.day);
    var valueTempSpacing = $("<div>");
    valueTempSpacing.text(fiveDayOutlook + "°C");
    dashboardMain.append(valueTempSpacing);

    var humidPredict = response.daily[i].humidity;
    var spacingHumid = $("<div>");
    spacingHumid.text("Humidity: " + humidPredict + "%");
    dashboardMain.append(spacingHumid);
  }
}

// Search button
$(document).ready(function() {
  $("#cityName").keyup(function(event) {
    if (event.which === 13) {
      $("#searchBtn").click();
    }
  })
});


function trackSearch (){
  
  // Clear forecast
  $("#outlookFiveDay").empty(), 
  //runs local storage function
  logSearch();

  var getGrid = getGridValue();
  // Get coord values for city
  $.ajax({
    url: getGrid,
    method: "GET",

    // Use response values for next call
  }).done(function (response) {
    console.log(response);
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    console.log(lat);
    console.log(lon);

    var openW = useWeatherApi(lat, lon);
    // Display data from responses
    $.ajax({
      url: openW,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      var dt = response.current.dt;
      var todayDate = dateConvert(dt);
      var weatherSymbol = response.current.weather[0].icon;
      console.log(weatherSymbol);
      var kelvinUnitsValue = response.current.temp;
      console.log(kelvinUnitsValue);
      var tempValueCelsius = kelvinToCelsius(kelvinUnitsValue.toString());
      var humidValuePercent = response.current.humidity;
      var speedOfWind = Math.round(response.current.wind_speed);
      var todayUvReading = Math.round(response.current.uvi);
      
      todayDisplay(
        titleCaseInput(mainCityEnterred),
        todayDate,
        weatherSymbol,
        tempValueCelsius,
        humidValuePercent,
        speedOfWind,
        todayUvReading
      
      );
         
      $("#cityName").val("");

      displayFiveDay(response); 
      
      // Colour coded UV readings
      $("#todayUvReading").removeClass();
      if (todayUvReading <= 2) {
        $("#todayUvReading").addClass('low');
        console.log("low" + todayUvReading);
      } else if (todayUvReading < 5) {
        $("#todayUvReading").addClass('medium');
        console.log("medium" + todayUvReading);
      } else if (todayUvReading < 7) {
        $("#todayUvReading").addClass('high');
        console.log("high" + todayUvReading);
      } else if (todayUvReading < 10) {
        $("#todayUvReading").addClass('veryhigh');
        console.log("very high" + todayUvReading);
      } else {
        $("#todayUvReading").addClass('extreme');
        console.log("extreme" + todayUvReading);
      }
    });
  });
}