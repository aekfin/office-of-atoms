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
  approveEquipmentRequest: null,
  approveEquipmentBORROW: null,
  approveEquipmentRETURN: null,
  approveEquipmentREQUISITION: null,
  approveEquipmentTRANSFER: null,
  approveRequestTrigger: false,
  durableGoodCountable: ['NEW', 'WAIT_SALE', 'LOST', 'ENDOW', 'DEPRECIATION', 'DESTRUCTION', 'OTHER'],
  durableGoodStatus: {
    'NEW': 'ใช้งานอยู่',
    'RESERVE': 'รออนุมัติ',
    'BORROWED': 'ถูกยืม',
    'RETURNED': 'ใช้งานอยู่',
    'ENDOW': 'บริจาค',
    'WAIT_SALE': 'รอจำหน่าย',
    'SALE': 'จำหน่าย',
    'LOST': 'สูญหาย',
    'REPAIR': 'ส่งซ่อม',
    'DONATE': 'รับบริจาค',
    'DEPRECIATION': 'เสื่อมสภาพ',
    'DESTRUCTION': 'ทำลาย',
    'OTHER': 'อื่นๆ',
  },
  durableGoodStatusColor: {
    'NEW': 'primary',
    'RESERVE': 'warning',
    'BORROWED': 'error',
    'RETURNED': 'primary',
    'WAIT_SALE': 'warning',
    'SALE': 'secondary',
    'LOST': 'secondary',
    'REPAIR': 'warning',
    'DONATE': 'warning',
    'ENDOW': 'secondary',
    'DEPRECIATION': 'secondary',
    'DESTRUCTION': 'secondary',
    'OTHER': 'warning',
  },
  durableGoodTypes: {
    'BORROW': 'ยืม',
    'RETURN': 'คืน',
    'REQUISITION': 'เบิก',
    'TRANSFER': 'โอนย้าย',
  },
  leftMenus: [
    {
      title: 'หน้าหลัก',
      to: '/'
    },
    {
      title: 'โครงการ',
      to: '/project/'
    },
    {
      title: 'ตรวจนับครุภัณฑ์',
      to: '/durable-goods/counting/'
    },
    {
      title: 'ยืนยันการตรวจนับครุภัณฑ์',
      to: '/durable-goods/verify-counting/',
      checkTreasury: true,
    },
    {
      title: 'วัสดุคงคลัง',
      to: '/parcel/',
      children: [
        {
          title: 'วัสดุคงคลังทั้งหมด',
          to: '/parcel/summary/',
          checkTreasury: true,
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
          to: '/parcel/request/',
          parcelBadge: true,
        },
      ]
    },
    {
      title: 'ครุภัณฑ์',
      to: '/durable-goods/',
      children: [
        {
          title: 'ครุภัณฑ์ทั้งหมด',
          to: '/durable-goods/summary/',
          checkTreasury: true,
        },
        {
          title: 'บริหารครุภัณฑ์',
          to: '/durable-goods/overall/',
        },
        {
          title: 'รับบริจาคครุภัณฑ์',
          to: '/durable-goods/donation/',
        },
        {
          title: 'ยืม - คืน ครุภัณฑ์',
          to: '/durable-goods/borrow/'
        },
        {
          title: 'เบิกครุภัณฑ์',
          to: '/durable-goods/withdraw/',
        },
        {
          title: 'โอนย้ายครุภัณฑ์',
          to: '/durable-goods/transfer/',
        },
        {
          title: 'ครุภัณฑ์ที่รออนุมัติ',
          to: '/durable-goods/request/',
          durableGoodsBadge: true,
        },
        {
          title: 'จำหน่ายครุภัณฑ์',
          to: '/durable-goods/sale/',
        },
        {
          title: 'ส่งซ่อมครุภัณฑ์',
          to: '/durable-goods/repair/',
        },
      ]
    },
    {
      title: 'ผู้ดูแลระบบ',
      to: '/management/',
      children: [
        {
          title: 'บริหารบุคลากร',
          to: '/management/user/'
        },
        {
          title: 'บริหารคู่สัญญา',
          to: '/management/vendor/'
        },
        {
          title: 'ประเภทวัสดุคงคลัง',
          to: '/management/type-parcel/'
        },
        {
          title: 'หมวดหมู่พัสดุ',
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
      ]
    }
  ],
})
