<template>
  <section class="weather-section" :style="backgroundColor">
    <ContentMain />

    <div class="forecast-container">
        <ContentDaily />

        <ContentHourly />

        <ContentMap />
    </div>
    
  </section>
</template>

<script setup>
const weatherColors = {
  "Thunderstorm": "#4B3F72",
  "Drizzle": "#A9B7C0",
  "Rain": "#4682B4",
  "Snow": "#F5F6F5",
  "Atmosphere": "#D3D3D3",
  "Clear": "#87CEEB",
  "Clouds": "#d5cbcb"
};
const { currentWeather } = useWeather();
const backgroundColor = ref('');

watch(
  () => currentWeather.value,
  (newWeather) => {
    backgroundColor.value = `background-color: ${weatherColors[newWeather.main]}`
  }
);
</script>