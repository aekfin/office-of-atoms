<!-- <template>
  <v-data-table :headers="headers" :items="items" :itemsPerPage="20" disableSort hideDefaultFooter class="durable-goods-table elevation-1 mt-6" :loading="isLoading"
  :headers="dessertHeaders"
      :items="desserts"
      :expanded.sync="expanded"
      item-key="name"
      class="elevation-1"
      @click:row="rowClick"
    >
    <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
    <template #item.price="{ item }">{{ $fn.getPrice(item.price) }}</template>
    <template #item.majorCategory="{ item }">
      <EquipmentColumn :item="item"/>
    </template>
    <template #item.project.projectName="{ item }">
      <ProjectColumn :item="item"/>
    </template>
    <template #item.organization.ouName="{ item }">
      <OwnerColumn :item="item"/>
    </template>
    <template #item.dateEntry="{ item }">
      <div>{{ $fn.displayDate(item.dateEntry) }}</div>
    </template>
    <template #item.subEquipments="{ item }">
      <SubEquipmentColumn :item="item"/>
    </template>
    <template #item.action="{ item }">
      <ActionIconList :list="getActionIconList(item)"/>
    </template>
    
    <template #[`item.data-table-expand`]="{ item, expand, isExpanded }">
    <v-btn
      v-if="(item.children && item.children.length > 0) || 'show-expand' in $attrs" icon small class="v-data-table__expand-icon"
      :class="{ 'v-data-table__expand-icon--active': isExpanded }" @click.stop="expand(!isExpanded)"
    >
      <v-icon>$expand</v-icon>
    </v-btn>
    <v-btn v-else icon small disabled />
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        More info about {{ item.name }}
      </td>
    </template>

  </v-data-table>
</template>

