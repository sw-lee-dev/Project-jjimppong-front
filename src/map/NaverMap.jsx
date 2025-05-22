/* global naver */
import { useEffect, useState } from "react";
import regionCodes from "./regionCodes.json";
import "./NaverMap.css";
import { useNavigate } from "react-router";
import { BOARD_ABSOLUTE_PATH } from "src/constants";
import { useLocation } from "react-router-dom";

function NaverMap() {
  const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const location = useLocation(); 
  const query = new URLSearchParams(location.search); 
  const addressCategoryParam = query.get("addressCategory");

  const handlerCheckButtonClick = (areaCode, sigunguCode) => {
    navigate(`${BOARD_ABSOLUTE_PATH}?addressCategory1=${areaCode}&addressCategory2=${sigunguCode}&detailCategory=`);
  }

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  };
  
  const REGION_PREFIX_REGEX = /^(서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주특별자치도)\s*/;

  const normalizeName = (name) =>
    name.replace(REGION_PREFIX_REGEX, "")
        .replace(/\s/g, "")
        .replace(/시|군|구/g, "")
        .trim();

        //TODO: 축제 API 인증 후 출력 원할 시 활성화
  // const token = 'token 발급받은 토큰';
  // localStorage.setItem('authToken', token);

        const fetchFestivals = async (areaCode, sigunguCode) => {
          try {
            // 내컴퓨터로 확인할때 URL
            // const res = await fetch(`http://localhost:4000/api/festivals?areaCode=${areaCode}&sigunguCode=${sigunguCode}`
            // 배포용
            const res = await fetch(`${API_DOMAIN}/api/festivals?areaCode=${areaCode}&sigunguCode=${sigunguCode}`
            //TODO: 축제 API 인증 후 출력 원할 시 활성화
            //   , {
            //   headers: { 'Authorization': `Bearer ${token}` },
            // }
          );
            if (!res.ok) throw new Error("축제 데이터 가져오기 실패");
            const data = await res.json();
            return Array.isArray(data) ? data : [];
          } catch (err) {
            console.error(err);
            return [];
          }
        };

  const fetchPopups = async (admSectCode) => {
    const res = await fetch(`${API_DOMAIN}/popup-stores?region=${admSectCode}`);
    return await res.json();
  };

  const fetchRestaurants = async (admSectCode) => {
    const res = await fetch(`${API_DOMAIN}/restaurants?region=${admSectCode}`);
    return await res.json();
  };


  const handlePolygonClick = async (feature) => {
    const name = feature.properties.SGG_NM;
    const admSectCode = feature.properties.ADM_SECT_C;
    const cleanName = normalizeName(name);

    setSelectedRegion(name);

    let region = regionCodes.find((r) => r.ADM_SECT_C === admSectCode)
      || regionCodes.find((r) => normalizeName(r.regionName) === cleanName)
      || regionCodes.find((r) => normalizeName(r.regionName).includes(cleanName) || cleanName.includes(normalizeName(r.regionName)));

    if (!region) {
      setRegionData({ festivals: [], popups: [], restaurants: [] });
      return;
    }

    const [festivals, popups, restaurants] = await Promise.all([
      fetchFestivals(region.areaCode, region.sigunguCode),
      fetchPopups(admSectCode),
      fetchRestaurants(admSectCode)
    ]);

    const filteredFestivals = festivals.filter(f =>
      f.address?.includes(cleanName) || f.address?.includes(name)
    );

    setRegionData({ festivals: filteredFestivals, popups, restaurants });
    return region;
  };


  useEffect(() => {
    if (!window.naver || !window.naver.maps) return;

    const map = new naver.maps.Map("map", {
      center: new naver.maps.LatLng(35.1796, 129.0756),
      zoom: 10,
      minZoom: 7,
      maxZoom: 14,
      maxBounds: new naver.maps.LatLngBounds(
        new naver.maps.LatLng(33.0, 124.5),
        new naver.maps.LatLng(39.5, 132.0)
      ),
    });


    // 마우스 오버시 지역명 출력
    const regionLabel = new naver.maps.InfoWindow({
      content: "",
      disableAnchor: true,
      backgroundColor: "#333",
      borderColor: "#333",
      borderWidth: 0,
      anchorSkew: true,
      pixelOffset: new naver.maps.Point(0, -10),
      zIndex: 999,
    });


    fetch("/data/korea-sgg.geojson")
      .then((res) => res.json())
      .then((data) => {
        data.features.forEach((feature) => {
          const coords = feature.geometry.coordinates;
          const paths = feature.geometry.type === "Polygon"
            ? coords.map(ring => ring.map(([lng, lat]) => new naver.maps.LatLng(lat, lng)))
            : coords.flat().map(ring => ring.map(([lng, lat]) => new naver.maps.LatLng(lat, lng)));

          const polygon = new naver.maps.Polygon({
            map,
            paths,
            clickable: true,
            strokeColor: "#fff",
            strokeWeight: 1,
            fillColor: "#b4e2d5",
            fillOpacity: 0.4,
          });
          

          

          function setRegionLabelContent(regionName, withButton = false) {
            let content = `
              <div style="
              backgroundColor: rgba(51,51,51,0.85);
              color: #fff;
              padding: 8px 12px;
              border-radius: 8px;
              font-size: 14px;
              text-align: center;
              "> ${regionName}
            `;

            if (withButton) {
              content += `
                <div style="margin-top: 6px">
                  <button id="navigate-button"
                    style="
                      background: #fca5a5;
                      border: none;
                      border-radius: 4px;
                      padding: 6px 12px;
                      color: #fff;
                      cursor: pointer;
                    ">${regionName} 게시물</button>
                    </div>
              `;
            }
            content += `</div>`
            return content;
          }

           // 게시글 위치 버튼 클릭 시 param으로 넘겨진 게시글의 주소 카테고리와 동일한 코드를 가진 지역의 폴리곤을 클릭한 채로 map 렌더링
          if (feature.properties.ADM_SECT_C === addressCategoryParam) {
            // 강제로 polygon 클릭과 같은 동작 수행
            handlePolygonClick(feature).then((region) => {
              const bounds = polygon.getBounds();
              const center = bounds.getCenter();

              regionLabel.setPosition(center);
              regionLabel.open(map);
              map.setCenter(center);
              map.setZoom(10); 
            });
          }

          naver.maps.Event.addListener(polygon, "mouseover", () => {
            polygon.setOptions({ fillColor: "#fca5a5", fillOpacity: 0.6 });
            const bounds = polygon.getBounds();
            const center = bounds.getCenter();
            regionLabel.setContent(setRegionLabelContent(feature.properties.SGG_NM));
            regionLabel.setPosition(center);
            regionLabel.open(map);
          });

          naver.maps.Event.addListener(polygon, "mouseout", () => {
            polygon.setOptions({ fillColor: "#b4e2d5", fillOpacity: 0.4 });
            //regionLabel.close();
          });

          naver.maps.Event.addListener(polygon, "click", () => {
            handlePolygonClick(feature).then((region) => {
              regionLabel.setContent(setRegionLabelContent(feature.properties.SGG_NM, true));

              setTimeout(() => {
                const btn = document.getElementById("navigate-button");
                if (btn && region) {
                  btn.onclick = () => handlerCheckButtonClick(region.areaCode, region.sigunguCode);
                }
              }, 0);
            });
          });
        });
      });
  }, []);

  return (
    <div className="map-container">
      <div id="map" className="map" />

      <div className="panel">
        {selectedRegion && regionData ? (
          <>
            <div className="card">
              <button className="action-button" onClick={handlerCheckButtonClick}>
                📍 Check! 여기 가봤어?
              </button>
            </div>

            <div className="card">
              <button className="action-button" onClick={() => window.open("https://map.naver.com/v5/direction", "_blank")}>
                🗺 길찾기
              </button>
            </div>

            <h2 className="title">{selectedRegion} 지역 정보</h2>

            <InfoCard title="🎉 지역 행사" data={regionData.festivals} type="festival" formatDate={formatDate} />
            <InfoCard title="🛍 팝업스토어" data={regionData.popups} type="popup" />
            <InfoCard title="🍽 맛집" data={regionData.restaurants} type="restaurant" />

            <button onClick={() => setSelectedRegion(null)} className="close-button">닫기</button>
          </>
        ) : (
          <p style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>지역정보는 지도를 눌러보세요.</p>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, data, type, formatDate }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <ul className="list">
        {data.length > 0 ? (
          data.map((item, i) => (
            <li key={i}>
              <p>{item.title || item.popupTitle || item.restaurantTitle}</p>
              {type === "festival" && (
                <>
                  <p>{formatDate(item.startDate)} ~ {formatDate(item.endDate)}</p>
                  {item.image && <img src={item.image} alt={item.title} style={{ width: "100px" }} />}
                  <p>{item.address}</p>
                </>
              )}
              {type === "popup" && (
                <>
                  <p>{item.region}</p>
                  <p>{item.popupDate}</p>
                  {item.popupImage && <img src={item.popupImage} alt={item.popupTitle} style={{ width: "100px" }} />}
                </>
              )}
              {type === "restaurant" && (
                <>
                  <p>{item.region}</p>
                  <p>{item.restaurantAddress}</p>
                </>
              )}
            </li>
          ))
        ) : (
          <li className="text-gray-500">등록된 데이터가 없습니다.</li>
        )}
      </ul>
    </div>
  );
}

export default NaverMap;