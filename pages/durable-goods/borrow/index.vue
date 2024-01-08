<template>
  <div id="durable-goods-borrow-parent-page">
    <v-tabs class="tabs-underline mb-10" exact exactPath>
      <v-tab :to="{ path: '/durable-goods/borrow/' }">
        <div>ยืมครุภัณฑ์</div>
      </v-tab>
      <!-- <v-tab :to="{ path: '/durable-goods/borrow/return/' }">
        <div>คืนครุภัณฑ์</div>
      </v-tab> -->
    </v-tabs>
    <NChild/>
  </div>
</template>

<style lang="scss">
  #durable-goods-borrow-parent-page {
  }
</style>