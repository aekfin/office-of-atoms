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
        console.log('genTable');
        console.log('columnList ', this.columnList);
        console.log('valueList ',this.valueList);

        this.headers = [];
        this.items = [];

        console.log('length ',this.columnList.length);
        // this.headers = [ { text: 'ลำดับที่', value: '1' }];
        for(let i=0; i<this.columnList.length; i++){
          const sss = (i+1)+'';
          console.log('this.columnList[i] ',this.columnList[i]);
          this.headers.push({ text: this.columnList[i], value: sss})
        }
        
        // this.items.push({ sss: '2222222222222222'});
          for(let i=0; i < this.valueList.length; i++){
            this.myObject = {};
            for(let j=0; j<this.columnList.length; j++){
              // console.log('this.columnList[i] ',this.columnList[i]);
              // this.items.push({ text: this.valueList[i]})
              this.$set(this.myObject, (j+1), this.valueList[i][j]);
            }
            console.log('myObject ',this.myObject);
            this.items.push(this.myObject)
          }



        console.log('this.headers ', this.headers);
        console.log('this.items ',this.items);

        
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