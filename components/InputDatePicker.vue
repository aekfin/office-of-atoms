<template>
  <div class="input-date-picker">
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      :disabled="readonly"
    >
      <template #activator="{ on, attrs }">
        <v-text-field
          v-model="dateFormatted"
          :label="label"
          hint="รูปแบบ วัน-เดือน-ปี"
          persistentHint
          prependIcon="mdi-calendar"
          :disabled="disabled"
          :required="required"
          :rules="rules"
          readonly
          v-bind="attrs"
          v-on="on"
          @blur="date = parseDate(dateFormatted)"
          @change="date = parseDate(dateFormatted)"
        />
      </template>
      <v-date-picker
        v-model="date"
        no-title
        locale="th-TH"
        @input="menu = false"
      />
    </v-menu>
  </div>
</template>

<script>
  export default {
    props: {
      value: { type: [Date, String], required: true },
      label: { type: String, required: true },
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      required: { type: Boolean },
      rules: { type: Array },
    },
    data () {
      const date = this.parseValue(this.value)
      return {
        dateFormatted: this.getDateFormatted(date),
        date,
        menu: false,
      }
    },
    watch: {
      'date' (val) {
        this.dateFormatted = this.getDateFormatted(val)
        this.$emit('update:value', new Date(this.date))
      },
      'value' (val) {
        this.date = this.parseValue(val)
      }
    },
    methods: {
      getDateFormatted (value) {
        if (value) {
          const [year, month, date] = value.split('-')
          return `${date}-${month}-${parseInt(year) + 543}`
        } return ''
      },
      parseValue () {
        return this.value ? this.$moment(this.value).format('YYYY-MM-DD') : ''
      },
      parseDate (dateFormatted) {
        if (dateFormatted) {
          const [date, month, year] = dateFormatted.split('-')
          return `${parseInt(year) - 543}-${month}-${date}`
        } return ''
      },
    }
  }
</script>

<style lang="scss">
  .input-date-picker {
    .v-text-field__slot {
      .v-label {
        padding-top: 3px;
      }
    }

    .v-messages__wrapper {
      .v-messages__message {
        padding-bottom: 3px;
      }
    }
  }
</style>