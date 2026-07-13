/* ==========================================================
   building.js
   ไฟล์หลักสำหรับควบคุมการทำงานของหน้ารายละเอียดอาคาร (building.html)
   ทำหน้าที่
   1. อ่านค่า id ของอาคารจาก Query String ของ URL
   2. โหลดรายละเอียดของอาคารจาก Mock Data
   3. แสดงผลข้อมูลอาคาร (รูปภาพ, ชื่อ, สิ่งอำนวยความสะดวก,
      จำนวนชั้น, แผนที่)
   4. จัดการกรณีไม่พบอาคารที่ตรงกับ id ที่ระบุ
   ========================================================== */

/* ----------------------------------------------------------
   อ่านค่า id ของอาคารจาก Query String ของ URL
   เช่น building.html?id=3 จะคืนค่า "3"
   ---------------------------------------------------------- */
const getBuildingIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("id");
};

/* ----------------------------------------------------------
   สลับการแสดงผลระหว่างเนื้อหารายละเอียดอาคาร
   กับข้อความแจ้งเตือนเมื่อไม่พบอาคาร
   ---------------------------------------------------------- */
const toggleBuildingNotFound = (isNotFound) => {
    const buildingDetailContent = document.getElementById("building-detail-content");
    const buildingNotFound = document.getElementById("building-not-found");

    if (buildingDetailContent) {
        buildingDetailContent.style.display = isNotFound ? "none" : "";
    }

    if (buildingNotFound) {
        buildingNotFound.style.display = isNotFound ? "" : "none";
    }
};

/* ----------------------------------------------------------
   แสดงผลรูปภาพหลักและชื่อของอาคารในส่วน Hero
   ---------------------------------------------------------- */
const renderBuildingHero = (building) => {
    const buildingHeroImage = document.getElementById("building-hero-image");
    const buildingHeroName = document.getElementById("building-hero-name");
    const buildingHeroSubtitle = document.getElementById("building-hero-subtitle");

    if (buildingHeroImage) {
        buildingHeroImage.src = building.image;
        buildingHeroImage.alt = `รูปภาพ${building.name}`;
        // หากโหลดรูปภาพไม่สำเร็จ ให้แสดงรูป Placeholder แทน
        buildingHeroImage.onerror = () => {
            buildingHeroImage.src = "images/buildings/placeholder.jpg";
        };
    }

    if (buildingHeroName) {
        buildingHeroName.textContent = building.name;
    }

    if (buildingHeroSubtitle) {
        buildingHeroSubtitle.textContent = `จำนวน ${building.floor} ชั้น • สิ่งอำนวยความสะดวก ${building.facilities.length} รายการ`;
    }
};

/* ----------------------------------------------------------
   แสดงผลรายการสิ่งอำนวยความสะดวกทั้งหมดของอาคาร (Box 1)
   ---------------------------------------------------------- */
const renderBuildingFacilities = (building) => {
    const facilitiesList = document.getElementById("facilities-list");

    if (!facilitiesList) {
        return;
    }

    facilitiesList.innerHTML = building.facilities
        .map((facility) => `<span class="facility-tag">${escapeHtml(facility)}</span>`)
        .join("");
};

/* ----------------------------------------------------------
   แสดงผลจำนวนชั้นของอาคาร (Box 2)
   ---------------------------------------------------------- */
const renderBuildingFloor = (building) => {
    const floorCount = document.getElementById("floor-count");

    if (floorCount) {
        floorCount.textContent = building.floor;
    }
};

/* ----------------------------------------------------------
   แสดงผลแผนที่ขนาดใหญ่ของอาคาร
   ---------------------------------------------------------- */
const renderBuildingMap = (building) => {
    const buildingMapImage = document.getElementById("building-map-image");

    if (!buildingMapImage) {
        return;
    }

    buildingMapImage.src = building.map;
    buildingMapImage.alt = `แผนที่${building.name}`;
    // หากโหลดรูปแผนที่ไม่สำเร็จ ให้แสดงรูป Placeholder แทน
    buildingMapImage.onerror = () => {
        buildingMapImage.src = "images/maps/placeholder.jpg";
    };
};

/* ----------------------------------------------------------
   โหลดรายละเอียดของอาคาร
   อ่าน id จาก URL แล้วนำไปค้นหาข้อมูลอาคารจาก Mock Data
   หากพบข้อมูล ให้แสดงผลทุกส่วนของหน้า หากไม่พบ ให้แสดงข้อความแจ้งเตือน
   ---------------------------------------------------------- */
const loadBuildingDetail = () => {
    const buildingId = getBuildingIdFromUrl();
    const building = getBuildingById(buildingId);

    if (!building) {
        toggleBuildingNotFound(true);
        return;
    }

    toggleBuildingNotFound(false);
    renderBuildingHero(building);
    renderBuildingFacilities(building);
    renderBuildingFloor(building);
    renderBuildingMap(building);
};

/* ----------------------------------------------------------
   โหลดข้อมูลหน้ารายละเอียดอาคารเมื่อ DOM พร้อมทำงาน
   ---------------------------------------------------------- */
const initBuildingPage = () => {
    loadBuildingDetail();
};

// รอให้ HTML โหลดเสร็จสมบูรณ์ก่อนเริ่มการทำงานทั้งหมด
document.addEventListener("DOMContentLoaded", initBuildingPage);