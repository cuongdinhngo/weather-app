<template>
  <div class="search-container">
    <input type="text" id="location-input" v-model="searchTerm" placeholder="Enter city name or zip code..." @keyup.enter="handleSearch">
    <UButton icon="fa-solid:search" size="md" color="primary" variant="solid" @click="handleSearch" class="std-button">Search</UButton>
  </div>
  <div id="error-message" class="error-message" style="display: none;"></div>
</template>

<script setup>
const { getGeoCoordinates, currentLocation } = useLocations();
const searchTerm = ref('');

const handleSearch = async() => {
  await getGeoCoordinates(searchTerm.value);
  searchTerm.value = '';
}
</script>