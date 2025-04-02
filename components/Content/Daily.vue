<template>
  <div class="forecast-section">
    <h2>5-Days Forecast</h2>
    <div class="daily-forecast-items">
      <ContentDailyCard
        v-for="item in dailyItems"
        :key="item.dt"
        :item="item"
      />
    </div>
  </div>
</template>

<script setup>
const { forecastWeather } = useWeather();
const dailyItems = ref([]);

watch(
  () => forecastWeather.value,
  (newData) => {
    dailyItems.value = forecastWeather.value.daily
  }
);
</script>