/* =========================================
   Wedding Guestbook - Firebase
========================================= */

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


/* =========================================
   1. Firebase 설정

   Firebase Console에서 확인한 config 값을
   아래에 그대로 넣으세요.
========================================= */

const firebaseConfig = {
  apiKey: "AIzaSyBssMqVS3AVTJhXFA_JWiBUUaHqnt2Xhx4",
  authDomain: "wedding-guestbook-ksoh.firebaseapp.com",
  projectId: "wedding-guestbook-ksoh",
  storageBucket: "wedding-guestbook-ksoh.firebasestorage.app",
  messagingSenderId: "871918671043",
  appId: "1:871918671043:web:46b5cd088161968c21be76"
};


/* =========================================
   2. Firebase 초기화
========================================= */

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);


/* =========================================
   3. weddingday / weddingparty 자동 구분

   같은 Firebase 프로젝트를 사용해도
   축하글은 서로 섞이지 않습니다.
========================================= */

let guestbookId = "weddingday";

if (window.location.pathname.includes("/weddingparty/")) {
  guestbookId = "weddingparty";
}

console.log("Guestbook:", guestbookId);


/* =========================================
   4. Firestore 경로

   guestbooks
      └ weddingday
          └ messages
      └ weddingparty
          └ messages
========================================= */

const messagesRef = collection(
  db,
  "guestbooks",
  guestbookId,
  "messages"
);


/* =========================================
   5. HTML 요소
========================================= */

const nameInput =
  document.getElementById("guest-name");

const messageInput =
  document.getElementById("guest-message");

const submitButton =
  document.getElementById("guest-submit");

const guestbookList =
  document.getElementById("guestbook-list");


/* HTML 요소가 없으면 오류 방지 */

if (
  !nameInput ||
  !messageInput ||
  !submitButton ||
  !guestbookList
) {
  console.error(
    "축하글 HTML 요소를 찾을 수 없습니다."
  );
}


/* =========================================
   6. Firebase 익명 로그인
========================================= */

let currentUser = null;


/*
  로그인 완료 전에는
  등록 버튼을 누르지 못하게 합니다.
*/

if (submitButton) {
  submitButton.disabled = true;
  submitButton.textContent = "연결 중...";
}


onAuthStateChanged(
  auth,

  async (user) => {

    if (user) {

      currentUser = user;

      console.log(
        "Firebase 익명 로그인 완료:",
        user.uid
      );

      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent =
          "축하글 남기기";
      }

      return;
    }


    /*
      로그인되어 있지 않으면
      자동으로 익명 로그인
    */

    try {

      await signInAnonymously(auth);

    } catch (error) {

      console.error(
        "익명 로그인 실패:",
        error
      );

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent =
          "연결 실패";
      }

    }

  }
);


/* =========================================
   7. 축하글 등록
========================================= */

if (submitButton) {

  submitButton.addEventListener(
    "click",
    async () => {

      const name =
        nameInput.value.trim();

      const message =
        messageInput.value.trim();


      /* 이름 검사 */

      if (!name) {

        alert(
          "이름을 입력해주세요."
        );

        nameInput.focus();

        return;
      }


      if (name.length > 20) {

        alert(
          "이름은 20자 이하로 입력해주세요."
        );

        return;
      }


      /* 메시지 검사 */

      if (!message) {

        alert(
          "축하 메시지를 입력해주세요."
        );

        messageInput.focus();

        return;
      }


      if (message.length > 150) {

        alert(
          "축하 메시지는 150자 이하로 입력해주세요."
        );

        return;
      }


      /* 로그인 여부 */

      if (!currentUser) {

        alert(
          "서버에 연결 중입니다.\n잠시 후 다시 시도해주세요."
        );

        return;
      }


      /* 중복 클릭 방지 */

      submitButton.disabled = true;

      submitButton.textContent =
        "등록 중...";


      try {

        await addDoc(
          messagesRef,
          {
            name: name,
            message: message,
            createdAt: serverTimestamp()
          }
        );


        /*
          등록 성공 후 입력창 초기화
        */

        nameInput.value = "";
        messageInput.value = "";


        alert(
          "축하 메시지가 등록되었습니다."
        );


      } catch (error) {

        console.error(
          "축하글 등록 실패:",
          error
        );


        alert(
          "축하글 등록에 실패했습니다.\n잠시 후 다시 시도해주세요."
        );


      } finally {

        submitButton.disabled = false;

        submitButton.textContent =
          "축하글 남기기";

      }

    }
  );

}


/* =========================================
   8. 날짜 표시
========================================= */

function formatDate(timestamp) {

  if (!timestamp) {
    return "";
  }


  const date =
    timestamp.toDate();


  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      date.getDate()
    ).padStart(2, "0");


  return `${year}.${month}.${day}`;

}


/* =========================================
   9. 축하글 목록 실시간 조회
========================================= */

const guestbookQuery = query(
  messagesRef,
  orderBy(
    "createdAt",
    "desc"
  ),
  limit(30)
);


onSnapshot(

  guestbookQuery,

  (snapshot) => {

    if (!guestbookList) {
      return;
    }


    /*
      기존 목록 제거
    */

    guestbookList.innerHTML = "";


    /*
      글이 하나도 없을 때
    */

    if (snapshot.empty) {

      const emptyMessage =
        document.createElement("p");


      emptyMessage.className =
        "guestbook-empty";


      emptyMessage.textContent =
        "첫 번째 축하 메시지를 남겨주세요.";


      guestbookList.appendChild(
        emptyMessage
      );


      return;
    }


    /*
      Firestore 문서 → HTML
    */

    snapshot.forEach(
      (documentSnapshot) => {

        const data =
          documentSnapshot.data();


        /* 전체 카드 */

        const item =
          document.createElement("div");

        item.className =
          "guestbook-item";


        /* 이름 + 날짜 영역 */

        const header =
          document.createElement("div");

        header.className =
          "guestbook-item-header";


        /* 이름 */

        const name =
          document.createElement("strong");

        name.textContent =
          data.name || "";


        /* 날짜 */

        const date =
          document.createElement("span");

        date.textContent =
          formatDate(
            data.createdAt
          );


        /* 메시지 */

        const message =
          document.createElement("p");

        message.textContent =
          data.message || "";


        /* 조립 */

        header.appendChild(name);
        header.appendChild(date);

        item.appendChild(header);
        item.appendChild(message);

        guestbookList.appendChild(item);

      }
    );

  },


  /* 읽기 오류 */

  (error) => {

    console.error(
      "축하글 목록 불러오기 실패:",
      error
    );


    if (guestbookList) {

      guestbookList.innerHTML = "";

      const errorMessage =
        document.createElement("p");

      errorMessage.className =
        "guestbook-empty";

      errorMessage.textContent =
        "축하글을 불러오지 못했습니다.";

      guestbookList.appendChild(
        errorMessage
      );

    }

  }

);
