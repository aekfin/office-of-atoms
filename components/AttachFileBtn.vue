<template>
  <div :class="`attach-file-btn${showImage ? ' show-image' : ''}`">
    <input v-show="false" ref="inputFile" type="file" :accept="accept" :multiple="multiple" @change="onChange">
    <v-btn v-if="[...files, ...attachmentList].length < limit" elevation="2" color="#546E7A" class="text-white" @click="attach">แนบไฟล์เพิ่มเติม</v-btn>
    <div class="attach-wrapper">
      <div v-for="(attachment, i) in attachmentList" :key="i" class="attach mt-4">
        <div v-if="showImage" class="img-wrapper">
          <img :src="attachment.fileUrl" alt="image" class="img-preview">
          <v-btn class="remove-btn" @click.stop="onDeleteAttachment(attachment)">
            <i class="material-icons">close</i>
          </v-btn>
        </div>
        <div v-else class="file">
          <a class="file-name-wrapper" :href="attachment.fileUrl" target="_blank">
            <i class="material-icons">download</i>
            <div class="name ml-1">{{ attachment.filename }}</div>
          </a>
          <v-btn icon @click.stop="onDeleteAttachment(attachment)">
            <i class="material-icons">close</i>
          </v-btn>
        </div>
      </div>
      <div v-for="(file, i) in files" :key="i" class="attach mt-4">
        <div v-if="showImage" class="img-wrapper ">
          <img :src="getImage(file)" alt="image" class="img-preview">
          <v-btn class="remove-btn" @click.stop="onDelete(file)">
            <i class="material-icons">close</i>
          </v-btn>
        </div>
        <div v-else class="file">
          <div class="file-name-wrapper">
            <i class="material-icons">upload_file</i>
            <div class="name ml-1">{{ file.name }}</div>
          </div>
          <v-btn icon @click.stop="onDelete(file)">
            <i class="material-icons">close</i>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: { type: Array, default: () => [] },
      attachments: { type: Array, default: () => [] },
      multiple: { type: Boolean, default: true },
      limit: { type: Number, default: Infinity },
      accept: { type: String, default: '*' },
      showImage: { type: Boolean },
    },
    data () {
      return {
        files: this.value,
        attachmentList: this.attachments,
      }
    },
    watch: {
      'files' (val) {
        this.$emit('update:value', val)
      },
      'value' (val) {
        this.files = val
      },
      'attachments' (val) {
        this.attachmentList = val
      },
    },
    methods: {
      onDelete (file) {
        this.files = this.files.filter(f => f.name !== file.name)
      },
      onDeleteAttachment (attachment) {
        const removeAttachment = this.attachmentList.find(a => a.fileUrl === attachment.fileUrl)
        this.attachmentList = this.attachmentList.filter(a => a.fileUrl !== attachment.fileUrl)
        this.$emit('removeAttachment', removeAttachment?.fileUrl)
      },
      attach () {
        if (this.$refs.inputFile) this.$refs.inputFile.click()
      },
      getImage (file) {
        return URL.createObjectURL(file)
      },
      onChange (e) {
        const files = e.target.files
        const filesPath = []
        for (const file of files) {
          this.files.push(file)
          // this.filesPath.push(URL.createObjectURL(file))
        }
        this.$emit('select', { files, filesPath })
      }
    }
  }
</script>

<style lang="scss">
  .attach-file-btn {
    display: flex;
    flex-flow: column;
    align-items: flex-start;
    width: 100%;

    .file {
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
          min-width: 180px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      a.file-name-wrapper {
        color: inherit;
      }
    }

    .img-wrapper {
      position: relative;

      .v-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        
        &.remove-btn {
          border-radius: 50%;
          padding: 0;
          min-width: 28px;
          min-height: 28px;
          width: 28px;
          height: 28px;

          i {
            font-size: 20px;
          }
        }
      }

      .img-preview {
        max-width: 320px;
        max-height: 240px;
      }
    }

    &.show-image {
      .attach-wrapper {
        position: relative;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
      }
    }
  }
</style>