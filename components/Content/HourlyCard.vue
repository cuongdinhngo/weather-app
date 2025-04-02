<template>
  <div class="forecast-item">
    <div class="forecast-time">{{ item?.dt || '...' }}</div>
    <img :src="item?.weatherIcon" alt="Sunny" class="forecast-icon">
    <div class="forecast-temp">{{ item?.temp }}°</div>
    <div class="forecast-desc">{{ item?.description }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  item: Object
});
</script>