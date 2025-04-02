<template>
  <div class="forecast-item">
    <div class="forecast-day">{{ item.dt }}</div>
    <img :src="item.weatherIcon" alt="Sunny" class="forecast-icon">
    <div class="forecast-temp">
        <span class="max-temp">{{ item.maxTemp }}°</span>
        <span class="min-temp">{{ item.minTemp }}°</span>
    </div>
    <div class="forecast-desc">{{ item.main }}</div>
  </div>
</template>
<script setup>
defineProps({
  item: Object
});
</script>