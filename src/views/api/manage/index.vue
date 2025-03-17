<template>
  <div class="app-container">
    <iframe
      src="https://apifox.com/apidoc/shared-f1408f82-c185-4099-8b79-15884e25f571"
      width="100%"
      height="100%"
      frameborder="0"
    />
  </div>
</template>
<script setup lang="ts">
defineOptions({
  name: "ManageApi",
  inheritAttrs: false,
});
</script>

<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 50px);
}

.hasTagsView {
  .app-container {
    height: calc(100vh - 84px);
  }
}
</style>
