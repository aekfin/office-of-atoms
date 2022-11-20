<template>
  <div class="attach-file-btn">
    <input v-show="false" ref="input-file" type="file" accept="*" @change="onChange">
    <v-btn elevation="2" color="#546E7A" class="text-white" @click="attach">แนบไฟล์เพิ่มเติม</v-btn>
    <div v-for="(file, i) in files" :key="i" class="file mt-4">
      <div class="file-name-wrapper">
        <v-icon>mdi-file-outline</v-icon>
        <div class="name ml-1">{{ file.name }}</div>
      </div>
      <v-icon class="ml-4" color="#E53935" @click.stop="onDelete(file)">mdi-delete</v-icon>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        files: []
      }
    },
    methods: {
      onDelete (file) {
        this.files = this.files.filter(f => f.name !== file.name)
      },
      attach () {
        if (this.$refs['input-file']) this.$refs['input-file'].click()
      },
      onChange (e) {
        const file = e.target.files?.[0]
        if (file) this.files.push(file)
      }
    }
  }
</script>

<style lang="scss">
  .attach-file-btn {
    display: flex;
    flex-flow: column;
    align-items: flex-end;
    width: 100%;

    .file {
      align-self: flex-start;
      margin-top: 8px;
      background: #E0E0E0;
      border-radius: 8px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-width: 25%;
      max-width: 100%;

      .file-name-wrapper {
        display: flex;
        max-width: calc(100% - 40px);

        .name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>