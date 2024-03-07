<template>
  <div class="action-icon">
    <NLink v-if="isLink" :to="item.action">
      <v-btn icon :color="item.iconColor || undefined">
        <i class="material-icons" v-text="item.icon || item.name"/>
      </v-btn>
    </NLink>
    <v-menu v-else-if="isConfirm" offsetY nudgeLeft="100%" contentClass="action-icon-menu-class">
      <template #activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" :color="item.iconColor || undefined" :disabled="item.disable">
          <i class="material-icons" v-text="item.icon || item.name"/>
        </v-btn>
      </template>
      <div>
        <div>{{ item.confirmText || `คุณยืนยันที่จะลบหรือไม่ ?` }}</div>
        <div class="d-flex justify-end w-full mt-3">
          <v-btn small plain>ยกเลิก</v-btn>
          <v-btn small :color="item.confirmBtnColor || 'error'" @click="onConfirm">ยืนยัน</v-btn>
        </div>
      </div>
    </v-menu>
    <v-btn v-else icon :color="item.iconColor || undefined" @click="onConfirm" :disabled="item.disable">
      <i class="material-icons" v-text="item.icon || item.name"/>
    </v-btn>
  </div>
</template>

<script>
  export default {
    props: {
      item: { type: Object, required: true },
    },
    computed: {
      isLink () {
        return this.item.type === 'link'
      },
      isConfirm () {
        return this.item.type === 'confirm'
      },
      isBtn () {
        return !this.isLink && !this.isConfirm
      }
    },
    methods: {
      onConfirm () {
        if (this.item.action) this.item.action()
      }
    }
  }
</script>

<style lang="scss">
  .action-icon {
  }

  .action-icon-menu-class {
    padding: 16px;
  }
</style>