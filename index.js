
/**
 * Thay background sau khi ảnh load xong
 * @param {String} selector - CSS selector
 * @param {String} imageUrl - URL ảnh mới
 * @param {Object} styleOptions - Tuỳ chọn style nền
 */
function safeSetBackground(selector, imageUrl, styleOptions = {}) {
  const el = document.querySelector(selector);
  if (!el) return;

  const img = new Image();
  img.src = imageUrl;

  img.onload = () => {
    // Chỉ đổi khi ảnh đã sẵn sàng
    el.style.backgroundImage = `url('${imageUrl}')`;
  };

  img.onerror = () => {
    console.warn("Không load được ảnh:", imageUrl);
  };
}

const list = [
  // {
  //   selector: "#w-9xiryvgi .image-background",
  //   url: "./images/12.jpg",
  // },
  // { selector: "#w-jp9nko93 .image-background", url: "./images/32.jpg" },
  // { selector: "#w-qtuwe23y .image-background", url: "./images/31.jpg" },
  // { selector: "#w-2w9mb918 .image-background", url: "./images/3.jpg" },
  // { selector: "#w-2w9mb918 .image-background", url: "./images/3.jpg" },
  // { selector: "#w-pb7be6s0 .image-background", url: "./images/5.jpg" },
  // { selector: "#w-0qkm3qey .image-background", url: "./images/21.jpg" },
];

list.forEach((item) => {
  safeSetBackground(item.selector, item.url);
});

// Chặn user F12
// document.addEventListener("keydown", function (e) {
//   // F12
//   if (e.key === "F12" || e.keyCode === 123) {
//     e.preventDefault();
//     return false;
//   }

//   // Ctrl+Shift+I or Ctrl+Shift+J or Ctrl+U or Ctrl+S
//   if (
//     (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
//     (e.ctrlKey && (e.key === "U" || e.key === "S"))
//   ) {
//     e.preventDefault();
//     return false;
//   }
// });

// document.addEventListener("contextmenu", function (e) {
//   e.preventDefault();
// });

// Lưu form vào GG sheet

const GOOGLE_SCRIPT_URL_THAM_DU =
  "https://script.google.com/macros/s/AKfycbx8Mx6HpguklnG7meKPek5xyoEt45DR2HMBffzRCI7yn_-VPbbRUnAtcgBgjbvurhZ_/exec";

const closeIds = ["w-ysykddk8"];
const formIds = ["3jnfqzjo"];

formIds.forEach(function (id, index) {
  const form = document.getElementById(id);
  const closeBtn = document.getElementById(closeIds[index]);
  if (!form || !closeBtn) return; // an toàn nếu thiếu phần tử

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    closeBtn.click();
    const formData = new FormData(form);
    let selected = formData.getAll("select_1");
    const data = {
      name: "'" + form.full_name.value,
      relationship: "'" + form.text_input_1.value,
      message: "'" + form.text_input_2.value,
      isInvite: selected.join(", ")
    };
    fetch(GOOGLE_SCRIPT_URL_THAM_DU, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        res.json();
        form.reset(); // Reset form sau khi submit thành công\
      }) // Nếu Apps Script trả về JSON
      .catch((err) => console.log(err));
  });
});

// Hiển thị notification
//     <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
/* <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css" /> */
{
  /* <style>
    .toast-content {
        display: flex;
        align-items: flex-start;
        gap: 12px;
    }

    .toast-icon {
        font-size: 24px;
        flex-shrink: 0;
    }

    .toast-text {
        flex: 1;
    }

    .toast-title {
        font-weight: bold;
        margin-bottom: 4px;
        font-size: 16px;
    }

    .toast-message {
        font-size: 14px;
        line-height: 1.4;
    }
</style> */
}

