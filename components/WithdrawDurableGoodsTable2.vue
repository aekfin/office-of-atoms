<template>
  <v-data-table :headers="headers" :items="items" :itemsPerPage="1000" disableSort hideDefaultFooter class="withdraw-durable-goods-table elevation-1" :loading="isLoading">
    <template #item.selector="{ index }">
      <input v-model="selectList2[index]" type="checkbox" @change="changeCheckbox(selectList2[index],index,items)">
    </template>
    <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }} </template>
    <template #item.price="{ item }">{{ $fn.getPrice(item.price) }}</template>
    <template #item.typeOfSource="{ item }">{{ sourceList[item.REPAIR] || '-' }}</template>
    <template #item.majorCategory="{ item }">
      <EquipmentColumn :item="item"/>
    </template>
    <template #item.organization.ouName="{ item }">
      <OwnerColumn :item="item"/>
    </template>
    <template #item.dateEntry="{ item }">
      <div>{{ $fn.displayDate(item.dateEntry) }}</div>
    </template>
    <template #item.action="{ item }">
      <ActionIconList :list="getActionIconList(item)"/>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    components: {
      EquipmentColumn: () => import('~/components/EquipmentColumn.vue'),
      OwnerColumn: () => import('~/components/OwnerColumn.vue'),
    },
    props: {
      items: { type: Array, required: true },
      isLoading: { type: Boolean },
      getActionIconList: { type: Function },
      selectList2: { type: Array },
      isSale: { type: Boolean },      
      List4: { type: Array },
    },
    data () {
      const headers = [
        { text: '', value: 'selector', width: '50px', align: 'center' },
        { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
        { text: 'เลขที่ครุภัณฑ์', value: 'number', width: '160px', align: 'center' },
        { text: 'ชื่อครุภัณฑ์', value: 'name' },
        { text: 'เลขที่สินทรัพย์', value: 'assetNumber' },
        { text: 'เลขที่สินทรัพย์ อว.', value: 'assetNumberAorWor' },
      ]
      if (this.isSale) headers.push({ text: 'ที่มา', value: 'typeOfSource', width: '140px', align: 'center' })
      headers.push({ text: 'หมวดหมู่', value: 'majorCategory', width: '120px', align: 'center' })
      headers.push({ text: 'วันที่รับเข้า', value: 'dateEntry', align: 'center', width: '140px' })
      if (this.getActionIconList) headers.push({ text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' })
      return {
        headers,
        sourceList: {
          'REPAIR': 'การส่งซ่อม',
          'CHECK_STOCK': 'การตรวจนับ',
        },
      }
    },
    methods: {
      async changeCheckbox (selected,index,item) {
        if(selected){  
          let checkDup = 0;        
          for(let i = 0; i < this.List4.length; i++){
            if(this.List4[i].number == item[index].number){
              checkDup = 1;
            }
          }
          if(checkDup == 0){            
            this.List4.push(item[index]);
          }
        }else{
          for(let i = 0; i < this.List4.length; i++){
            if(this.List4[i].number == item[index].number){
              this.List4.splice(i, 1);
            }
          }
        }
      }
    },
  }
</script>

<style lang="scss">
  .withdraw-durable-goods-table {
  }
</style>