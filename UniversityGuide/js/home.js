/* ==========================================================
   home.js
   ไฟล์หลักสำหรับควบคุมการทำงานของหน้าแรก (index.html)
   ทำหน้าที่
   1. โหลดข้อมูลเริ่มต้นของหน้าแรกเมื่อเปิดเว็บไซต์
   2. เตรียมฟังก์ชันสร้างการ์ดอาคาร (Reusable Component)
      ให้ search.js และ slider.js เรียกใช้งานร่วมกัน
   3. คำนวณและแสดงผลอาคารแนะนำ (Section 2 และ 3)
   ========================================================== */

/* ----------------------------------------------------------
   ป้องกันปัญหา HTML Injection เมื่อนำข้อความไปแสดงผล
   ---------------------------------------------------------- */
const escapeHtml = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
};

/* ----------------------------------------------------------
   คำนวณความนิยมของสิ่งอำนวยความสะดวกแต่ละประเภท
   โดยนับจากจำนวนอาคารทั้งหมดที่มีสิ่งอำนวยความสะดวกนั้น ๆ
   ยิ่งมีอาคารที่มีสิ่งอำนวยความสะดวกนี้มาก ยิ่งถือว่า "นิยม" มาก
   ---------------------------------------------------------- */
const getFacilityPopularityMap = () => {
    const popularityMap = {};

    getAllBuildings().forEach((building) => {
        building.facilities.forEach((facility) => {
            popularityMap[facility] = (popularityMap[facility] || 0) + 1;
        });
    });

    return popularityMap;
};

/* ----------------------------------------------------------
   เลือกสิ่งอำนวยความสะดวก Top 3 ของอาคารหนึ่ง ๆ
   เรียงตามความนิยม หากความนิยมเท่ากันให้สุ่มลำดับ
   ---------------------------------------------------------- */
const getTopFacilities = (building, limit = 3) => {
    const popularityMap = getFacilityPopularityMap();

    // จัดกลุ่มสิ่งอำนวยความสะดวกตามคะแนนความนิยม
    const facilitiesWithScore = building.facilities.map((facility) => ({
        name: facility,
        score: popularityMap[facility] || 0
    }));

    // สุ่มลำดับก่อน แล้วค่อยเรียงตามคะแนน เพื่อให้รายการที่คะแนนเท่ากัน
    // ถูกสลับตำแหน่งแบบสุ่มโดยอัตโนมัติ (Fisher-Yates ทำผ่านการสุ่มก่อน)
    const shuffled = [...facilitiesWithScore].sort(() => Math.random() - 0.5);
    const sortedByPopularity = shuffled.sort((a, b) => b.score - a.score);

    return sortedByPopularity.slice(0, limit).map((item) => item.name);
};

/* ----------------------------------------------------------
   สร้าง HTML ของการ์ดอาคารแบบมาตรฐาน (Reusable)
   ใช้ในผลการค้นหา, Section 2/3 (บางส่วน) และ Slider
   ---------------------------------------------------------- */
const createBuildingCardHTML = (building) => {
    const topFacilities = getTopFacilities(building, 3);

    const facilityTagsHTML = topFacilities
        .map((facility) => `<span class="facility-tag">${escapeHtml(facility)}</span>`)
        .join("");

    return `
        <article class="building-card" data-building-id="${building.id}" onclick="navigateToBuilding(${building.id})">
            <img
                class="building-card-image"
                src="${building.image}"
                alt="รูปภาพ${escapeHtml(building.name)}"
                onerror="this.src='images/buildings/placeholder.jpg'"
            >
            <div class="building-card-body">
                <h3 class="building-card-name">${escapeHtml(building.name)}</h3>
                <div class="building-card-facilities">
                    ${facilityTagsHTML}
                </div>
            </div>
        </article>
    `;
};

/* ----------------------------------------------------------
   สร้าง HTML ของการ์ดแนะนำแบบใหญ่ (ใช้ใน Section 2 และ 3)
   ---------------------------------------------------------- */
