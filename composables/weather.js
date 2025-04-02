export const useWeather = () => {

  const runtimeConfig = useRuntimeConfig();
  const apiKey = useState('apiKey', () => runtimeConfig.public.apiKey);
  const apiUrl = useState('apiUrl', () => runtimeConfig.public.apiUrl);
  const imgUrl = useState('imgUrl', () => runtimeConfig.public.imgUrl);
  const currentWeather = useState('currentWeather', () => null);
  const forecastWeather = useState('forecastWeather', () => []);

  const getForecastWeather = async(lat, lon, unit) => {
    try {
      console.log('fetching FORECAST WEATHER: ', `${apiUrl.value}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey.value}`);
      const response = await $fetch(`${apiUrl.value}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey.value}`);
      if (response) {
        forecastWeather.value = {
          daily: parseDailyWeatherData(response.list),
          hourly: parseHourlyData(response.list)
        };
      }
    } catch (error) {
      console.error('[ERROR] getForecastWeather: ', error);
    }    
  }

  function parseDailyWeatherData(data) {
    const dailyGroups = {};
    data.forEach(item => {
      const date = item.dt_txt.split(" ")[0];
      if (!dailyGroups[date]) {
          dailyGroups[date] = [];
      }
      dailyGroups[date].push(item);
    });

    return Object.keys(dailyGroups).map(date => {
      const dayData = dailyGroups[date];

      const mainCounts = {};
      dayData.forEach(item => {
          const main = item.weather[0].main;
          mainCounts[main] = (mainCounts[main] || 0) + 1;
      });

      const mostFrequentMain = Object.keys(mainCounts).reduce((a, b) =>
          mainCounts[a] > mainCounts[b] ? a : b
      );

      const dominantItem = dayData
          .filter(item => item.weather[0].main === mostFrequentMain)
          .pop();

      const temps = dayData.map(item => item.main.temp);
      const minTemps = dayData.map(item => item.main.temp_min);
      const maxTemps = dayData.map(item => item.main.temp_max);
      const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
      const minTemp = Math.min(...minTemps);
      const maxTemp = Math.max(...maxTemps);

      const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short" });

      return {
        dt: dayName,
        main: mostFrequentMain,
        description: useCapitalize(dominantItem.weather[0].description),
        icon: dominantItem.weather[0].icon,
        weatherIcon: `${imgUrl.value}/${dominantItem.weather[0].icon}.png`,
        temp: Number(avgTemp.toFixed(2)),
        minTemp: minTemp,
        maxTemp: maxTemp
      };
  });
}

  function parseHourlyData(data) {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return data
      .filter(item => {
        const itemTime = new Date(item.dt_txt);
        return itemTime >= now && itemTime <= next24Hours;
      })
      .map(item => {
        const time = item.dt_txt.split(" ")[1].slice(0, 5);
        return {
            dt: time,
            main: useCapitalize(item.weather[0].main),
            description: useCapitalize(item.weather[0].description),
            icon: item.weather[0].icon,
            temp: item.main.temp,
            minTemp: item.main.temp_min,
            maxTemp: item.main.temp_max,
            weatherIcon: `${imgUrl.value}/${item.weather[0].icon}.png`,
        };
      });
  }

  const fetchCurrentWeather = async(lat, lon, unit) => {
    try {
      console.log('fetching current weather: ', `${apiUrl.value}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey.value}`);
      const response = await $fetch(`${apiUrl.value}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey.value}`);
      if (response) {
        currentWeather.value = {
          rawIcon: response.weather[0].icon,
          weatherIcon: `${imgUrl.value}/${response.weather[0].icon}@4x.png`,
          main: response.weather[0].main,
          description: useCapitalize(response.weather[0].description),
          temp: response.main.temp,
          minTemp: response.main.temp_min,
          maxTemp: response.main.temp_max,
          feelsLike: response.main.feels_like,
          pressure: response.main.pressure,
          humidity: response.main.humidity,
          windSpeed: response.wind.speed,
          windDirection: windDirection(response.wind.deg),
          sunrise: convertUnixToReadable(response.sys.sunrise),
          sunset: convertUnixToReadable(response.sys.sunset),
          visibility: response.visibility
        };
      }

      // currentWeather.value = {
      //   rawIcon: '02n',
      //   weatherIcon: `${imgUrl.value}/02n@4x.png`,
      //   main: 'Clouds',
      //   description: useCapitalize('few clouds'),
      //   temp: 20.99,
      //   minTemp: 19.76,
      //   maxTemp: 20.99,
      //   feelsLike: 21.18,
      //   pressure: 1016,
      //   humidity: 78,
      //   windSpeed: 3.77,
      //   windDirection: windDirection(4.61)
      // };
    } catch (error) {
      console.error('[ERROR] fetchCurrentWeather: ', error);
    }
  }

  function convertUnixToReadable(unixTimestamp) {
      const date = new Date(unixTimestamp * 1000);
      return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')} ` +
           `${String(date.getUTCHours()).padStart(2, '0')}:${String(date.getUTCMinutes()).padStart(2, '0')}:${String(date.getUTCSeconds()).padStart(2, '0')}`;
  }

  function useCapitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  function windDirection(deg) {
    const directions = [
      "North (N)",
      "North-East (NE)",
      "East (E)",
      "South-East (SE)",
      "South (S)",
      "South-West (SW)",
      "West (W)",
      "North-West (NW)",
      "North (N)"
    ];
    const index = Math.round(deg / 45);

    return directions[index];
  }

  return {
    currentWeather,
    forecastWeather,
    fetchCurrentWeather,
    getForecastWeather
  }
}