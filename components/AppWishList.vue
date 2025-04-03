<template>
  <section class="wishlist-section">
    <div class="wishlist-header">
      <h2>Your Wishlist</h2>
      <button class="alert-button" @click="showAlertModal = true">
        <span>Weather Alert</span>
      </button>
    </div>
    <div class="wishlist-items" id="wishlist-container">
      <p class="empty-message" v-if="wishlists?.length == 0">No locations added to wishlist yet</p>
      <WishlistItem
        v-for="(item, key) in wishlists"
        :key="key"
        :wishlist="item[1]"
        :id="item[0]"
      />
    </div>
  </section>

  <!-- Alert Modal -->
  <div class="modal-overlay" v-if="showAlertModal" @click.self="showAlertModal = false">
    <div class="alert-modal">
      <div class="modal-header">
        <h3>Create Weather Alert</h3>
        <button class="close-button" @click="showAlertModal = false">×</button>
      </div>
      
      <div class="modal-body">
        <form @submit.prevent="createAlert">
          <div class="form-group">
            <label>Location</label>
            <select required>
              <option>----</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Condition</label>
            <select required>
              <option>----</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Threshold Value</label>
            <input type="number" required>
          </div>
          
          <div class="form-group">
            <label>Alert Type</label>
            <select required>
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </div>
          
          <button type="submit" class="submit-button">Create Alert</button>
        </form>
        
        <div class="alerts-list">
          <h4>Your Active Alerts</h4>
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Condition</th>
                <th>Threshold</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { wishlists, loadWishlists } = useLocations();
const showAlertModal = ref(false);

onMounted(() => {
  loadWishlists();
});
</script>

<style scoped>
.wishlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.alert-button {
  background-color: #3ca3e7;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.alert-button:hover {
  background-color: #1773a4;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.alert-modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group select, 
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.submit-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.alerts-list {
  margin-top: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f5f5f5;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}
</style>