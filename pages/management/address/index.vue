<template>
  <div id="department-page">
    <PageHeader text="ข้อมูลที่อยู่" hideTotal/>
    <div>
      <v-container>
        <h5 class="text-h5 mt-10 mb-4"><b>ดาวน์โหลดตัวอย่างไฟล์ Excel </b></h5>
        <v-btn elevation="2" color="#546E7A" class="text-white" @click="downloadExcel">
          ดาวน์โหลดไฟล์
        </v-btn>
        
        <h5 class="text-h5 mt-10 mb-4"><b>อัปโหลดข้อมูลที่อยู่ไฟล์ Excel </b></h5>
        <input v-show="false" ref="inputFile" type="file" accept=".xlsx, .xls" @change="handleFileUpload">
        <v-btn elevation="2" color="#546E7A" class="text-white" @click="attach">อัปโหลดไฟล์</v-btn>
      </v-container>
    </div>    
    <Loading v-if="isLoading"/>
  </div>
</template>

<script>
  export default {
    components: {
      Loading: () => import('~/components/Loading.vue'),
    },
  data () {
    return {
      selectedFile: null, // เก็บไฟล์ที่เลือก
      isLoading: false,
    };
  },
  methods: {
    handleFileUpload (event) {
      this.selectedFile = event.target.files[0]; // เก็บไฟล์จาก input
      this.submitFile()
    },
    async submitFile () {
      if (!this.selectedFile) {
        alert("กรุณาเลือกไฟล์");
        return;
      }
      
      this.isLoading = true
      const formData = new FormData();
      formData.append("file", this.selectedFile);  // แนบไฟล์ที่ผู้ใช้เลือก

      
      try {
        const response = await fetch('/api/thirdParty/uploadFile', {
          method: 'POST',
          body: formData,
        });
        console.log('xxxxxxxxxxxxxwwwwwwwwwx data ',response);
        if (response.ok) {
          // alert("อัปโหลดไฟล์สำเร็จ");
          await this.$store.dispatch('snackbar', { text: 'อัปโหลดไฟล์สำเร็จ' })
        } else {
          // alert("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
          await this.$store.dispatch('snackbar', { text: `Error: เกิดข้อผิดพลาดในการอัปโหลดไฟล์`, props: { color: 'red', top: true } })
        }
      } catch (error) {
        console.error("Error:", error);
        await this.$store.dispatch('snackbar', { text: `Error: เกิดข้อผิดพลาดในการอัปโหลดไฟล์`, props: { color: 'red', top: true } })
      }
      
      this.isLoading = false
      // return Promise.resolve(response)
    },
    attach () {
      if (this.$refs.inputFile) this.$refs.inputFile.click()
    },
    async downloadExcel () {
      console.log('downloadExcel data ');
      try {
        const response = await fetch('/api/thirdParty/download/excel', {
          method: 'GET',
        });
        console.log('response data ',response);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'Template_Import_Excel.xlsx'; // ตั้งชื่อไฟล์ที่ต้องการดาวน์โหลด
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to download file:', error);
      }
    },
  },
};
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
      min-height: 52px;
      min-width: 240px;
      max-width: 600px;

      .file-name-wrapper {
        display: flex;

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

  }
</style>