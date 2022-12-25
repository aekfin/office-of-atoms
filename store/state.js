export default () => ({
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
          to: '/parcel/',
          exactPath: true
        },
        {
          title: 'เบิกพัสดุ',
          to: '/parcel/withdraw/'
        },
        {
          title: 'พัสดุ ที่รออนุมัติ',
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
          to: '/durable-goods/',
          exactPath: true
        },
        {
          title: 'ยืม - คืน ครุภัณฑ์',
          to: '/durable-goods/borrow/'
        },
        {
          title: 'ตรวจนับ ครุภัณฑ์',
          to: '/durable-goods/counting/'
        },
        {
          title: 'ครุภัณฑ์ ที่รออนุมัติ',
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
          title: 'หมวดหมู่ พัสดุ-ครุภัณฑ์',
          to: '/management/category/'
        },
        {
          title: 'ค่าเริ่มต้น พัสดุ-ครุภัณฑ์',
          to: '/management/goods/'
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
  ]
})
