<template>
  <div class="header-container">
    <div class="location-header">
      <button class="wishlist-star" @click="handleWishlist" v-if="currentLocation?.country">
        <span class="star-icon active">★</span>
      </button>
      <h2 class="location-name">{{ currentLocation?.name || 'Loading ...' }}</h2>
    </div>
    <div class="temperature-toggle">
      <span class="unit" :class="{ active: !useFahrenheit }">°C</span>
      <label class="switch">
        <input type="checkbox" v-model="useFahrenheit" @click="switchUnit(!useFahrenheit)">
        <span class="slider round"></span>
      </label>
      <span class="unit" :class="{ active: useFahrenheit }">°F</span>
    </div>
  </div>

  <div class="current-weather">
      <div class="weather-icon">
          <img id="weather-icon" :src="currentWeather?.weatherIcon" :alt="currentWeather?.main">
      </div>
      <div class="weather-info">
          <div id="location" class="location">Current weather</div>
          <div id="temperature" class="temperature">{{ currentWeather?.temp}}°{{ currentUnit }}</div>
          <div id="conditions" class="conditions">{{ currentWeather?.description || 'Loading ...'}}</div>
      </div>
  </div>

  <div class="weather-details">
      <div class="detail-item">
          <span>Humidity</span>
          <span class="bold">{{ currentWeather?.humidity}}%</span>
      </div>
      <div class="detail-item">
          <span>Wind</span>
          <span class="bold">{{ currentWeather?.windSpeed}} {{ currentUnit === 'C' ? 'meter/sec' : 'miles/hour' }}</span>
      </div>
      <div class="detail-item">
          <span>Pressure</span>
          <span class="bold">{{ currentWeather?.pressure}} hPa</span>
      </div>
      <div class="detail-item">
          <span>Feels Like</span>
          <span class="bold">{{ currentWeather?.feelsLike}}°{{ currentUnit }}</span>
      </div>
      <div class="detail-item">
          <span>Temperature</span>
          <span class="bold">{{ currentWeather?.minTemp}}°{{ currentUnit }} - {{ currentWeather?.maxTemp}}°{{ currentUnit }}</span>
      </div>
      <div class="detail-item">
          <span>Wind direction</span>
          <span class="bold">{{ currentWeather?.windDirection}}</span>
      </div>
      <div class="detail-item">
          <span>Visibility</span>
          <span class="bold">{{ currentWeather?.visibility}} meter</span>
      </div>
      <div class="detail-item">
          <span>Sun rise</span>
          <span class="bold">{{ currentWeather?.sunrise}}</span>
      </div>
      <div class="detail-item">
          <span>Sun set</span>
          <span class="bold">{{ currentWeather?.sunset}}</span>
      </div>
  </div>
</template>

<script setup>
const { currentWeather, fetchCurrentWeather, forecastWeather, getForecastWeather} = useWeather();
const { currentLocation, toggleWishlist } = useLocation();
const useFahrenheit = ref(false);
const currentUnit = ref('C');
const currentLat = ref(null);
const currentLon = ref(null);

const handleWishlist = () => {
  toggleWishlist(currentLocation.value)
}

function updateCurrentUnit(newUnit) {
  currentUnit.value = newUnit === 'metric' ? 'C' : 'F';
}

const switchUnit = async(newUnit) => {
  console.log('switching unit => ', newUnit ? 'F' : 'C');
  if (currentLocation.value?.lat && currentLocation.value?.lon) {
    currentLocation.value.unit = newUnit ? 'imperial' : 'metric';
    await fetchCurrentWeather(currentLocation.value.lat, currentLocation.value.lon, newUnit ? 'imperial' : 'metric');
    updateCurrentUnit(newUnit ? 'imperial' : 'metric');
  }
}

function getCurrentCoordinates() {
  let storedData = null;
  if (localStorage.getItem('currentPlace')) {
    storedData = JSON.parse(localStorage.getItem('currentPlace'))
  }
  if (navigator.geolocation) {
    const now = Date.now();
    if (null === storedData || storedData.ttl < now) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log('current position => ', position);
            let currentPlace = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              name: 'Weather in your current location',
              ttl: Date.now() + 60 * 60 * 1000
            };
            localStorage.setItem('currentPlace', JSON.stringify(currentPlace));
            currentLocation.value = {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              name: 'Weather in your current location'
            }
            console.log(`Latitude: ${currentLocation.value.lat}, Longitude: ${currentLocation.value.lon}`);
          },
          (error) => {
              console.error("Error getting location:", error.message);
          }
      );
    } else {
      currentLocation.value = {
        lat: storedData.lat,
        lon: storedData.lon,
        name: storedData.name
      }
    }
  } else {
      console.log("Geolocation is not supported by this browser.");
  }
}

onMounted(() => {
  getCurrentCoordinates();
});

watch(
  () => currentLocation.value,
  async(newLocation) => {
    if (newLocation) {
      console.log('watching ...', newLocation);
      await fetchCurrentWeather(newLocation.lat, newLocation.lon, useFahrenheit.value ? 'imperial' : 'metric');
      await getForecastWeather(newLocation.lat, newLocation.lon, useFahrenheit.value ? 'imperial' : 'metric');
      updateCurrentUnit(useFahrenheit.value ? 'imperial' : 'metric');
    }
  },
  { immediate: true }
);
</script>