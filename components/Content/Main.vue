<template>
  <div class="header-container">
    <div class="location-header">
      <UIcon :name="isFavouriteLocation ? 'iconoir:star-solid' : 'iconoir:star'" :class="['size-9', {'text-amber-400': isFavouriteLocation}]" @click="handleWishlist" v-if="currentLocation?.country"/>
      <h2 class="location-name" v-if="currentLocation">{{ currentLocation?.name }}</h2>
      <USkeleton class="h-8 w-[200px]" v-else/>
    </div>
    <div class="temperature-toggle">
      <span class="unit" :class="{ active: !useFahrenheit }">°C</span>
      <USwitch v-model="useFahrenheit" @click="switchUnit()" style="background-color: #fff;"/>
      <span class="unit" :class="{ active: useFahrenheit }">°F</span>
    </div>
  </div>

  <div class="current-weather">
      <div class="weather-icon" v-if="currentWeather">
          <img id="weather-icon"  :src="currentWeather?.weatherIcon" :alt="currentWeather?.main">
      </div>
      <USkeleton class="h-20 w-20 rounded-full" v-else/>
      <div class="weather-info" v-if="currentWeather">
          <div id="location" class="location">Current weather</div>
          <div id="temperature" class="temperature">{{ currentWeather?.temp}}°{{ currentTempUnit }}</div>
          <div id="conditions" class="conditions">Condition: {{ currentWeather?.description || 'Loading ...'}}</div>
          <div id="conditions" class="conditions">Air Quality: {{ currentWeather?.airPollution || 'Loading ...'}}</div>
      </div>
      <USkeleton class="h-20 w-50 rounded" v-else/>
  </div>

  <div class="weather-details">
      <div class="detail-item" v-if="currentWeather">
        <span>Humidity</span>
        <span class="bold">{{ currentWeather?.humidity}}%</span>
      </div>
      <USkeleton class="h-20 w-60 rounded" v-else/>
      
      <div class="detail-item" v-if="currentWeather">
          <span>Wind</span>
          <span class="bold">{{ currentWeather?.windSpeed}} {{ currentTempUnit === 'C' ? 'meter/sec' : 'miles/hour' }}</span>
      </div>
      <USkeleton class="h-20 w-60 rounded" v-else/>
      
      <div class="detail-item" v-if="currentWeather">
          <span>Pressure</span>
          <span class="bold">{{ currentWeather?.pressure}} hPa</span>
      </div>
      <USkeleton class="h-20 w-60 rounded" v-else/>
      
      <div class="detail-item" v-if="currentWeather">
          <span>Feels Like</span>
          <span class="bold">{{ currentWeather?.feelsLike}}°{{ currentTempUnit }}</span>
      </div>
      <USkeleton class="h-20 w-60 rounded" v-else/>
      
      <div class="detail-item" v-if="currentWeather">
          <span>Temperature</span>
          <span class="bold">{{ currentWeather?.minTemp}}°{{ currentTempUnit }} - {{ currentWeather?.maxTemp}}°{{ currentTempUnit }}</span>
      </div>
      <USkeleton class="h-20 w-60 rounded" v-else/>
      
      <div class="detail-item" v-if="currentWeather">
          <span>Wind direction</span>
          <span class="bold">{{ currentWeather?.windDirection}}</span>
      </div>
      <USkeleton class="h-20 w-60 rounded" v-else/>
      
      <div class="detail-item" v-if="currentWeather">
          <span>Visibility</span>
          <span class="bold">{{ currentWeather?.visibility}} meter</span>
      </div>
      <USkeleton class="h-20 w-60 rounded" v-else/>
      
      <div class="detail-item" v-if="currentWeather">
          <span>Sun rise</span>
          <span class="bold">{{ currentWeather?.sunrise}}</span>
      </div>
      <USkeleton class="h-20 w-60 rounded" v-else/>
      
      <div class="detail-item" v-if="currentWeather">
          <span>Sun set</span>
          <span class="bold">{{ currentWeather?.sunset}}</span>
      </div>
      <USkeleton class="h-20 w-60 rounded" v-else/>
  </div>
</template>

<script setup>
console.log('rendering Main >>>>');
const { currentWeather, fetchCurrentWeather, forecastWeather, getForecastWeather} = useWeather();
const { currentLocation, toggleWishlist, isFavouriteLocation, checkFavouriteLocation } = useLocations();
const { coords } = useGeolocation();

const useFahrenheit = ref(false);
const currentTempUnit = ref('C');
const currentUnitMeasurement = ref('metric');

const handleWishlist = () => {
  toggleWishlist(currentLocation.value);
  isFavouriteLocation.value = !isFavouriteLocation.value;
}

function updateTempUnit(isImperial) {
  currentTempUnit.value = isImperial ? 'F' : 'C';
  currentUnitMeasurement.value = isImperial ? 'imperial' : 'metric';
}

const switchUnit = async() => {
  useFahrenheit.value = !useFahrenheit.value
  if (currentLocation.value?.lat && currentLocation.value?.lon) {
    updateTempUnit(useFahrenheit.value);
    await fetchCurrentWeather(currentLocation.value.lat, currentLocation.value.lon, currentUnitMeasurement.value);
    await getForecastWeather(currentLocation.value.lat, currentLocation.value.lon, currentUnitMeasurement.value);
  }
}

watch(coords, async(newCoords) => {
  if (newCoords?.latitude && newCoords?.longitude) {
    const response = await getDetailLocation(newCoords.latitude, newCoords.longitude);
    console.log('watching new coords :: ',newCoords.latitude, newCoords.longitude);
    currentLocation.value = {
      name: `${response?.address.city}, ${response?.address.country}`,
      lat: newCoords.latitude,
      lon: newCoords.longitude,
      country: response?.address.country
    }
    isFavouriteLocation.value = checkFavouriteLocation(currentLocation.value);
  }
});

watch(
  () => currentLocation.value,
  async(newLocation) => {
    if (newLocation) {
      console.log('watch fetching weather >>>>>', newLocation);
      updateTempUnit(useFahrenheit.value);
      await fetchCurrentWeather(newLocation.lat, newLocation.lon, currentUnitMeasurement.value);
      await getForecastWeather(newLocation.lat, newLocation.lon, currentUnitMeasurement.value);
      isFavouriteLocation.value = checkFavouriteLocation(currentLocation.value);
    }
  },
  { immediate: true }
);
</script>