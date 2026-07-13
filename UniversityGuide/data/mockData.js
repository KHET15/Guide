/* ==========================================================
   mockData.js
   ข้อมูลจำลอง (Mock Data) ของอาคารทั้งหมดในมหาวิทยาลัย
   ในอนาคตสามารถแทนที่ไฟล์นี้ด้วยการเรียก Flask API + SQLite
   โดยไม่ต้องแก้ไข Logic ฝั่ง UI เลย เพียงแค่ทำให้ฟังก์ชัน
   getAllBuildings() คืนค่าจาก fetch() แทนที่จะคืนค่าจาก Array นี้
   ========================================================== */

/* โครงสร้างข้อมูลอาคารแต่ละหลัง
   id            : รหัสประจำอาคาร (ใช้อ้างอิงใน URL)
   name          : ชื่ออาคาร
   image         : พาธรูปภาพของอาคาร
   map           : พาธรูปแผนที่ของอาคาร
   floor         : จำนวนชั้นทั้งหมด
   facilities    : รายการสิ่งอำนวยความสะดวกภายในอาคาร
   searchCount   : จำนวนครั้งที่อาคารนี้ถูกค้นหา (ใช้คำนวณคำแนะนำ)
*/
const mockBuildings = [
    {
        id: 1,
        name: "อาคาร 11",
        image: "images/buildings/building11.jpg",
        map: "images/maps/building11_map.jpg",
        floor: 8,
        facilities: ["ห้องน้ำ", "ตู้เต่าบิน", "ร้านกาแฟ", "ATM"],
        searchCount: 120
    },
    {
        id: 2,
        name: "อาคาร 12",
        image: "images/buildings/building12.jpg",
        map: "images/maps/building12_map.jpg",
        floor: 6,
        facilities: ["ห้องสมุด", "ห้องน้ำ", "ร้านถ่ายเอกสาร", "ที่จอดรถ"],
        searchCount: 95
    },
    {
        id: 3,
        name: "อาคารเรียนรวม",
        image: "images/buildings/building_rrb.jpg",
        map: "images/maps/building_rrb_map.jpg",
        floor: 5,
        facilities: ["ห้องบรรยาย", "ห้องน้ำ", "ตู้เต่าบิน", "ร้านกาแฟ"],
        searchCount: 150
    },
    {
        id: 4,
        name: "อาคารวิศวกรรมศาสตร์",
        image: "images/buildings/building_eng.jpg",
        map: "images/maps/building_eng_map.jpg",
        floor: 9,
        facilities: ["ห้องปฏิบัติการ", "ATM", "ห้องน้ำ", "ลิฟต์"],
        searchCount: 110
    },
    {
        id: 5,
        name: "อาคารคณะวิทยาศาสตร์",
        image: "images/buildings/building_sci.jpg",
        map: "images/maps/building_sci_map.jpg",
        floor: 7,
        facilities: ["ห้องปฏิบัติการ", "ห้องน้ำ", "ร้านกาแฟ", "จุดชาร์จมือถือ"],
        searchCount: 150
    },
    {
        id: 6,
        name: "อาคารสำนักงานอธิการบดี",
        image: "images/buildings/building_admin.jpg",
        map: "images/maps/building_admin_map.jpg",
        floor: 4,
        facilities: ["จุดประชาสัมพันธ์", "ห้องน้ำ", "ATM", "ที่จอดรถ"],
        searchCount: 60
    },
    {
        id: 7,
        name: "อาคารกิจกรรมนักศึกษา",
        image: "images/buildings/building_activity.jpg",
        map: "images/maps/building_activity_map.jpg",
        floor: 3,
        facilities: ["ห้องซ้อมดนตรี", "ตู้เต่าบิน", "ห้องน้ำ", "ห้องประชุมชมรม"],
        searchCount: 80
    },
    {
        id: 8,
        name: "อาคารหอสมุดกลาง",
        image: "images/buildings/building_library.jpg",
        map: "images/maps/building_library_map.jpg",
        floor: 6,
        facilities: ["ห้องอ่านหนังสือ", "ห้องน้ำ", "ร้านกาแฟ", "จุดชาร์จมือถือ"],
        searchCount: 130
    },
    {
        id: 9,
        name: "อาคารคณะบริหารธุรกิจ",
        image: "images/buildings/building_business.jpg",
        map: "images/maps/building_business_map.jpg",
        floor: 8,
        facilities: ["ห้องเรียน", "ห้องน้ำ", "ตู้เต่าบิน", "ลิฟต์"],
        searchCount: 95
    },
    {
        id: 10,
        name: "อาคารโรงอาหารกลาง",
        image: "images/buildings/building_canteen.jpg",
        map: "images/maps/building_canteen_map.jpg",
        floor: 2,
        facilities: ["ร้านอาหาร", "ห้องน้ำ", "ATM", "จุดชาร์จมือถือ"],
        searchCount: 175
    },
    {
        id: 11,
        name: "อาคารพลศึกษา",
        image: "images/buildings/building_sport.jpg",
        map: "images/maps/building_sport_map.jpg",
        floor: 3,
        facilities: ["สนามกีฬาในร่ม", "ห้องน้ำ", "ห้องอาบน้ำ", "ที่จอดรถ"],
        searchCount: 70
    },
    {
        id: 12,
        name: "อาคารเทคโนโลยีสารสนเทศ",
        image: "images/buildings/building_it.jpg",
        map: "images/maps/building_it_map.jpg",
        floor: 6,
        facilities: ["ห้องคอมพิวเตอร์", "ห้องน้ำ", "ตู้เต่าบิน", "ร้านกาแฟ"],
        searchCount: 120
    }
];

/* ==========================================================
   ฟังก์ชันสำหรับดึงข้อมูลอาคาร
   ออกแบบให้แยกออกจาก UI Logic โดยสมบูรณ์ เพื่อให้ในอนาคต
   สามารถเปลี่ยนจากการคืนค่า mockBuildings เป็นการเรียก
   Flask API (เช่น fetch('/api/buildings')) ได้ทันที
   โดยไม่ต้องแก้โค้ดในไฟล์ home.js, search.js, slider.js, building.js
   ========================================================== */

// โหลดข้อมูลอาคารทั้งหมดจาก Mock Data
const getAllBuildings = () => {
    return mockBuildings;
};

// ค้นหาอาคารจาก id (ใช้ในหน้ารายละเอียดอาคาร)
const getBuildingById = (buildingId) => {
    // แปลง id ให้เป็นตัวเลขเสมอ เพราะค่าที่ได้จาก URL จะเป็น string
    const numericId = Number(buildingId);
    return mockBuildings.find((building) => building.id === numericId) || null;
};