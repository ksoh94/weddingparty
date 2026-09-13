const WEDDING_YEAR = 2026;
const WEDDING_MONTH = 12; // 1월
const WEDDING_DAY = 19;

const WEDDING_HOUR = 10;
const WEDDING_MINUTE = 0;
const WEDDING_DATE = new Date(
  WEDDING_YEAR,
  WEDDING_MONTH - 1,
  WEDDING_DAY,
  WEDDING_HOUR,
  WEDDING_MINUTE,
  0
).getTime();
document.addEventListener("DOMContentLoaded", function () {
  renderCalendar();
  startCountdown();
});

function renderCalendar() {
  const monthTitle = document.getElementById("calendar-month");
  const calendarDays = document.getElementById("calendar-days");
  if (!monthTitle || !calendarDays) return;
  monthTitle.innerText = `${WEDDING_YEAR}. ${String(WEDDING_MONTH).padStart(2, "0")}`;
  calendarDays.innerHTML = "";
  const firstDay = new Date(WEDDING_YEAR, WEDDING_MONTH - 1, 1).getDay();
  const lastDate = new Date(WEDDING_YEAR, WEDDING_MONTH, 0).getDate();
  for (let i = 0; i < firstDay; i++) {
    const emptySpan = document.createElement("span");
    calendarDays.appendChild(emptySpan);
  }
  for (let day = 1; day <= lastDate; day++) {
    const daySpan = document.createElement("span");
    daySpan.innerText = day;
    if (day === WEDDING_DAY) {
      daySpan.classList.add("wedding-day");
    }
    calendarDays.appendChild(daySpan);
  }
}

function openEnvelope() {
  const overlay = document.getElementById("intro-overlay");
  const mainContent = document.getElementById("main-content");
  const bgm = document.getElementById("bgm");
  if (!overlay || !mainContent) return;
  overlay.style.transition = "opacity 0.8s ease";
  overlay.style.opacity = "0";
  setTimeout(function () {
    overlay.style.display = "none";
    mainContent.style.display = "block";
    window.scrollTo(0, 0);
    renderKakaoMap();
    if (bgm) {
      bgm.play().catch(function () {});
    }
  }, 800);
}
function toggleBgm() {
  const bgm = document.getElementById("bgm");
  const btn = document.getElementById("bgm-btn");
  if (!bgm || !btn) return;
  if (bgm.paused) {
    bgm.play().catch(function () {});
    btn.innerText = "🎵 Music On";
  } else {
    bgm.pause();
    btn.innerText = "🔇 Music Off";
  }
}
function startCountdown() {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}
function updateCountdown() {
  const now = new Date().getTime();
  const distance = WEDDING_DATE - now;
  const ddayBadge = document.getElementById("dday-counter");
  const daysEl = document.getElementById("timer-days");
  const hoursEl = document.getElementById("timer-hours");
  const minEl = document.getElementById("timer-min");
  const secEl = document.getElementById("timer-sec");
  if (!ddayBadge || !daysEl || !hoursEl || !minEl || !secEl) return;
  if (distance < 0) {
    ddayBadge.innerText = "D-DAY ♡ 축하해주셔서 감사합니다";
    daysEl.innerText = "00";
    hoursEl.innerText = "00";
    minEl.innerText = "00";
    secEl.innerText = "00";
    return;
  }
  const today = new Date();
const todayDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
);

const weddingDateOnly = new Date(
  WEDDING_YEAR,
  WEDDING_MONTH - 1,
  WEDDING_DAY
);

const days = Math.ceil(
  (weddingDateOnly - todayDate) / (1000 * 60 * 60 * 24)
);

const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
const minutes = Math.floor((distance / (1000 * 60)) % 60);
const seconds = Math.floor((distance / 1000) % 60);

// D-Day 표시
if (days === 0) {
  ddayBadge.innerText = "D-DAY";
} else {
  ddayBadge.innerText = `D-${days}`;
}

daysEl.innerText = String(days).padStart(2, "0");
hoursEl.innerText = String(hours).padStart(2, "0");
minEl.innerText = String(minutes).padStart(2, "0");
secEl.innerText = String(seconds).padStart(2, "0");
}
/*
=================================
기존 이미지 확대 기능
=================================
function openModal(src) {
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  if (!modal || !modalImg) return;
  modal.style.display = "flex";
  modalImg.src = src;
}
function closeModal() {
  const modal = document.getElementById("image-modal");
  if (modal) {
    modal.style.display = "none";
  }
}
*/

/* ================================
   갤러리 스와이프 기능
================================ */

let currentImageIndex = 0;

let swipeStartX = 0;
let swipeEndX = 0;


