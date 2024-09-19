//일단 url로 요청을 보내서 제이슨 데이터를 가져오고
//그결과를 innerHtml에 뿌려주기

const tbody = document.querySelector('#result');
const cardbox = document.querySelector('.cardbox');
const resultbox = document.querySelector('.resultbox');
const infoUI = document.querySelector(".cardbox.result");

//키값이 포함된 url --> 불러오는 갯수 5개 세팅함
const url = 'https://apis.data.go.kr/B551011/GoCamping/basedList?numOfRows=100&pageNo=1&MobileOS=AND&MobileApp=test&serviceKey=YssH2yHSdTKhkaaYIJFFKZEP%2BkykGa%2Bgb10wi4F5hZ%2BaTmuQvsdhy3uhSaRFNpvoaEG%2FVZvBmhaHJao7zf7gvA%3D%3D&_type=json';
const urlSearch = 'https://apis.data.go.kr/B551011/GoCamping/searchList?numOfRows=5&pageNo=1&MobileOS=ETC&MobileApp=test&serviceKey=YssH2yHSdTKhkaaYIJFFKZEP%2BkykGa%2Bgb10wi4F5hZ%2BaTmuQvsdhy3uhSaRFNpvoaEG%2FVZvBmhaHJao7zf7gvA%3D%3D&_type=json';
const apiKey = 'YssH2yHSdTKhkaaYIJFFKZEP+kykGa+gb10wi4F5hZ+aTmuQvsdhy3uhSaRFNpvoaEG/VZvBmhaHJao7zf7gvA==';

const urlsearch = 'https://apis.data.go.kr/B551011/GoCamping/searchList?numOfRows=5&pageNo=1&MobileOS=ETC&MobileApp=test&serviceKey=YssH2yHSdTKhkaaYIJFFKZEP%2BkykGa%2Bgb10wi4F5hZ%2BaTmuQvsdhy3uhSaRFNpvoaEG%2FVZvBmhaHJao7zf7gvA%3D%3D&_type=json&keyword=%ED%8C%8C%ED%81%AC%ED%82%B9';


//생성된 마커들을 저장할 배열
const markers = [];

//생성된 정보창들을 저장할 배열
const infos = [];

var map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 8
});

//처음 시작시 전체 목록 조회
window.onload = function () {
    fetch(url)
        .then((response) => {
            // alert(response.ok)
            if (!response.ok) throw new Error('요청이 잘못되었거나 네트워크 문제');
            return response.json(); //JSON.parse(xhr.responseText)
        })
        .then((data) => {
            // let itemArray = data.response.body.items.item;
            renderUI(data);

            //좌표를찍어주는 함수
            setPosition(data);
        })
        .catch((error) => {
            alert(error);
        })

}



//검색키워드로 버튼글릭시 ajax로 불러와서 다시 렌더링
const searchBtn = document.querySelector('#searchBtn');
searchBtn.addEventListener('click', () => {

    event.preventDefault();

    let keyword = search.keyword.value;
    let encoded = encodeURIComponent(keyword);


    let newUrl = urlSearch + `&keyword=${encoded}`;
    console.log(newUrl);
    fetch(newUrl)
        .then((response) => {
            console.log(response);

            // alert(response.ok)
            if (!response.ok) throw new Error('요청이 잘못되었거나 네트워크 문제');
            return response.json(); //JSON.parse(xhr.responseText)
        })
        .then((data) => {
            // let itemArray = data.response.body.items.item;
            renderUI(data);
            setPosition(data);
        })
        .catch((error) => {
            alert(error);
        })

})

//마커찍기
const setPosition = (data) => {
    //넘겨진 데이터로 일단 여러 정보는 넘어온다. 
    //거기서 그냥 mapX값과 mapY값을 빼와서 쓰면된다.
    console.log(data);

    let itemArray = data.response.body.items.item;

    console.log(itemArray[0].mapX); //두번째로 넣어주면됨
    console.log(itemArray[0].mapY); //네이버 api 여기값을 먼저 넣어주고

    if (markers.length > 0) {
        //기존에 있던 마크지워주기
        clearMarkers();
        //기본에 있던 정보창 지워주기
        clearInfo();
    }

    //넘겨준 제이슨의 갯수만큼 마커를 생성하기
    itemArray.forEach(element => {

        let data = {};

        const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(element.mapY, element.mapX),
            map: map
        });

        data.facltNm = element.facltNm;

        //렌더링 해줄 코드
        var contentString = [`
            <div class="iw_inner infobox">
            <div>
            
            <img src="${element.firstImageUrl}" width="55" height="55" alt="캠핑장 이미지" class="thumb" />
            <div class=infotext>
            <h2>${element.facltNm}</h2>
            <p>${element.addr1}</p>
            <button type="click" class="lookinfo" onclick="goInfo('${element.facltNm}')">상세보기</button>
            </div>
              
            </div>`
        ].join('');

        //정보창 인스턴스 생성
        var infowindow = new naver.maps.InfoWindow({
            content: contentString,
            borderColor: "#2db400",
            borderWidth: 0,

            anchorSkew: true,
            maxWidth: 0,
            pixelOffset: new naver.maps.Point(20, -20)
        });

        //정보창 클릭이벤트
        naver.maps.Event.addListener(marker, "click", function (e) {
            if (infowindow.getMap()) {
                infowindow.close();
            } else {
                infowindow.open(map, marker);
            }
        });

        //상세보기 버튼 클릭이벤트 //여기다가 넣어주면 닫혀있음 처리되어있기 때문에 전부 null 처리된다.
        // let lookinfoButtons = document.querySelector(".lookinfo");
        // console.log(lookinfoButtons);




        // 정보창을 미리 열어줄껀지 여부
        // infowindow.open(map, marker); //열려있지 않으면 찾지 못한다. //정보창이 열려있으면 찾을수 있다. //어짜피 열리는 정보창은 하나니까 대충해도 상관없을듯 하다.

        //생성된 마커를 추가
        markers.push(marker);

        //생성된 정보창을 추가
        infos.push(infowindow);
    });


}

