const baseUrl = `http://localhost:8888`;

var mapOptions = {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 15
};

var map = new naver.maps.Map('map', mapOptions);

var marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(37.3595704, 127.105399),
    map: map
})


const init = async () => {
    console.log('init');

    document.querySelector('#searchForm button[name=searchBtn]').addEventListener('click', async function (event) {
        event.preventDefault();
        // 폼의 기본 제출 방식을 막음
        // 사용자가 입력한 검색어 가져오기
        const searchQuery = document.querySelector('input[name=searchQuery]').value;
        const searchResult = document.querySelector('#searchResult');

        // fetch로 비동기 요청
        try {
            if (!searchQuery) { //수정 예정
                alert('검색 결과 없음');
                searchResult.innerHTML = ``;
                return;
            }

            const response = await fetch(baseUrl + `/searchList?keyword=${encodeURIComponent(searchQuery)}`);

            if (!response.ok) {
                throw new Error('네트워크 응답에 문제가 있습니다.');
            }
            const data = await response.json(); // 서버에서 받은 JSON 데이터

            const searchList = data.response.body.items.item;//검색결과 array 추출

            if (!searchList) {
                alert('검색 결과 없음');
                searchResult.innerHTML = ``;
                return;
            } else {
                localStorage.setItem("searchList", JSON.stringify(searchList));
                // console.log(JSON.parse(localStorage.searchList));
                renderOnTable();
            }


        } catch (error) {
            console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
        }
    });
};

const renderOnTable = () => {
    const searchList = JSON.parse(localStorage.searchList);
    // console.log(searchList);
    searchResult.innerHTML = `${searchList.map((campSite) => {
        // console.log(searchList);
        return `<tr>
                    <td>${campSite.contentId}</td>
                    <td>${campSite.facltNm}</td>
                    <td>${campSite.induty}</td>
                    <td>${campSite.doNm}</td>
                    <td>${campSite.addr1}</td>
                    <td><button onclick="getSiteInfo(${campSite.contentId})">조회</button></td>
                </tr>`;
    }).join('')}`
}

const getSiteInfo = (contentId) => {
    const searchList = JSON.parse(localStorage.searchList);
    let moreInfo = searchList.filter((campSite) => { return contentId == campSite.contentId });
    moreInfo = moreInfo.pop();
    localStorage.setItem("moreInfo", JSON.stringify(moreInfo));
    // console.log(moreInfo)

    const target = document.querySelector("#moreinfo tbody")
    target.innerHTML = `
        <tr>
            <th>id</th>
            <td>${moreInfo.contentId}</td>
        </tr>
        <tr>
            <th>이름</th>
            <td>${moreInfo.facltNm}</td>
        </tr>
        <tr>
            <th>상세설명</th>
            <td>${moreInfo.featureNm}</td>
        </tr>
        <tr>
            <th>캠핑장 종류</th>
            <td>${moreInfo.induty}</td>
        </tr>
        <tr>
            <th>위치</th>
            <td>${moreInfo.doNm}</td>
        </tr>
        <tr>
            <th>상세주소</th>
            <td>${moreInfo.addr1}</td>
        </tr>
        <tr>
            <th>전화번호</th>
            <td>${moreInfo.tel}</td>
        </tr>
        <tr>
            <th>홈페이지</th>
            <td><a href='${moreInfo.homepage}' target='_blank'>${moreInfo.homepage}</a></td>
        </tr>
        <tr>
            <th>소개 이미지</th>
            <td><img src='${moreInfo.firstImageUrl}'></td>
        </tr>
        `
    markOnMap();
}

const markOnMap = () => {
    let mapX = 37.3595704, mapY = 127.105399;
    if (JSON.parse(localStorage.moreInfo)) {
        moreInfo = JSON.parse(localStorage.moreInfo);
        console.log(moreInfo)
        mapX = parseFloat(moreInfo.mapX);
        mapY = parseFloat(moreInfo.mapY);
    }
    console.log(mapY, mapX);
    if (marker) {
        marker.setMap(null); // 기존 마커를 지도에서 제거
    }

    // 새로운 마커 생성 및 지도에 표시
    marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(mapY, mapX),
        map: map
    });

    // 지도의 중심을 새로운 위치로 설정
    map.setCenter(new naver.maps.LatLng(mapY, mapX));
}

const seeAll = (data, query, page) => {
    const TOTAL_COUNT = 4016;
    const NUM_OF_ROWS = 10;
    let pageNo = 1;

    let TOTAL_PAGE = Math.ceil(TOTAL_COUNT / NUM_OF_ROWS);


    // <numOfRows>10</numOfRows>
    // <pageNo>1</pageNo>
    // <totalCount>4016</totalCount>

    //page : ==>현재 보여줄 페이지 번호
    //query : ==> 검색에
    //data  : 총게시글수(total), 페이지당 보여줄 목록개수(display)
    let { total } = data;
    //검색 결과 200개 초과하면 200개로 제한두자

    console.log(page, start);

    if (total > 200) {
        total = 200;
    }
    let pageCount = Math.ceil(total / display);
    console.log('pageCount: ', pageCount, 'display: ', display)
    let str = `<ul class="pagination">`;
    for (let i = 1; i <= pageCount; i++) {
        ////////////////////////
        let start = (i - 1) * display + 1;
        ////////////////////////
        if (i == page) {
            str += `<li class="page-item active">`
        } else {
            str += `<li class="page-item">`
        }
        str += `<a class="page-link" href="#" 
                onclick="fetchData('${query}','${start}','${i}')" >${i}</a>
               </li>`
    }//for----
    str += `</ul>`
    document.getElementById('pageNavi').innerHTML = str;
}//showPage()-------------

document.addEventListener('DOMContentLoaded', init);