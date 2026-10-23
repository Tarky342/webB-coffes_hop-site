import { useEffect, useRef } from "react";
import { MAP_CONFIG } from "../lib/config.js";
import { formatAltitude, formatProduction, hasProductionData } from "../lib/origins.js";
import { CountryFlag } from "./CountryFlag.jsx";

export function OriginDetailsModal({ origin, onClose }) {
  const closeButton = useRef(null);

  useEffect(() => {
    closeButton.current?.focus();
    const onKeyDown = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="origin-title">
        <button ref={closeButton} className="icon-button" onClick={onClose} aria-label="詳細を閉じる">×</button>
        <p className="eyebrow">{origin.nameEn || origin.id}</p>
        <h2 id="origin-title" className="country-heading">
          <CountryFlag countryId={origin.id} countryName={origin.name} />
          <span>{origin.name}</span>
        </h2>
        <p className="modal-overview">{origin.overview || "この産地の概要は準備中です。"}</p>
        <div className="detail-grid">
          <div><span>地域</span><strong>{origin.region || "情報がないようです :("}</strong></div>
          {/* <div><span>標高</span><strong>{formatAltitude(origin.growingConditions)}</strong></div> */}
        </div>
        <div className="production-detail">
          <span>生豆生産量</span>
          <strong>{formatProduction(origin, MAP_CONFIG.production)}</strong>
          {hasProductionData(origin) && (
            <small>
              出典: <a href={MAP_CONFIG.production.sourceUrl} target="_blank" rel="noreferrer">FAOSTAT / Invokely</a>
            </small>
          )}
        </div>
        {origin.flavorNotes?.length > 0 && (
          <div className="tag-list" aria-label="フレーバーノート">
            {origin.flavorNotes.map((note) => <span key={note}>{note}</span>)}
          </div>
        )}
        <p className="modal-source">学習用データ: {origin.dataStatus || "参考資料に基づく学習用データ"}</p>
        <button className="primary-button" onClick={onClose}>地図に戻る</button>
      </section>
    </div>
  );
}
