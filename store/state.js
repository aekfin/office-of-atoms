export default () => ({
  isFullLoading: true,
  userProfile: null,
  role: null,
  snackbarVisible: false,
  snackbarText: '',
  snackbarProps: {},
  approveStatus: {
    '1': 'อนุมัติ',
    '2': 'รออนุมัติ',
    '3': 'ไม่อนุมัติ',
    '4': 'แบบร่าง',
  },
  approveStatusColor: {
    '1': 'success',
    '2': 'warning',
    '3': 'error',
    '4': 'primary',
  },
  leftMenus: [
    {
      title: 'หนักหลัก',
      to: '/'
    },
    {
      title: 'โครงการ',
      to: '/project/'
    },
    {
      title: 'พัสดุ',
      to: '/parcel/',
      children: [
        {
          title: 'บริหารพัสดุ',
          to: '/parcel/overall/',
        },
        {
          title: 'เบิกพัสดุ',
          to: '/parcel/withdraw/'
        },
        {
          title: 'พัสดุที่รออนุมัติ',
          to: '/parcel/request/'
        },
      ]
    },
    {
      title: 'ครุภัณฑ์',
      to: '/durable-goods/',
      children: [
        {
          title: 'บริหารครุภัณฑ์',
          to: '/durable-goods/overall/',
        },
        {
          title: 'ยืม - คืน ครุภัณฑ์',
          to: '/durable-goods/borrow/'
        },
        {
          title: 'ตรวจนับครุภัณฑ์',
          to: '/durable-goods/counting/'
        },
        {
          title: 'ครุภัณฑ์ที่รออนุมัติ',
          to: '/durable-goods/request/'
        },
      ]
    },
    {
      title: 'ผู้ดูแลระบบ',
      to: '/management/',
      children: [
        {
          title: 'บริหารขั้นตอนอนุมัติ',
          to: '/management/approval/'
        },
        {
          title: 'บริหารบุคลากร',
          to: '/management/user/'
        },
        {
          title: 'หมวดหมู่ พัสดุ - ครุภัณฑ์',
          to: '/management/category/'
        },
        {
          title: 'ค่าเริ่มต้นพัสดุ',
          to: '/management/parcel/'
        },
        {
          title: 'ค่าเริ่มต้นครุภัณฑ์',
          to: '/management/durable-goods/'
        },
        {
          title: 'บริหารคู่สัญญา',
          to: '/management/vendor/'
        },
        {
          title: 'รายงานการใช้งานระบบ',
          to: '/management/log/'
        }
      ]
    }
  ],
})
