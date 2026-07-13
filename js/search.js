/* ==========================================================
   search.js
   ไฟล์ควบคุมระบบค้นหาอาคารในหน้าแรก (index.html)
   ทำหน้าที่
   1. รับคำค้นหาจากผู้ใช้ผ่านช่อง .search-input
   2. ค้นหาอาคารจากชื่ออาคาร และจากสิ่งอำนวยความสะดวก
   3. แสดงผลลัพธ์การค้นหาโดยใช้การ์ดอาคาร (Reusable Component
      จาก home.js) ภายในพื้นที่ .search-results-grid
   ========================================================== */

/* ----------------------------------------------------------
   ค้นหาอาคารจากชื่ออาคาร
   เทียบแบบไม่สนตัวพิมพ์เล็ก/ใหญ่ และตัดช่องว่างหัวท้ายออกก่อน
   ---------------------------------------------------------- */
const searchByName = (buildings, keyword) => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return buildings.filter((building) =>
        building.name.toLowerCase().includes(normalizedKeyword)
    );
};

/* ----------------------------------------------------------
   ค้นหาอาคารจากสิ่งอำนวยความสะดวก
   ตรวจสอบว่ามีสิ่งอำนวยความสะดวกใดในอาคารตรงกับคำค้นหาบ้าง
   ---------------------------------------------------------- */
const searchByFacility = (buildings, keyword) => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return buildings.filter((building) =>
        building.facilities.some((facility) =>
            facility.toLowerCase().includes(normalizedKeyword)
        )
    );
};

/* ----------------------------------------------------------
   รวมผลการค้นหาจากชื่ออาคารและสิ่งอำนวยความสะดวกเข้าด้วยกัน
   โดยไม่ให้อาคารซ้ำกันในผลลัพธ์ (อ้างอิงความซ้ำจาก id)
   ---------------------------------------------------------- */
const searchBuildings = (keyword) => {
    const allBuildings = getAllBuildings();

    const nameMatches = searchByName(allBuildings, keyword);
    const facilityMatches = searchByFacility(allBuildings, keyword);

    // รวมผลลัพธ์ทั้งสองชุด แล้วกรองอาคารที่ id ซ้ำกันออก
    const combinedMatches = [...nameMatches, ...facilityMatches];
    const uniqueMatches = combinedMatches.filter(
        (building, index) =>
            combinedMatches.findIndex((item) => item.id === building.id) === index
    );

    return uniqueMatches;
};

/* ----------------------------------------------------------
   แสดงผลการค้นหาลงในพื้นที่ .search-results-grid
   หากไม่พบผลลัพธ์ ให้แสดงข้อความแจ้งเตือนแทน
   ---------------------------------------------------------- */
const renderSearchResults = (results) => {
    const searchResultsGrid = document.getElementById("search-results-grid");

    if (!searchResultsGrid) {
        return;
    }

    if (results.length === 0) {
        searchResultsGrid.innerHTML = `<p class="empty-state">ไม่พบอาคารที่ตรงกับคำค้นหาของคุณ</p>`;
        return;
    }

    // สร้างการ์ดอาคารสำหรับผลลัพธ์แต่ละรายการ โดยใช้ฟังก์ชันร่วมจาก home.js
    searchResultsGrid.innerHTML = results
        .map((building) => createBuildingCardHTML(building))
        .join("");
};

/* ----------------------------------------------------------
   ล้างผลการค้นหา (ใช้เมื่อผู้ใช้ไม่ได้กรอกคำค้นหาใด ๆ)
   ---------------------------------------------------------- */
const clearSearchResults = () => {
    const searchResultsGrid = document.getElementById("search-results-grid");

    if (searchResultsGrid) {
        searchResultsGrid.innerHTML = "";
    }
};

/* ----------------------------------------------------------
   จัดการเหตุการณ์เมื่อผู้ใช้กดปุ่มค้นหา (หรือกด Enter)
   ---------------------------------------------------------- */
const handleSearch = () => {
    const searchInput = document.getElementById("search-input");

    if (!searchInput) {
        return;
    }

    const keyword = searchInput.value;

    // หากไม่ได้กรอกคำค้นหา ให้ล้างผลลัพธ์แล้วไม่ต้องค้นหาต่อ
    if (keyword.trim() === "") {
        clearSearchResults();
        return;
    }

    const results = searchBuildings(keyword);
    renderSearchResults(results);
};

/* ----------------------------------------------------------
   เริ่มการทำงานของระบบค้นหา
   ผูกเหตุการณ์กับปุ่มค้นหา และรองรับการกด Enter ในช่องค้นหา
   ---------------------------------------------------------- */
const initSearchFeature = () => {
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");

    if (searchButton) {
        searchButton.addEventListener("click", handleSearch);
    }

    if (searchInput) {
        searchInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleSearch();
            }
        });
    }
};