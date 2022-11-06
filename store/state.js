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
      title: 'พัสดุ-ครุภัณฑ์',
      to: '/goods/',
      expand: 0,
      children: [
        {
          title: 'บริหารพัสดุ-ครุภัณฑ์',
          to: '/goods/'
        },
        {
          title: 'เบิกพัสดุ',
          to: '/goods/withdraw/'
        },
        {
          title: 'ยืม-คืน ครุภัณฑ์',
          to: '/goods/borrow/'
        },
        {
          title: 'ตรวจนับ ครุภัณฑ์',
          to: '/goods/count/'
        }
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
          to: '/management/staff/'
        },
        {
          title: 'บริหารผู้ใช้ระบบ',
          to: '/management/user/'
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
          to: '/management/report/'
        }
      ]
    }
  ]
})
