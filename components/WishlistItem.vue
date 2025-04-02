<template>
  <div class="wishlist-item">
    <span @click="getCurrentWeather" style="cursor: pointer;">{{ wishlist.name }}</span>
    <button class="remove-btn" @click="removeWishlist(id)">Remove</button>
  </div>
</template>

<script setup>
const props = defineProps({
  wishlist: Object,
  id: String
});
const { fetchCurrentWeather } = useWeather();
const { toggleWishlist, currentLocation } = useLocation();

const removeWishlist = (id) => {
  console.log('remove => ', id)
  toggleWishlist(props.wishlist);
}

const getCurrentWeather = async() => {
  console.log('getCurrentWeather => ', props.wishlist.lat, props.wishlist.lon, props.wishlist.unit);
  currentLocation.value = props.wishlist;
}
</script>