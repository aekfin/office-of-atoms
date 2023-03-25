<template>
  <div class="upload-image">
    <div class="mt-8 image-uploader" :style="{ backgroundImage: `url('${previewImage}')` }" @click="onUploadImage">
      <div :class="`filter-upload${previewImage ? '' : ' is-show'}`">
        <i class="material-icons" style="color: white;">image</i>
        <div class="text-white text-lg">อัพโหลดรูปภาพ</div>
      </div>
    </div>
    <input v-show="false" ref="uploadImage" type="file" accept="image/*" @change="onChangeImage">    
  </div>
</template>

<script>
  export default {
    props: {
      image: { type: String, default: '' },
    },
    data () {
      return {
        previewImage: this.image,
      }
    },
    watch: {
      'image' (val) {
        this.previewImage = val
      },
      'previewImage' (val) {
        this.$emit('update:image', val)
      }
    },
    methods: {
      onUploadImage () {
       if (this.$refs.uploadImage) this.$refs.uploadImage.click()
      },
      onChangeImage ({ target: { files } }) {
        const reader = new FileReader()
        reader.readAsDataURL(files[0])
        reader.onload = () => {
          this.previewImage = reader.result
        }
      },
    }
  }
</script>

<style lang="scss">
  .upload-image {
    width: 200px;

    .image-uploader {
      background-color: #9E9E9E;
      transition-duration: 0.3s;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      cursor: pointer;
      background-position: center;
      background-size: cover;
      overflow: hidden;

      .filter-upload {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-flow: column;
        opacity: 0;
        width: 100%;
        height: 100%;
        transition-duration: 0.3s;

        &.is-show {
          opacity: 100;
          background-color: rgba(0, 0, 0, 0);;
        }

        &:hover {
          opacity: 100;
          background-color: rgba(0, 0, 0, 0.5);
        }
      }

      i {
        font-size: 64px;
      }
    }
  }
</style>