<script>
  export default {
    components: {
      EquipmentColumn: () => import('~/components/EquipmentColumn.vue'),
      OwnerColumn: () => import('~/components/OwnerColumn.vue'),
      SubEquipmentColumn: () => import('~/components/SubEquipmentColumn.vue'),
    },
    props: {
      items: { type: Array, required: true },
      isLoading: { type: Boolean },
      getActionIconList: { type: Function },
    },
    data () {
      const headers = [
        { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
        // { text: 'โครงการ', value: 'project.projectName' },
        { text: 'เลขที่ครุภัณฑ์', value: 'number', align: 'center', width: '120px' },
        { text: 'รายการครุภัณฑ์', value: 'type.name', align: 'center', width: '160px' },
        { text: 'เลขที่สินทรัพย์ อว.', value: 'assetNumberAorWor', align: 'center', width: '160px' },
        { text: 'หมวดหมู่', value: 'majorCategory', width: '120px', align: 'center' },
        { text: 'ราคา', value: 'price', align: 'center', width: '100px' },
        { text: 'โครงการ', value: 'project.projectName', width: '120px', align: 'center'  },
        { text: 'ผู้ครอบครอง', value: 'organization.ouName', width: '120px', align: 'center' },
        { text: 'ครุภัณฑ์ย่อย', value: 'subEquipments', width: '120px', align: 'center' },
        { text: 'วันที่รับเข้า', value: 'dateEntry', align: 'center', width: '140px' },
      ]
      if (this.getActionIconList) headers.push({ text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' })
      return {
        headers
      }
    },
  }

  
</script>

<style lang="scss">
  .durable-goods-table {
  }
</style> -->

<template>
  <v-data-table  :items="items" :itemsPerPage="100" disableSort hideDefaultFooter class="durable-goods-table elevation-1 mt-6" :loading="isLoading"
  :headers="dessertHeaders"
      :expanded.sync="expanded"      
        item-value="name"
        show-expand
      @click:row="rowClick"
    >
    <template #item.order="{ index }">{{ $store.state.paginationIndex + index + 1 }}</template>
    <template #item.price="{ item }">{{ $fn.getPrice(item.price) }}</template>
    <template #item.majorCategory="{ item }">
      <EquipmentColumn :item="item"/>
    </template>
    <template #item.project.projectName="{ item }">
      <ProjectColumn :item="item"/>
    </template>
    <template #item.organization.ouName="{ item }">
      <OwnerColumn :item="item"/>
    </template>
    <template #item.dateEntry="{ item }">
      <div>{{ $fn.displayDate(item.dateEntry) }}</div>
    </template>
    <template #item.subEquipments="{ item }">
      <SubEquipmentColumn :item="item"/>
    </template>
    <template #item.action="{ item }">
      <ActionIconList :list="getActionIconList(item)"/>
    </template>
    
    <!-- <template #[`item.data-table-expand`]="{ item, isExpanded }">
    <v-btn
      v-if="(item.children && item.children.length > 0) || 'show-expand' in $attrs" icon small class="v-data-table__expand-icon"
      :class="{ 'v-data-table__expand-icon--active': isExpanded }" 
    >
      <v-icon>$expand</v-icon>
    </v-btn>
    <v-btn v-else icon small disabled />
    </template> -->
    <template v-slot:expanded-item="{headers,  item }">
      <!-- <td :colspan="headers.length">
        More info about {{ item.name }} More info aboutMore info aboutMore info aboutMore info aboutMore info aboutMore info aboutMore info aboutMore info aboutMore info aboutMore info about
      </td> -->
      <!-- <td :colspan="headers.length" class="expand-row-content">
        <v-card>
          <v-card-text class="black--text pt-2 text-body-1">
            <div><b>ชื่อครุภัณฑ์:</b> {{ item.name }}</div>
            <template>
              <v-data-table v-if="subEquipments.length" :headers="headerSubEquipments" :items="subEquipments" :itemsPerPage="Infinity" disableSort hideDefaultFooter class="elevation-1 mt-2" :loading="isLoadingSubEquipments"></v-data-table>
              <div v-else class="text-center text-h6 pt-5 pb-8">ไม่มีครุภัณฑ์ย่อย</div>
            </template>
          </v-card-text>
        </v-card>
      </td> -->
      <td :colspan="headers.length" class="expand-row-content">
        <v-card>
          <v-card-text class="black--text pt-2 text-body-1">
            <!-- <div><b>ชื่อครุภัณฑ์:</b> {{ item.name }}</div> -->
            <template>
              <v-data-table v-if="item.haveSupEquipment" :headers="headerSubEquipments" :items="item.subEquipmentModel" :itemsPerPage="Infinity" disableSort hideDefaultFooter class="elevation-1 mt-2" ></v-data-table>
              <div v-else class="text-center text-h6 pt-5 pb-8">ไม่มีครุภัณฑ์ย่อย</div>
            </template>
          </v-card-text>
        </v-card>
      </td>
    </template>

  </v-data-table>
</template>

<script>
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
  export default {
    vuetify: new Vuetify(),
    components: {
      EquipmentColumn: () => import('~/components/EquipmentColumn.vue'),
      OwnerColumn: () => import('~/components/OwnerColumn.vue'),
      SubEquipmentColumn: () => import('~/components/SubEquipmentColumn.vue'),
    },
    props: {
      items: { type: Array, required: true },
      isLoading: { type: Boolean },
      getActionIconList: { type: Function },
    },
    data () {
      
      const dessertHeaders = [
        { text: 'ลำดับ', value: 'order', width: '50px', align: 'center' },
        // { text: 'โครงการ', value: 'project.projectName' },
        { text: 'เลขที่ครุภัณฑ์', value: 'number', align: 'center', width: '120px' },
        { text: 'รายการครุภัณฑ์', value: 'type.name', align: 'center', width: '160px' },
        { text: 'เลขที่สินทรัพย์ อว.', value: 'assetNumberAorWor', align: 'center', width: '160px' },        
        { text: 'เลขที่สั่งซื้อสั่งจ้าง/เลขที่สัญญา', value: 'project.contractNumber', align: 'center', width: '250px' },
        { text: 'หมวดหมู่', value: 'majorCategory', width: '120px', align: 'center' },
        { text: 'ราคา', value: 'price', align: 'center', width: '100px' },
        { text: 'โครงการ', value: 'project.projectName', width: '120px', align: 'center'  },
        { text: 'ผู้ครอบครอง', value: 'organization.ouName', width: '120px', align: 'center' },
        // { text: 'ครุภัณฑ์ย่อย', value: 'subEquipments', width: '120px', align: 'center' },
        { text: 'วันที่รับเข้า', value: 'dateEntry', align: 'center', width: '140px' },
      ]
      // if (this.getActionIconList) dessertHeaders.push({ text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' })
      if (this.getActionIconList) dessertHeaders.unshift({ text: 'เครื่องมือ', value: 'action', width: '100px', align: 'center' });
      return {
        expanded: [],
        dessertHeaders,
        isLoadingSubEquipments: true,
        equipment: null,
        subEquipments: [],
        headerSubEquipments: [
          { text: 'เลขที่ครุภัณฑ์ย่อย', value: 'number', width: '160px' },
          { text: 'ชื่อครุภัณฑ์ย่อย', value: 'name' },
          { text: 'มูลค่า', value: 'cost' },
          { text: 'หน่วย', value: 'classifier' },
        ]
      }
    },
  mounted () {
    // ขยายทุกรายการเมื่อ component ถูก mount ลงใน DOM แล้ว
    this.expandAllRows ();
  },
    methods: {
      expandAllRows () {
        console.log('this.items',this.items)
        
        // console.log('props fkyou',this.props);
        this.expanded = this.items.map(item => item.name);
      },
      rowClick (item, props) {
        console.log('props ',props);
        props.expand(false);
        if (props && props.expand) {
          props.expand(!props.isExpanded);
          this.getSubEquipment(props.item.id)
        }
      },
      async getSubEquipment (id) {
        try {
          
          console.log('this.subEquipmentsssssssss ',this.subEquipments);
          this.isLoadingSubEquipments = true
          const { data } = await this.$store.dispatch('http', { apiPath: 'equipment/getSubEquipments', query: { equipmentId: id } })
          this.equipment = data.equipment
          this.subEquipments = data.subEquipmentModel || []
          console.log('this.subEquipments ',this.subEquipments);
          this.isLoadingSubEquipments = false
          return Promise.resolve(data)
        } catch (err) { return Promise.reject(err) }
      },
    }
  }

  
</script>

<style lang="scss">
  .durable-goods-table {
  }
  .sub-equipment-column {
    width: max-content;
  }
  .expand-row-content {
    padding: 0 0 !important;
  }
</style>

<!-- <template>
  <v-app id="inspire">
    <v-data-table
      :headers="dessertHeaders"
      :items="desserts"
      :expanded.sync="expanded"
      item-key="name"
      class="elevation-1"
      @click:row="rowClick"
    >
    <template #[`item.data-table-expand`]="{ item, expand, isExpanded }">
    <v-btn
      v-if="(item.children && item.children.length > 0) || 'show-expand' in $attrs" icon small class="v-data-table__expand-icon"
      :class="{ 'v-data-table__expand-icon--active': isExpanded }" @click.stop="expand(!isExpanded)"
    >
      <v-icon>$expand</v-icon>
    </v-btn>
    <v-btn v-else icon small disabled />
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        More info about {{ item.name }}
      </td>
    </template>
    </v-data-table>
  </v-app>
</template>

<script>
import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
export default {
  // el: '#app',
  // vuetify: new Vuetify(),
  data () {
    return {
      expanded: [],
      singleExpand: false,
      dessertHeaders: [
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
        { text: '', value: 'data-table-expand' },
      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: 1,
          children: [1,2]
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: 1,
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: 7,
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: 8,
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: 16,
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: 0,
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: 2,
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: 45,
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: 22,
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: 6,
        },
      ],
    }
  },
  methods: {
    rowClick (item, props) {
      props.expand(!props.isExpanded)
    }
  }
}
</script>

<style>
/* เพิ่มสไตล์เพิ่มเติมตรงนี้ */
</style> -->
