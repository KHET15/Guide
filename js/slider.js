/* ==========================================================
   slider.js
   ไฟล์ควบคุมการทำงานของ Building Slider ในหน้าแรก (index.html)
   ทำหน้าที่
   1. แบ่งอาคารทั้งหมดออกเป็นหน้า ๆ หน้าละ 4 อาคาร
   2. แสดงผลอาคารของหน้าปัจจุบันภายใน .slider-track
   3. เปลี่ยนหน้าของ Slider เมื่อผู้ใช้กดปุ่มก่อนหน้า/ถัดไป
   4. ควบคุมสถานะ (เปิด/ปิด) ของปุ่มเลื่อนตามตำแหน่งหน้าปัจจุบัน
   ========================================================== */

// จำนวนการ์ดอาคารที่แสดงต่อหนึ่งหน้าของ Slider
const SLIDER_ITEMS_PER_PAGE = 4;

// เก็บตำแหน่งหน้าปัจจุบันของ Slider (เริ่มต้นที่หน้าแรก)
let currentSliderPage = 0;

/* ----------------------------------------------------------
   แบ่งรายการอาคารทั้งหมดออกเป็นหน้า ๆ
   หน้าละ itemsPerPage อาคาร เพื่อนำไปแสดงผลทีละหน้า
   ---------------------------------------------------------- */
const getSliderPages = (buildings, itemsPerPage) => {
    const pages = [];

    for (let startIndex = 0; startIndex < buildings.length; startIndex += itemsPerPage) {
        pages.push(buildings.slice(startIndex, startIndex + itemsPerPage));
    }

    return pages;
};

/* ----------------------------------------------------------
   ควบคุมสถานะเปิด/ปิดของปุ่มเลื่อน (ก่อนหน้า/ถัดไป)
   ปิดปุ่มก่อนหน้าเมื่ออยู่หน้าแรก และปิดปุ่มถัดไปเมื่ออยู่หน้าสุดท้าย
   ---------------------------------------------------------- */
const updateSliderNavState = (totalPages) => {
    const sliderPrevBtn = document.getElementById("slider-prev-btn");
    const sliderNextBtn = document.getElementById("slider-next-btn");

    if (sliderPrevBtn) {
        sliderPrevBtn.disabled = currentSliderPage === 0;
    }

    if (sliderNextBtn) {
        sliderNextBtn.disabled = currentSliderPage >= totalPages - 1;
    }
};

/* ----------------------------------------------------------
   เปลี่ยนหน้าของ Slider
   แสดงการ์ดอาคารของหน้าที่ระบุ แล้วอัปเดตสถานะปุ่มเลื่อนตามไปด้วย
   ---------------------------------------------------------- */
const renderSliderPage = (pageIndex) => {
    const sliderTrack = document.getElementById("slider-track");

    if (!sliderTrack) {
        return;
    }

    const sliderPages = getSliderPages(getAllBuildings(), SLIDER_ITEMS_PER_PAGE);
    const currentPageBuildings = sliderPages[pageIndex] || [];

    // สร้างการ์ดอาคารของหน้าปัจจุบัน โดยใช้ฟังก์ชันร่วมจาก home.js
    sliderTrack.innerHTML = currentPageBuildings
        .map((building) => createBuildingCardHTML(building))
        .join("");

    updateSliderNavState(sliderPages.length);
};

/* ----------------------------------------------------------
   เลื่อนไปหน้าก่อนหน้าของ Slider
   ---------------------------------------------------------- */
const goToPreviousSlide = () => {
    if (currentSliderPage === 0) {
        return;
    }

    currentSliderPage -= 1;
    renderSliderPage(currentSliderPage);
};

/* ----------------------------------------------------------
   เลื่อนไปหน้าถัดไปของ Slider
   ---------------------------------------------------------- */
const goToNextSlide = () => {
    const sliderPages = getSliderPages(getAllBuildings(), SLIDER_ITEMS_PER_PAGE);

    if (currentSliderPage >= sliderPages.length - 1) {
        return;
    }

    currentSliderPage += 1;
    renderSliderPage(currentSliderPage);
};

/* ----------------------------------------------------------
   เริ่มการทำงานของ Slider
   ผูกเหตุการณ์กับปุ่มก่อนหน้า/ถัดไป และแสดงผลหน้าแรกทันที
   ---------------------------------------------------------- */
const initSlider = () => {
    const sliderPrevBtn = document.getElementById("slider-prev-btn");
    const sliderNextBtn = document.getElementById("slider-next-btn");

    if (sliderPrevBtn) {
        sliderPrevBtn.addEventListener("click", goToPreviousSlide);
    }

    if (sliderNextBtn) {
        sliderNextBtn.addEventListener("click", goToNextSlide);
    }

    // แสดงผลอาคารหน้าแรกของ Slider ทันทีที่เริ่มทำงาน
    currentSliderPage = 0;
    renderSliderPage(currentSliderPage);
};