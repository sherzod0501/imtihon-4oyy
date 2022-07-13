let elShow = document.querySelector(".hiro__show");
let elResult = document.querySelector(".hiro__result");
let elHiroError = document.querySelector(".hiro__error");
let elBooksList = document.querySelector(".books__list");
let elBookmarkList = document.querySelector(".books__bookmark-list");
let elSearchInput = document.querySelector(".header__search");
let elPrev = document.querySelector(".prev__btn");
let elNext = document.querySelector(".next__btn");
let elpageList = document.querySelector(".pagenition_btns");
let elLogoutBtn = document.querySelector(".header__link");
let elModalList = document.querySelector(".modals");
let elOverly = document.querySelector(".overly");
let elModalClose = document.querySelector(".modal__close");
let elOrderBtn = document.querySelector(".hiro__btn");

let fetchArray;
let storege = window.localStorage;
let getStorege = JSON.parse(storege.getItem("mark"));
let BookmarkArray = getStorege || [];
let modalArray = [];
let Search;

let page = 1;

let Api = `https://www.googleapis.com/books/v1/volumes?q=`;

// LOCAL STROGE
let token = window.localStorage.getItem("token");
if (!token) {
  window.location.replace("index.html");
}
elLogoutBtn.addEventListener("click", () => {
  window.localStorage.removeItem("token");
  window.location.replace("index.html");
});

const getYear = (time) => new Date(time).getFullYear();

// BOOKS RENDER
let renderBooks = function (arr, where) {
  elBooksList.innerHTML = null;

  fetchArray = book = () => arr.items;

  elShow.textContent = arr.items.length;
  elResult.textContent = arr.totalItems;

  arr.items.forEach((book) => {
    let html = `
    <li class="books_card_item">
    <div class="books_card_img_box">
      <img
        src="${book.volumeInfo.imageLinks?.smallThumbnail}"
        alt="bu yerda kitob rasmi bor"
        width="201"
        height="202"
        class="books_card_img"
      />
    </div>
    <p class="books_card_name">${
      book.volumeInfo?.title || "malumot topilmadi"
    }</p>
    <p class="books_card_author">${
      book.volumeInfo?.authors?.join(", ") || "malumot topilmadi"
    }</p>
    <p class="books_card_year">${
      getYear(book.volumeInfo?.publishedDate) || "malumot topilmadi"
    }</p>
    <div class="books_card_bottom">
    <div class="books_card_btn_box">
      <button class="bookmark_btn" data-bookmark-Add-Id=${
        book?.id
      }>Bookmark</button>
      <button class="more_info_btn" data-moreinfo=${
        book?.id
      }>More Info </button>
    </div>
    <a href=${
      book.volumeInfo.previewLink
    } target="blank"        class="books_card_read_btn">Read</a>
    </div>
  </li>
    `;
    //............................

    where.insertAdjacentHTML("beforeend", html);
  });
};

// BOOKS FETCH
let infoBooks = async function (book) {
  try {
    let fetchs = await fetch(Api + book);
    let newFetch = await fetchs.json();
    // console.log(newFetch);
    renderBooks(newFetch, elBooksList);
    renderPageniton(newFetch);
  } catch (error) {
    elHiroError.textContent = "Kitob topilmadi 😔";
    elShow.textContent = "0";
    elResult.textContent = "0";
  }
};
infoBooks("python");

// ORDDER BTN
elOrderBtn.addEventListener("click", function () {
  infoBooks(Search + "&orderBy=newest");
});

// BOOKMARK RENDER
let renderBookmark = function (arr, where) {
  elBookmarkList.innerHTML = null;
  arr.forEach((book) => {
    let html = `
        <li class="bookmark__item">
        <div class="bookmark_book_info_box">
          <h3 class="bookmark_book_name">${
            book.volumeInfo.title || "malumot topilmadi"
          }</h3>
          <p class="bookmark_book_author">${
            book.volumeInfo?.authors?.join(", ") || "malumot topilmadi"
          }</p>
        </div>
        <div class="bookmark_item_btn_box">
          <a href=${
            book.volumeInfo.previewLink
          } target="blank" class="bookmark_read_book_btn">
          <img src="./img/bookMarkReadIcon.svg" width="24" height="24" alt="order Icon">
          </a>
          <button class="bookmark_book_delete_btn" data-remove-Bookmark-Id=${
            book.id
          }>
          </button>
          </div>
          </li>
          `;
    where.insertAdjacentHTML("beforeend", html);
  });
  storege.setItem("mark", JSON.stringify(BookmarkArray));
};
renderBookmark(BookmarkArray, elBookmarkList);

