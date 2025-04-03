<template>
  <div class="wishlist-item">
    <span @click="getCurrentWeather" style="cursor: pointer;">{{ wishlist.name }}</span>
    <UButton icon="fa-solid:trash-alt" size="md" color="error" variant="solid" @click="removeWishlist(id)" class="std-button"></UButton>
  </div>
</template>

<script setup>
const props = defineProps({
  wishlist: Object,
  id: String
});
const { fetchCurrentWeather } = useWeather();
const { toggleWishlist, currentLocation, isFavouriteLocation } = useLocations();

const removeWishlist = (id) => {
  toggleWishlist(props.wishlist);
}

const getCurrentWeather = async() => {
  currentLocation.value = props.wishlist;
  isFavouriteLocation.value = true;
}
</script>