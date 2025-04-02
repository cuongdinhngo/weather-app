<template>
  <section class="wishlist-section">
      <h2>Your Wishlist</h2>
      <div class="wishlist-items" id="wishlist-container">
          <p class="empty-message" v-if="wishlist?.length == 0">No locations added to wishlist yet</p>
          <WishlistItem
            v-for="(item, key) in wishlists"
            :key="key"
            :wishlist="item[1]"
            :id="item[0]"
          />
      </div>
  </section>
</template>

<script setup>
const { wishlists, loadWishlists } = useLocation();

onMounted(() => {
  loadWishlists();
});
</script>