// BOOKMARK PUSH
elBooksList.addEventListener("click", (evt) => {
  elBookmarkList.innerHTML = null;
  if (evt.target.matches(".bookmark_btn")) {
    fetchArray().forEach((book) => {
      if (
        evt.target.dataset.bookmarkAddId == book.id &&
        !BookmarkArray.includes(book)
      ) {
        BookmarkArray.push(book);
      }
    });
  }
  storege.setItem("mark", JSON.stringify(BookmarkArray));
  renderBookmark(BookmarkArray, elBookmarkList);
});
//  BOOKMARK DELETE
elBookmarkList.addEventListener("click", (evt) => {
  if (evt.target.matches(".bookmark_book_delete_btn")) {
    let FoundIndex = BookmarkArray.findIndex(
      (book) => evt.target.dataset.removeBookmarkId === book.id
    );
    BookmarkArray.splice(FoundIndex, 1);
    elBookmarkList.innerHTML = null;
    if (BookmarkArray.length === 0) {
      storege.removeItem("mark");
    }
  }
  storege.setItem("mark", JSON.stringify(BookmarkArray));
  renderBookmark(BookmarkArray, elBookmarkList);
});

// BOOKS INPUT
elSearchInput.addEventListener("input", () => {
  Search = elSearchInput.value;
  if (Search != "") {
    infoBooks(Search);
    elHiroError.textContent = "";
  } else {
    elShow.textContent = "0";
    elResult.textContent = "0";
  }
  page = 1;
});

// PAGENITION

let renderPageniton = function (page) {
  PageCount = Math.ceil(page.totalItems / 10);

  elpageList.innerHTML = null;

  for (let i = 1; i <= PageCount; i++) {
    newPageBtn = document.createElement("button");
    newPageBtn.setAttribute("class", "page-btn");
    if (page == i) {
      newPageBtn.classList.add("page__btn");
    }
    newPageBtn.textContent = i;
    elpageList.append(newPageBtn);
  }

  getPage = document.querySelectorAll(".pagenition_btns button");
  getPage.forEach((item) => {
    item.addEventListener("click", () => {
      let pageNumber = Number(item.innerHTML);
      page = pageNumber;
      infoBooks(Search + `&startIndex=${page}`);
    });
  });
};

elPrev.addEventListener("click", () => {
  if (page === 1) {
    elPrev.disabled = true;
  } else {
    elPrev.disabled = false;
  }
  page--;
  infoBooks(Search + `&startIndex=${page}`);
});
elNext.addEventListener("click", () => {
  if (page === PageCount) {
    elNext.disabled = true;
  } else {
    elNext.disabled = false;
  }
  page++;
  infoBooks(Search + `&startIndex=${page}`);
});

//  MODAL
let renderModal = function (arr, where) {
  elModalList.innerHTML = null;
  arr.forEach((modal) => {
    let html = `
    <div class="modal__top">
    <h2 class="modal__head">${
      modal.volumeInfo?.title || "malumot topilmadi"
    } "</h2>
    <button class="modal__close">&times;</button>
    </div>


    <div class="modal__body">
    <img class="modal__img text-centre" src="${
      modal.volumeInfo?.imageLinks?.smallThumbnail
    }" width="130" heigth="200" alt="kitob rasmi bor">
    <p class="modal__text">${
      modal.volumeInfo?.description || "malumot topilmadi"
    }</p>
    </div>
    <div class="modal__footer">
    <ul class="modal__list">
        <li class="modal__item">
        <p class="modal_item_info">Author:</p>
             <p class="modal__author modal-desck">${
               modal.volumeInfo?.authors?.join(", ") || "malumot topilmadi"
             }</p>
        </li>
        <li class="modal__item">
        <p class="modal_item_info">Published:</p>
             <p class="modal__year modal-desck">${
               getYear(modal.volumeInfo?.publishedDate) || "malumot topilmadi"
             }</p>
        </li>
        <li class="modal__item">
        <p class="modal_item_info">Publishers:</p>
             <p class="modal__publishers modal-desck">${
               modal.volumeInfo?.publisher
             }</p>
        </li>
        <li class="modal__item">
        <p class="modal_item_info">Categories: </p>
             <p class="modal-desck modal__categories">${
               modal.volumeInfo?.catigories?.join(", ") || "malumot topilmadi"
             } </p>
        </li>
        <li class="modal__item">
        <p class="modal_item_info">Pages Count:</p>
             <p class=" modal-desck">${
               modal.volumeInfo?.pageCount || "malumot topilmadi"
             }</p>
        </li>
    </ul>
    <div class="modal__btn">
        <a class="modal__link" href=${modal.volumeInfo?.previewLink}>Read</a>
    </div>
    </div>
    `;
    where.insertAdjacentHTML("beforeend", html);
  });
};

// OPEN MODAL
elBooksList.addEventListener("click", (evt) => {
  if (evt.target.matches(".more_info_btn")) {
    modalArray.splice(0);
    fetchArray().forEach((book) => {
      if (
        evt.target.dataset.moreinfo == book.id &&
        !modalArray.includes(book)
      ) {
        elModalList.classList.remove("visually-hidden");
        elOverly.classList.remove("visually-hidden");
        modalArray.push(book);
      }
    });
  }
  elModalList.innerHTML = null;
  modalArray.push(book);
  renderModal(modalArray, elModalList);
});

// CLOSE MODAL
let CloseModal = function () {
  elModalList.classList.add("visually-hidden");
  elOverly.classList.add("visually-hidden");
};
elModalList.addEventListener("click", CloseModal);
elOverly.addEventListener("click", CloseModal);
