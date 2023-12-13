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
  approveEquipmentREPAIR: null,
  approveRequestTrigger: false,
  distributionList: [
    { id: 'บริจาค', name: 'บริจาค' },
    { id: 'ขาย', name: 'ขาย' },
    { id: 'สูญหาย', name: 'สูญหาย' },
    { id: 'เสื่อมสภาพ', name: 'เสื่อมสภาพ' },
    { id: 'ทำลาย', name: 'ทำลาย' },
    { id: 'อื่นๆ', name: 'อื่นๆ' },
  ],
  durableGoodCountable: ['NEW', 'RETURNED', 'WAIT_SALE'],
  durableGoodCountingStatus: [
    { id: 'สภาพใช้งานได้', name: 'สภาพใช้งานได้' },
    { id: 'สภาพใช้งานไม่ได้', name: 'สภาพใช้งานไม่ได้' },
    { id: 'ชำรุดควรจำหน่าย', name: 'ชำรุดควรจำหน่าย' },
    { id: 'โอนย้ายให้หน่วยงานอื่น', name: 'โอนย้ายให้หน่วยงานอื่น' },
    { id: 'อยู่ระหว่างรอขาย', name: 'อยู่ระหว่างรอขาย' },
    { id: 'อื่นๆ', name: 'อื่นๆ' },
  ],
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
  durableGoodSelectable: {
    'NEW': 'ใช้งานอยู่',
    'RESERVE': 'รออนุมัติ',
    'BORROWED': 'ถูกยืม',
    'RETURNED': 'ใช้งานอยู่',
    'WAIT_SALE': 'รอจำหน่าย',
    'SALE': 'จำหน่าย',
    'REPAIR': 'ส่งซ่อม',
    'DONATE': 'รับบริจาค',
  },
  durableGoodTypes: {
    'BORROW': 'ยืม',
    'RETURN': 'คืน',
    'REQUISITION': 'เบิก',
    'TRANSFER': 'โอนย้าย',
  },
  projectFormatList: [
    { id: 'ซื้อ', name: 'ซื้อ' },
    { id: 'จ้าง', name: 'จ้าง' },
    { id: 'เช่า', name: 'เช่า' },
  ],
  moneyTypeList: [
    { id: 'BUDGET', name: 'เงินงบประมาณ' },
    { id: 'OUT_OF_BUDGET', name: 'เงินนอกงบประมาณ' },
    { id: 'OTHER', name: 'เงินอื่นๆ' },
    { id: 'DONATION', name: 'เงินบริจาค' },
  ],
  registrationList: [
    { id: '1', name: 'มาตราฐาน' },
    { id: '2', name: 'ต่ำกว่าเกณฑ์' },
  ],
  projectTypeList: [
    { id: 'e-Bidding', name: 'e-Bidding' },
    { id: 'e-market', name: 'e-market' },
    { id: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีคัดเลือก', name: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีคัดเลือก' },
    { id: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีประกวดแบบ', name: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีประกวดแบบ' },
    { id: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีประกาศเชิญชวนทั่วไป', name: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีประกาศเชิญชวนทั่วไป' },
    { id: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีเฉพาะเจาะจง', name: 'งานจ้างออกแบบหรือควบคุมงานก่อสร้างโดยวิธีเฉพาะเจาะจง' },
    { id: 'จ้างที่ปรึกษาโดยวิธีคัดเลือก', name: 'จ้างที่ปรึกษาโดยวิธีคัดเลือก' },
    { id: 'จ้างที่ปรึกษาโดยวิธีประกาศเชิญชวนทั่วไป', name: 'จ้างที่ปรึกษาโดยวิธีประกาศเชิญชวนทั่วไป' },
    { id: 'จ้างที่ปรึกษาโดยวิธีเฉพาะเจาะจง', name: 'จ้างที่ปรึกษาโดยวิธีเฉพาะเจาะจง' },
    { id: 'วิธีคัดเลือก', name: 'วิธีคัดเลือก' },
    { id: 'วิธีเฉพาะเจาะจง', name: 'วิธีเฉพาะเจาะจง' },
    { id: 'วิธีเฉพาะเจาะจง(ข)', name: 'วิธีเฉพาะเจาะจง(ข)' },
    { id: 'สอบราคา', name: 'สอบราคา' },
  ],
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
      to: '/durable-goods/counting/',
      counting: true,
    },
    {
      title: 'ยืนยันการตรวจนับครุภัณฑ์',
      to: '/durable-goods/verify-counting/',
      checkTreasury: true,
    },
    {
      title: 'ประวัติการตรวจนับครุภัณฑ์',
      to: '/durable-goods/verify-counting-history/',
      checkTreasury: true,
    },
    {
      title: 'รายงานทั้งหมด',
      to: '/report/',
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
          checkTreasury: true,
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
        {
          title: 'วัสดุคงคลังที่อนุมัติทั้งหมด',
          to: '/parcel/all-request/',
          checkTreasury: true,
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
        },
        {
          title: 'บริหารครุภัณฑ์',
          to: '/durable-goods/overall/',
          checkTreasury: true,
        },
        {
          title: 'รับบริจาคครุภัณฑ์',
          to: '/durable-goods/donation/',
          checkTreasury: true,
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
          title: 'ครุภัณฑ์ที่อนุมัติทั้งหมด',
          to: '/durable-goods/all-request/',
          checkTreasury: true,
        },
        {
          title: 'จำหน่ายครุภัณฑ์',
          to: '/durable-goods/sale/',
          checkTreasury: true,
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
          title: 'บริหารกอง / กลุ่ม',
          to: '/management/organization/'
        },
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
