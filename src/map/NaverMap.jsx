/* global naver */
import { useEffect, useState } from "react";
import regionCodes from "./regionCodes.json";
import "./NaverMap.css";

function NaverMap() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [regionData, setRegionData] = useState(null);
  const [showCheck, setShowCheck] = useState(false);

  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJxd2VyMTIzNCIsImlhdCI6MTc0NTg4NDY2MSwiZXhwIjoxNzQ1OTE3MDYxfQ.HW4Z3P3ZTzaNHcL9Cl9Sn1RLvs_Vz71n8_i2K7JKfQc';
  localStorage.setItem('authToken', token);

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return dateStr;
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
  };

  const normalizeName = (name) =>
    name.replace(/^(서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시|경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주특별자치도)\s*/, "")
        .replace(/\s/g, "")
        .replace(/시|군|구/g, "")
        .trim();

  const fetchFestivals = async (areaCode, sigunguCode) => {
    try {
      const res = await fetch(`http://localhost:4000/api/festivals?areaCode=${areaCode}&sigunguCode=${sigunguCode}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("축제 데이터 가져오기 실패");
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchPopups = async (admSectCode) => {
    const res = await fetch(`http://localhost:4000/popup-stores?region=${admSectCode}`);
    return await res.json();
  };

  const fetchRestaurants = async (admSectCode) => {
    const res = await fetch(`http://localhost:4000/restaurants?region=${admSectCode}`);
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

          naver.maps.Event.addListener(polygon, "mouseover", () => {
            polygon.setOptions({ fillColor: "#fca5a5", fillOpacity: 0.6 });

            // 마우스 오버시 지역명 출력
            const bounds = polygon.getBounds();
            const center = bounds.getCenter();
            regionLabel.setContent(
              `<div style="
                background: rgba(51,51,51, 0.85);
                color: #fff;
                padding: 4px 10px;
                border-radius: 6px;
                font-size: 14px
                ">${feature.properties.SGG_NM}</div>`
            );
            regionLabel.setPosition(center);
            regionLabel.open(map);
          });

          naver.maps.Event.addListener(polygon, "mouseout", () => {
            polygon.setOptions({ fillColor: "#b4e2d5", fillOpacity: 0.4 });
            regionLabel.close();
          });

          naver.maps.Event.addListener(polygon, "click", () => handlePolygonClick(feature));
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
              <button className="toggle-header" onClick={() => setShowCheck(!showCheck)}>
                📍 Check! 여기 가봤어? <span>{showCheck ? "▲" : "▼"}</span>
              </button>
              {showCheck && (
                <button className="action-button">게시글 보러가기</button>
              )}
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
