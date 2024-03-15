<template>
  <div class="attachment-durable-goods">
    <Loading v-if="isLoading"/>
    <v-container v-else>
      <h5 class="text-h5 mt-2 mb-4"><b>รูปครุภัณฑ์</b></h5>
      <AttachFileBtn :value.sync="uploadingImageFiles" :attachments="imageFiles" btnLabel="แนบรูปเพิ่มเติม" accept="image/gif, image/jpeg, image/png, image/webp, image/jpg" :limit="2" showImage :multiple="false" @removeAttachment="onRemoveFile"/>
      <h5 class="text-h5 mt-10 mb-4"><b>เอกสารครุภัณฑ์</b></h5>
      <AttachFileBtn :value.sync="uploadingFiles" :attachments="files" accept=".xlsx, .txt, .log, .doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf, application/pdf" :limit="2" :multiple="false" @removeAttachment="onRemoveFile"/>
    </v-container>
  </div>
</template>

<script>
  export default {
    components: {
      Loading: () => import('~/components/Loading.vue'),
      AttachFileBtn: () => import('~/components/AttachFileBtn.vue'),
    },
    props: {
      isCreate: { type: Boolean },
    },
    data () {
      return {
        uploadingImageFiles: [],
        imageFiles: [],
        uploadingFiles: [],
        files: [],
        removeFiles: [],
        isLoading: !this.isCreate,
      }
    },
    mounted () {
      if (!this.isCreate) this.getAttachments()
    },
    methods: {
      async getAttachments () {
        
        try {
          this.isLoading = true
          const { data: files } = await this.$store.dispatch('http', { apiPath: `equipment/getUploadFile/${this.$route.params.durable_goods_id}` })
          const images = []
          const others = []
          files.forEach(file => {
            if (['.gif', '.jfif', '.pjpeg', '.jpeg', '.pjp', '.jpg', '.png', '.webp'].some(type => file.filename.includes(type)) && images.length < 2) {
              images.push(file)
            } else {
              others.push(file)
            }
          })
          this.imageFiles = images
          this.files = others
          this.isLoading = false
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      onRemoveFile (attach) {
        this.removeFiles.push(attach)
      },
      async deleteFiles () {
        try {

          await Promise.all(this.removeFiles.map(file => this.$axios({ method: 'delete', url: `${file}/delete`.replace('/frs/webservice', '') })))
          this.removeFiles = []
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      async uploadFiles () {
        try {
          const files = [...this.uploadingImageFiles, ...this.uploadingFiles]
          let data = new FormData()
          for (const file of files) {
            data.append('file', file)
          }
          data.append('equipmentId', this.$route.params.durable_goods_id)
          await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/uploadFile', data })
          this.uploadingImageFiles = []
          this.uploadingFiles = []
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      async upload () {
        try {
          if (this.uploadingImageFiles.length || this.uploadingFiles.length) await this.uploadFiles()
          if (this.removeFiles.length) await this.deleteFiles()
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
      async uploadCreate (idList = []) {
        try {
          if (this.uploadingImageFiles.length || this.uploadingFiles.length) {
            const files = [...this.uploadingImageFiles, ...this.uploadingFiles]
            let data = new FormData()
            for (const file of files) {
              data.append('file', file)
            }
            data.append('equipmentIds', idList.join(','))
            await this.$store.dispatch('http', { method: 'post', apiPath: 'equipment/uploadFileMultiEquipment', data })
            this.uploadingImageFiles = []
            this.uploadingFiles = []
          }
          return Promise.resolve()
        } catch (err) { return Promise.reject(err) }
      },
    },
  }
</script>

<style lang="scss">
  .attachment-durable-goods {
  }
</style>