/* 갤러리 이미지 목록 */
function getGalleryImages() {
  return Array.from(
    document.querySelectorAll(".gallery-item img")
  );
}


/* 이미지 확대 열기 */
function openModal(src) {
  const modal = document.getElementById("image-modal");
  const galleryImages = getGalleryImages();

  if (!modal || galleryImages.length === 0) return;

  currentImageIndex = galleryImages.findIndex(function (img) {
    return img.src === src;
  });

  if (currentImageIndex === -1) {
    currentImageIndex = 0;
  }

  showGalleryImage();

  modal.style.display = "flex";

  /* 확대창이 열려 있을 때 배경 스크롤 방지 */
  document.body.style.overflow = "hidden";
}


/* 현재 이미지 표시 */
function showGalleryImage(direction = "") {
  const modalImg = document.getElementById("modal-img");
  const counter = document.getElementById("image-counter");
  const galleryImages = getGalleryImages();

  if (!modalImg || galleryImages.length === 0) return;

  // 기존 애니메이션 제거
  modalImg.classList.remove("slide-next", "slide-prev");

  // 새 이미지 표시
  modalImg.src = galleryImages[currentImageIndex].src;

  // 애니메이션 다시 실행시키기
  void modalImg.offsetWidth;

  if (direction === "next") {
    modalImg.classList.add("slide-next");
  }

  if (direction === "prev") {
    modalImg.classList.add("slide-prev");
  }

  if (counter) {
    counter.innerText =
      (currentImageIndex + 1) +
      " / " +
      galleryImages.length;
  }
}


/* 다음 이미지 */
function nextImage() {
  const galleryImages = getGalleryImages();

  if (galleryImages.length === 0) return;

  currentImageIndex++;

  if (currentImageIndex >= galleryImages.length) {
    currentImageIndex = 0;
  }

  showGalleryImage("next");
}


/* 이전 이미지 */
function prevImage() {
  const galleryImages = getGalleryImages();

  if (galleryImages.length === 0) return;

  currentImageIndex--;

  if (currentImageIndex < 0) {
    currentImageIndex = galleryImages.length - 1;
  }

  showGalleryImage("prev");
}


/* 이미지 확대 닫기 */
function closeModal() {
  const modal = document.getElementById("image-modal");

  if (modal) {
    modal.style.display = "none";
  }

  /* 배경 스크롤 다시 활성화 */
  document.body.style.overflow = "";
}


/* ================================
   좌우 스와이프
================================ */

document.addEventListener("pointerdown", function (event) {

  const modal = document.getElementById("image-modal");

  if (!modal || modal.style.display !== "flex") return;

  swipeStartX = event.clientX;
});


document.addEventListener("pointerup", function (event) {

  const modal = document.getElementById("image-modal");

  if (!modal || modal.style.display !== "flex") return;

  swipeEndX = event.clientX;

  const distance = swipeEndX - swipeStartX;

  /* 움직임이 작으면 스와이프로 처리하지 않음 */
  if (Math.abs(distance) < 50) return;


  /* 왼쪽으로 밀기 = 다음 사진 */
  if (distance < 0) {
    nextImage();
  }


  /* 오른쪽으로 밀기 = 이전 사진 */
  else {
    prevImage();
  }

});


/* ================================
   PC 키보드 지원
================================ */

document.addEventListener("keydown", function (event) {

  const modal = document.getElementById("image-modal");

  if (!modal || modal.style.display !== "flex") return;


  if (event.key === "ArrowRight") {
    nextImage();
  }


  if (event.key === "ArrowLeft") {
    prevImage();
  }


  if (event.key === "Escape") {
    closeModal();
  }

});


function toggleAccordion(button) {
  const content = button.nextElementSibling;
  const arrow = button.querySelector(".arrow");
  if (!content || !arrow) return;
  const isOpen = content.style.display === "block";
  content.style.display = isOpen ? "none" : "block";
  arrow.innerText = isOpen ? "▼" : "▲";
  if (isOpen) {
    button.classList.remove("active");
  } else {
    button.classList.add("active");
  }
}
function copyText(text) {
  navigator.clipboard.writeText(text)
    .then(function () {
      alert("계좌번호가 클립보드에 복사되었습니다.");
    })
    .catch(function () {
      alert("복사 실패! 계좌번호를 길게 눌러 직접 복사해주세요.");
    });
}
let kakaoMapRendered = false;
function renderKakaoMap() {
  if (kakaoMapRendered) return;
  if (typeof daum === "undefined" || !daum.roughmap || !daum.roughmap.Lander) return;
  new daum.roughmap.Lander({
    timestamp: "1789179017253",
    key: "2iqyuomfhie8",
    mapWidth: "100%",
    mapHeight: "280"
  }).render();
  kakaoMapRendered = true;
}