// 마커 삭제 함수
function clearMarkers() {
    markers.forEach(marker => {
        marker.setMap(null);  // 지도에서 마커 삭제
    });
    markers.length = 0;  // 배열을 초기화
}

// 정보창 삭제 함수
function clearInfo() {
    infos.forEach(info => {
        info.setMap(null);  // 지도에서 마커 삭제
    });
    infos.length = 0;  // 배열을 초기화
}

//레더링 함수는 그대로 두고
const renderUI = (data) => {
    let itemArray = data.response.body.items.item;

    if (itemArray.length == 0) {
        return false;
    }
    // tbody.innerHTML = "";
    cardbox.innerHTML = "";
    let str = "";
    itemArray.forEach(element => {
        str +=
            `
            <div class="card">
                <!-- 이미지 -->
                <div class="imgbox">
                    <img src="${element.firstImageUrl}" alt="캠핑장">
                </div>
                <!-- 텍스트 -->
                <div class="textbox">
                    <p class="title">${element.facltNm}<span class="location">${element.doNm}</span></p>
                    <p class="address"> ${element.addr1}</p>
                    <p class="etc">Tel) ${element.tel} <a class="link" href="${element.homepage}">홈페이지</a></p>
                </div>
            </div>
            `
    });
    cardbox.innerHTML = str;

    //반복문
    // itemArray.forEach(element => {
    //     str += `
    //     <tr>
    //      <td> <button type="click" class="lookinfo" onclick="goInfo('${element.facltNm}')">상세보기</button></td>
    //         <td>${element.contentId}</td>
    //         <td>${element.facltNm}</td>
    //         <td>${element.featureNm}</td>
    //         <td>${element.induty}</td>
    //         <td>${element.doNm}</td>
    //         <td>${element.addr1}</td>
    //         <td>${element.mapX}</td>
    //         <td>${element.mapY}</td>
    //         <td>${element.tel}</td>
    //         <td>${element.homepage}</td>
    //         <td>${element.firstImageUrl}</td>

    //     </tr>
    //     `;
    // });

    // tbody.innerHTML = str;

}

document.querySelector("#testbtn").addEventListener("click", () => {
    console.log("테스트 버튼 클릭됨");

    let lookinfoButtons = document.querySelector(".lookinfo"); //all일대는 찾아왔는데 , 그냥 셀렉터여도 찾을꺼 같은데? 찾는다.
    console.log(lookinfoButtons);
})

//못찾아옴
// document.querySelector(".lookinfo").addEventListener("click", () => { 
//     let lookinfoButtons = document.querySelector(".lookinfo"); //all일대는 찾아왔는데 , 그냥 셀렉터여도 찾을꺼 같은데? 찾는다.
//     console.log(lookinfoButtons);
// })

//레더링 함수는 그대로 두고
function makeinfoUI(data) {

    infoUI.innerHTML = "";
    let str =
        `
            <div class="card">
                <!-- 이미지 -->
                <div class="imgbox">
                    <img src="${data.firstImageUrl}" alt="캠핑장">
                </div>
                <!-- 텍스트 -->
                <div class="textbox">
                    <p class="title">${data.facltNm}<span class="location">${data.doNm}</span></p>
                    <p class="address"> ${data.addr1}</p>
                    <p class="etc">Tel) ${data.tel} <a class="link" href="${data.homepage}">홈페이지</a></p>
                    <p class="describe">${data.featureNm}</p>
                </div>
            </div>
            `;



    // let str = `
    // <P>${data.contentId}</P>
    // <P>${data.facltNm}</P>
    // <P>${data.featureNm}</P>
    // <P>${data.induty}</P>
    // <P>${data.doNm}</P>
    // <P>${data.addr1}</P>
    // <P>${data.mapX}</P>
    // <P>${data.mapY}</P>
    // <P>${data.tel}</P>
    // <P>${data.homepage}</P>
    // <P>${data.firstImageUrl}</P>
    // `;

    infoUI.innerHTML = str;


}

function goInfo(data) {
    resultbox.classList.add("movetoleft");

    //여기서 좌표값으로 지도 이동시키고 중심 이동시키고 줌땡기기 조절해주기

    //문자열로 넘어온 야영장명 이름을 가지고 다시 키워드 검색 api를 돌려서 응답을 받아오는수밖에..
    console.log(data);

    let keyword = data;
    let encoded = encodeURIComponent(keyword);

    let newUrl = urlSearch + `&keyword=${encoded}`;
    console.log(newUrl);
    fetch(newUrl)
        .then((response) => {
            console.log(response);

            // alert(response.ok)
            if (!response.ok) throw new Error('요청이 잘못되었거나 네트워크 문제');
            return response.json(); //JSON.parse(xhr.responseText)
        })
        .then((data) => {
            // let itemArray = data.response.body.items.item;
            console.log(data);
            //넘어오긴 하는데 같은이름을 가지거나 ==> 이럼 못잡음, 이름을 포함하고 잇으면 다른 가게가 있으면 여러개의 정보가 들어오게 될것이다. 
            //해당 처리는 나중으로 미룬다.

            let itemArray = data.response.body.items.item;
            // console.log("상세페이지 표시" + itemArray[0].facltNm);
            makeinfoUI(itemArray[0]); //데이터가 여러개 들어와도 그냥 가장 처음데이터만 처리한다. 


        })
        .catch((error) => {
            alert(error);
        })



}


function canclebtn() {
    resultbox.classList.remove("movetoleft");
}



