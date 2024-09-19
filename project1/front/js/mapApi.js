const baseUrl = `http://localhost:8888`;
const url = baseUrl + `/api`;
const url2 = baseUrl + `/api2`;

const showError = (error) => {
  let msg = document.querySelector("#resultMessage");
  msg.innerHTML = `<h3>${error}</h3>`;
  msg.style.display = "block";
};

const mapOptions = {
  center: new naver.maps.LatLng(37.5666103, 126.9783882),
  zoom: 10,
  zoomControl: true,
  zoomControlOptions: {
    position: naver.maps.Position.TOP_RIGHT,
    style: naver.maps.ZoomControlStyle.SMALL,
  },
};

const map = new naver.maps.Map("map", mapOptions);

const getNowLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const currentLocation = new naver.maps.LatLng(lat, lng);
          map.setCenter(currentLocation);
          map.setZoom(10);
          try {
            await getNowList(); // 현재 위치를 기반으로 캠핑장 리스트를 가져옵니다.
            resolve(currentLocation);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          console.error("현재 위치를 가져오는 데 실패했습니다.", error);
          reject(error);
        }
      );
    } else {
      alert("Geolocation을 지원하지 않는 브라우저입니다.");
      reject(new Error("Geolocation을 지원하지 않는 브라우저입니다."));
    }
  });
};

const getNowList = async () => {
  try {
    const response = await fetch(url2);
    const data = await response.json();
    const map = new naver.maps.Map("map", mapOptions);

    renderData(data, map); // 지도와 데이터 표시
  } catch (error) {
    console.error(error);
    showError(error);
  }
};

const getAllList = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    renderData(data);
  } catch (error) {
    console.error(error);
    showError(error);
  }
};

const renderData = (data, map) => {
  const result = document.querySelector("#campTable");
  result.innerHTML = "";

  // 데이터가 배열인지 확인
  if (Array.isArray(data.item)) {
    data.item.forEach((item, index) => {
      const inputText = `
      <tr>
        <td class="text-center col-1">${index + 1}</td>
        <td class="text-center col-3">${item.facltNm}</td>
        <td class="col-6">${item.addr1}</td>
      </tr>
      `;
      result.innerHTML += inputText;

      // 마커 추가
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(item.mapY, item.mapX),
        map: map,
        title: item.facltNm, // 캠핑장 이름
      });

      // 마커에 클릭 이벤트 추가 (마커 클릭 시 정보창 열기)
      const infoWindow = new naver.maps.InfoWindow({
        content: `<div style="padding:5px;">${item.facltNm}</div>`, // 캠핑장 이름 표시
      });

      naver.maps.Event.addListener(marker, "click", () => {
        infoWindow.open(map, marker);
      });
    });
  } else {
    result.innerHTML = "<tr><td colspan='3'>데이터가 없습니다.</td></tr>";
  }
};

const searchData = async (keyword) => {
  let numOfRows = 20; //기본값
  let pageNo = 1; //기본값
  const url3 =
    baseUrl +
    `/search?keyword=${keyword}&numOfRows=${numOfRows}&pageNo=${pageNo}`;
  try {
    const response = await fetch(url3);
    const data = await response.json();
    // console.log(data);
    // 지도를 찾아서 전달
    const mapOptions = {
      center: new naver.maps.LatLng(37.5666103, 126.9783882),
      zoom: 10,
    };
    const map = new naver.maps.Map("map", mapOptions);

    renderData(data, map);
  } catch (error) {
    showError(error);
  }
};

export { getAllList, getNowList, searchData, renderData, getNowLocation };
