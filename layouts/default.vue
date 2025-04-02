<template>
  <div class="container">
    <AppHeader />
    <AppSearchSection />
    <div class="main-content">
      <slot />
      <AppWishList />
    </div>
  </div>
</template>