const sheetID = "1nfSLogrTp2Vp1s2uiMZeF8g30d8fUDjIAvGdms220U0";
const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json`;

let messages = []; // Chuyển sang `let`

// Cấu hình
const config = {
  displayDuration: 4000,
  intervalTime: 7000,
};

let autoInterval;

// Tạo toast notification
function createToast(messageData) {
  console.log("🔔 Hiển thị toast:", messageData);
  const toastContent = `
        <div class="toast-content">
            <div class="toast-icon">
                <img src="https://w.ladicdn.com/source/notify.svg?v=1.0" alt="Icon" />
            </div>
            <div class="toast-text">
                <div class="toast-title">${messageData["Tên"]}</div>
                <div class="toast-message">${messageData["Lời chúc"]}</div>
                <div class="toast-message">${messageData["Mối quan hệ"]}</div>
            </div>
        </div>
    `;

  Toastify({
    text: toastContent,
    duration: config.displayDuration,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: "white",
      color: "#333",
      borderRadius: "12px",
      padding: "20px",
      minWidth: "350px",
      maxWidth: "400px",
      width: "80%",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      fontSize: "14px",
    },
    escapeMarkup: false,
  }).showToast();
}

// Hiển thị toast ngẫu nhiên
function showRandomToast() {
  if (!messages.length) return;
  const randomIndex = Math.floor(Math.random() * messages.length);
  const messageData = messages[randomIndex];
  createToast(messageData);
}

// Bắt đầu auto show
function startAutoShow() {
  showRandomToast();
  autoInterval = setInterval(showRandomToast, config.intervalTime);
  console.log("🚀 Auto notification đã bắt đầu");
}

// Load dữ liệu từ Google Sheets
async function fetchMessages() {
  try {
    const res = await fetch(url);
    const data = await res.text();
    const json = JSON.parse(data.substring(47).slice(0, -2));
    const rows = json.table.rows.map((row) =>
      row.c.map((cell) => cell?.v || "")
    );
    const headers = rows[0];

    messages = rows.slice(1).map((row) => {
      let obj = {};
      headers.forEach((key, i) => {
        obj[key] = row[i];
      });
      return obj;
    });

    console.log("📥 Fetched messages:", messages);
    startAutoShow(); // ✅ Chỉ gọi khi đã có dữ liệu
  } catch (err) {
    console.error("❌ Lỗi khi lấy dữ liệu:", err);
  }
}

// Khởi tạo khi load trang
window.addEventListener("load", () => {
  console.log("🎉 Trang đã load xong");
  fetchMessages(); // Gọi hàm load dữ liệu
});

// CountDown đếm ngược thời gian

function updateCountdown(targetDateStr) {
  // targetDateStr: "YYYY-MM-DD HH:mm:ss" hoặc "YYYY-MM-DD"
  const targetDate = new Date(targetDateStr);
  const now = new Date();
  let diff = targetDate - now;

  // Nếu đã qua ngày thì hiển thị 0 hết
  if (diff < 0) diff = 0;

  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  let minutes = Math.floor((diff / (1000 * 60)) % 60);
  let seconds = Math.floor((diff / 1000) % 60);

  // Hiển thị lên các phần tử
  const elDay = document.querySelector(
    "#COUNTDOWN_ITEM1 .ladi-countdown-text span"
  );
  const elHour = document.querySelector(
    "#COUNTDOWN_ITEM2 .ladi-countdown-text span"
  );
  const elMinute = document.querySelector(
    "#COUNTDOWN_ITEM3 .ladi-countdown-text span"
  );
  const elSecond = document.querySelector(
    "#COUNTDOWN_ITEM4 .ladi-countdown-text span"
  );

  if (elDay) elDay.textContent = days.toString().padStart(2, "0");
  if (elHour) elHour.textContent = hours.toString().padStart(2, "0");
  if (elMinute) elMinute.textContent = minutes.toString().padStart(2, "0");
  if (elSecond) elSecond.textContent = seconds.toString().padStart(2, "0");
}

// Ví dụ: Đếm ngược đến ngày 2025-10-19
setInterval(function () {
  updateCountdown("2025-10-19 07:00:00");
}, 1000);

window.addEventListener("DOMContentLoaded", function () {
  // Lấy tham số name từ URL
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  // Hiển thị vào div PARAGRAPH94 nếu có giá trị
  if (name) {
    const el = document.querySelector("#w-amfdze1w .name");
    if (el) el.textContent = name;
  }
});

// Hiển thị icon quà tặng

//<div id="lottie1" class="lottie-box"></div>
// <script src="https://unpkg.com/lottie-web@5.12.0/build/player/lottie.min.js"></script>
{
  /* <style>
    @keyframes lottieAppear {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2);
        }

        60% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.4);
        }

        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }

    @keyframes lottieDisappear {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }

        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2);
        }
    }

    .lottie-box {
        position: fixed;
        top: 50%;
        left: 50%;
        width: 300px;
        height: 300px;
        transform: translate(-50%, -50%);
        z-index: 9999;
        animation: lottieAppear 7s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
    }

    .lottie-box.lottie-hide {
        animation: lottieDisappear 7s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
    }
</style> */
}

// const giftLottieMap = {
//   Hổ: "icon/lion-roar.json",
//   "Hộp quà": "icon/birthdayGift.json",
//   Nhà: "icon/home.json",
//   Tiền: "icon/moneyRainDashboard.json",
//   "Trái tim": "icon/hearts.json",
//   "Tràng pháo tay": "icon/clap.json",
// };

// function showLottieSequence(giftName) {
//   if (!giftName) return;

//   const lottieBox = document.getElementById("lottie1");
//   lottieBox.classList.remove("lottie-hide");
//   lottieBox.style.display = "block";
//   lottieBox.style.animation =
//     "lottieAppear 5s cubic-bezier(.4,2,.6,1) forwards";

//   const lottiePath = giftLottieMap[giftName];

//   const anim = lottie.loadAnimation({
//     container: lottieBox,
//     renderer: "svg",
//     loop: true,
//     autoplay: true,
//     path: lottiePath,
//   });

//   setTimeout(() => {
//     lottieBox.classList.add("lottie-hide");
//     setTimeout(() => {
//       anim.destroy();
//       lottieBox.style.display = "none";
//       lottieBox.classList.remove("lottie-hide");
//       lottieBox.style.animation = "";
//     }, 1000); // Ẩn animation 1s
//   }, config.displayDuration - 1000); // Hiển thị đúng thời gian noti
// }
