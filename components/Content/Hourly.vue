<template>
<div class="forecast-section">
    <h2>3-Hours Forecast</h2>
    <div class="hourly-forecast-items">
      <ContentHourlyCard
        v-for="item in hourlyItems"
        :key="item.dt"
        :item="item"
      />
    </div>
</div>
</template>

<script setup>
const {forecastWeather} = useWeather();
const hourlyItems = ref([]);

watch(
  () => forecastWeather.value,
  (newData) => {
    hourlyItems.value = forecastWeather.value.hourly
  }
);
</script>