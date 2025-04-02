<template>
  <div class="search-container">
    <input type="text" id="location-input" v-model="searchTerm" placeholder="Enter city name or zip code..." @keyup.enter="handleSearch">
    <button id="search-btn" @click="handleSearch">Search</button>
  </div>
  <div id="error-message" class="error-message" style="display: none;"></div>
</template>

<script setup>
const { getGeoCoordinates, currentLocation } = useLocation();
const searchTerm = ref('');

const handleSearch = async() => {
  await getGeoCoordinates(searchTerm.value);
  searchTerm.value = '';
}
</script>