<template>
  <div class="iframe-container">
    <iframe
      v-if="currentLat && currentLon"
      frameborder="0"
      allow="geolocation"
      :src="mapUrl"
    ></iframe>
    <USkeleton class="h-20 w-500 rounded" v-else/>
  </div>
</template>

<script setup>
const { currentLocation } = useLocations();

const currentLat = ref(null);
const currentLon = ref(null);
const mapUrl = ref(null);

watch(
  () => currentLocation.value,
  (newLocation) => {
    currentLat.value = currentLocation.value.lat;
    currentLon.value = currentLocation.value.lon;
    mapUrl.value = `https://openweathermap.org/weathermap?basemap=map&layer=wind&lat=${currentLat.value}&lon=${currentLon.value}&zoom=5&cities=true`;
  }
);
</script>