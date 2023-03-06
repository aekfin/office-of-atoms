export default () => ({
  isFullLoading: true,
  userProfile: null,
  role: null,
  snackbarVisible: false,
  snackbarText: '',
  snackbarProps: {},
  pagination: null,
  paginationIndex: 0,
  approveStatus: {
    'SUCCESS': 'อนุมัติ',
    'APPROVE': 'อนุมัติ',
    'PENDING': 'รออนุมัติ',
    'REJECT': 'ไม่อนุมัติ',
  },
  approveStatusColor: {
    'SUCCESS': 'success',
    'APPROVE': 'success',
    'PENDING': 'warning',
    'REJECT': 'error',
  },
  approveRequest: null,
  approveRequestDepartment: null,
  approveRequestTrigger: false,
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
      title: 'วัสดุคงคลัง',
      to: '/parcel/',
      children: [
        {
          title: 'วัสดุคงคลังทั้งหมด',
          to: '/parcel/summary/',
        },
        {
          title: 'บริหารวัสดุคงคลัง',
          to: '/parcel/overall/',
        },
        {
          title: 'เบิกวัสดุคงคลัง',
          to: '/parcel/withdraw/'
        },
        {
          title: 'วัสดุคงคลังที่รออนุมัติ',
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
        // {
        //   title: 'ตรวจนับครุภัณฑ์',
        //   to: '/durable-goods/counting/'
        // },
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
        // {
        //   title: 'บริหารขั้นตอนอนุมัติ',
        //   to: '/management/approval/'
        // },
        {
          title: 'บริหารบุคลากร',
          to: '/management/user/'
        },
        {
          title: 'ประเภทวัสดุคงคลัง',
          to: '/management/type-parcel/'
        },
        {
          title: 'หมวดหมู่ครุภัณฑ์',
          to: '/management/category/'
        },
        {
          title: 'ค่าเริ่มต้นวัสดุคงคลัง',
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
        // {
        //   title: 'รายงานการใช้งานระบบ',
        //   to: '/management/log/'
        // }
      ]
    }
  ],
})
