<template>
  <v-data-table v-if="showTable" :headers="headers" :items="items" class="auto-width" hide-footer>
    <template  v-slot:item.columnName="{ item }">
      {{ processHtml(item.columnName) }}
    </template>
  </v-data-table>
</template>

<script>
  export default {    
    props: {
      isLoading: { type: Boolean },
      columnList: { type: Array },
      valueList: { type: Array },
      showTable: { type: Boolean },
    },
    watch: {
      columnList: {
        handler () {
          console.log('handler handler');
          // เมื่อ parentData เปลี่ยนแปลง ให้เรียกใช้ method ที่ต้องการ
          this.genTable();
        },
        immediate: true // เพื่อให้ทำงานทันทีเมื่อ component ถูก mount แล้ว
      }
    },
    data () {
      return {
        myObject: {},
        headers: [],
        items: []
      };
    },
    methods: {
      processHtml (htmlContent) {
        // Process and sanitize htmlContent as needed
        return htmlContent;
      },
      genTable () {

        this.headers = [];
        this.items = [];

        for(let i=0; i<this.columnList.length; i++){
          const sss = (i+1)+'';
          this.headers.push({ text: this.columnList[i], value: sss})
        }
        
          for(let i=0; i < this.valueList.length; i++){
            this.myObject = {};
            for(let j=0; j<this.columnList.length; j++){
              // this.items.push({ text: this.valueList[i]})
              this.$set(this.myObject, (j+1), this.valueList[i][j]);
            }
            this.items.push(this.myObject)
          }

      }
    },
  }
</script>

 
<!-- for(let i = 0; i < this.columnList.length; i++){

} -->

<style lang="scss">
  .withdraw-durable-goods-table {
  }

  .auto-width th,
  .auto-width td {
    white-space: nowrap; /* ป้องกันข้อความข้างในไม่ตัดขึ้นบรรทัดใหม่ */
    width: auto !important; /* กำหนดความกว้างเป็น auto */
  }
</style>