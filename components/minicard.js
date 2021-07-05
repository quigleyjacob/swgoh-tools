
export function MiniCharCard({baseId, image, rarity, gear, relicTier, alignment}) {

  let relicContent = relicTier > 0 ? <div className="char-portrait-full-relic">{relicTier}</div> : ""

  return (
    <div style={{'margin': '0 auto'}} className={`player-char-portrait char-portrait-full char-portrait-full-micro char-portrait-full-gear-t${gear} char-portrait-full-alignment-${alignment}-side`}>
    <img className="char-portrait-full-img" src={`data:image/png;base64,${image}`} alt={baseId}/>
    <div className="char-portrait-full-gear"></div>
    <div className={`star star1 ${rarity < 1 ? "star-inactive": ""}`}></div>
    <div className={`star star2 ${rarity < 2 ? "star-inactive": ""}`}></div>
    <div className={`star star3 ${rarity < 3 ? "star-inactive": ""}`}></div>
    <div className={`star star4 ${rarity < 4 ? "star-inactive": ""}`}></div>
    <div className={`star star5 ${rarity < 5 ? "star-inactive": ""}`}></div>
    <div className={`star star6 ${rarity < 6 ? "star-inactive": ""}`}></div>
    <div className={`star star7 ${rarity < 7 ? "star-inactive": ""}`}></div>
    {relicContent}

    </div>
  )
}
