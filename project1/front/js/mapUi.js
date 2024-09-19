import {
  getAllList,
  getNowList,
  searchData,
  renderData,
  getNowLocation,
} from "./mapApi.js";

const init = () => {
  getNowLocation();

  // 서치버튼 클릭시 검색결과를 table에 띄우기
  const btnSearch = document.querySelector("#btnSearch");
  const btnReset = document.querySelector("#btnReset");
  const mapReset = document.querySelector("#mapReset");
  const input = document.querySelector("#keyword");
  const wrMsg = document.querySelector("#warningMsg");

  // 엔터 누르면 서버에 결과 보내기
  input.addEventListener("keydown", (event) => {
    event.preventDefault(); // 기본 폼 제출 방지
    if (event.key == "Enter") {
      const keyword = input.value;
      if (!keyword) {
        wrMsg.style.display = "block";
        wrMsg.innerHTML = `검색어를 입력하세요.`;
        input.focus();
        return;
      }
      wrMsg.style.display = "none";
      searchData(keyword);
      input.value = "";
    }
  });

  // 검색기능
  btnSearch.addEventListener("click", (event) => {
    event.preventDefault(); // 기본 폼 제출 방지
    const keyword = input.value;
    if (!keyword) {
      wrMsg.style.display = "block";
      wrMsg.innerHTML = `검색어를 입력하세요.`;
      input.focus();
      return;
    }
    wrMsg.style.display = "none";
    searchData(keyword);
    input.value = "";
  });

  btnReset.addEventListener("click", async (event) => {
    event.preventDefault(); // 기본 폼 제출 방지
    input.value = ""; // 입력 필드 비우기

    try {
      await getNowLocation(); // 현재 위치를 가져오고, 자동으로 캠핑장 리스트를 가져옵니다.
    } catch (error) {
      console.error(
        "위치를 가져오거나 캠핑장 리스트를 가져오는 데 실패했습니다.",
        error
      );
    }
  });

  mapReset.addEventListener("click", () => {
    getNowLocation();
  });
};

document.addEventListener("DOMContentLoaded", init);