const createRecommendCardHTML = (building) => {
    const topFacilities = getTopFacilities(building, 3);
    const facilitiesText = topFacilities.join(" • ");

    return `
        <div class="recommend-card" onclick="navigateToBuilding(${building.id})">
            <img
                class="recommend-card-image"
                src="${building.image}"
                alt="รูปภาพ${escapeHtml(building.name)}"
                onerror="this.src='images/buildings/placeholder.jpg'"
            >
            <div class="recommend-card-body">
                <span class="recommend-badge">แนะนำสำหรับคุณ</span>
                <h3 class="recommend-card-name">${escapeHtml(building.name)}</h3>
                <p class="recommend-card-meta">${escapeHtml(facilitiesText)}</p>
                <p class="recommend-card-meta">จำนวน ${building.floor} ชั้น</p>
            </div>
        </div>
    `;
};

/* ----------------------------------------------------------
   ไปยังหน้ารายละเอียดอาคารเมื่อผู้ใช้คลิกที่การ์ด
   ---------------------------------------------------------- */
const navigateToBuilding = (buildingId) => {
    window.location.href = `building.html?id=${buildingId}`;
};

/* ----------------------------------------------------------
   สุ่มเลือกอาคารแนะนำ 1 หลัง จาก searchCount สูงสุด
   หากมีอาคารที่ searchCount เท่ากันหลายหลัง ให้สุ่มเลือก 1 หลัง
   สามารถระบุ excludeIds เพื่อไม่ให้เลือกอาคารที่แนะนำไปแล้วซ้ำ
   ---------------------------------------------------------- */
const getRandomRecommendedBuilding = (excludeIds = []) => {
    const candidates = getAllBuildings().filter(
        (building) => !excludeIds.includes(building.id)
    );

    if (candidates.length === 0) {
        return null;
    }

    const highestSearchCount = Math.max(
        ...candidates.map((building) => building.searchCount)
    );

    const topCandidates = candidates.filter(
        (building) => building.searchCount === highestSearchCount
    );

    const randomIndex = Math.floor(Math.random() * topCandidates.length);
    return topCandidates[randomIndex];
};

/* ----------------------------------------------------------
   โหลดและแสดงผลอาคารแนะนำ Section 2 และ Section 3
   ทั้งสอง Section ต้องแนะนำอาคารคนละหลังกันเสมอ
   ---------------------------------------------------------- */
const loadRecommendations = () => {
    const recommendCard1 = document.getElementById("recommend-card-1");
    const recommendCard2 = document.getElementById("recommend-card-2");

    const firstRecommendation = getRandomRecommendedBuilding();
    if (!firstRecommendation) {
        recommendCard1.innerHTML = `<p class="empty-state">ไม่มีข้อมูลอาคารแนะนำในขณะนี้</p>`;
        return;
    }
    recommendCard1.innerHTML = createRecommendCardHTML(firstRecommendation);

    const secondRecommendation = getRandomRecommendedBuilding([firstRecommendation.id]);
    if (!secondRecommendation) {
        recommendCard2.innerHTML = `<p class="empty-state">ไม่มีข้อมูลอาคารแนะนำเพิ่มเติม</p>`;
        return;
    }
    recommendCard2.innerHTML = createRecommendCardHTML(secondRecommendation);
};

/* ----------------------------------------------------------
   โหลดข้อมูลหน้าแรกทั้งหมดเมื่อ DOM พร้อมทำงาน
   ---------------------------------------------------------- */
const initHomePage = () => {
    // แสดงผลอาคารแนะนำ Section 2 และ 3
    loadRecommendations();

    // เริ่มการทำงานของระบบค้นหา (ประกาศอยู่ในไฟล์ search.js)
    if (typeof initSearchFeature === "function") {
        initSearchFeature();
    }

    // เริ่มการทำงานของ Slider (ประกาศอยู่ในไฟล์ slider.js)
    if (typeof initSlider === "function") {
        initSlider();
    }
};

// รอให้ HTML โหลดเสร็จสมบูรณ์ก่อนเริ่มการทำงานทั้งหมด
document.addEventListener("DOMContentLoaded", initHomePage);