import { Card, Image, CardContent } from 'semantic-ui-react'
import { pathToFileURL } from 'url'
import path from 'path'

export function ShipCard({ship, shipsList}) {

    return (
        <Card>
        <div class="collection-ship-primary">
        <div class="player-ship-portrait ship-portrait-full">
        <div class="ship-portrait-full-stars">
        <div class={`ship-portrait-full-star ${ship.rarity < 1 ? "ship-portrait-full-star-inactive" : ""}`}></div>
        <div class={`ship-portrait-full-star ${ship.rarity < 2 ? "ship-portrait-full-star-inactive" : ""}`}></div>
        <div class={`ship-portrait-full-star ${ship.rarity < 3 ? "ship-portrait-full-star-inactive" : ""}`}></div>
        <div class={`ship-portrait-full-star ${ship.rarity < 4 ? "ship-portrait-full-star-inactive" : ""}`}></div>
        <div class={`ship-portrait-full-star ${ship.rarity < 5 ? "ship-portrait-full-star-inactive" : ""}`}></div>
        <div class={`ship-portrait-full-star ${ship.rarity < 6 ? "ship-portrait-full-star-inactive" : ""}`}></div>
        <div class={`ship-portrait-full-star ${ship.rarity < 7 ? "ship-portrait-full-star-inactive" : ""}`}></div>
        </div>
        <div class="ship-portrait-full-frame">
        <div class="ship-portrait-full-frame-overlay"></div>
        <div class="ship-portrait-full-frame-image">
        <img class="ship-portrait-full-frame-img" src={`/images/${ship.defId}.png`} alt={`${ship.nameKey}`}/>
        </div>
        <div class="ship-portrait-full-frame-level">{`${ship.level}`}</div>
        </div>
        </div>
        </div>
        </Card>
    )
}

export function CharCard({character, charactersList}) {
    let char = charactersList.filter(obj => obj.baseId === character.defId)[0]
    let alignment = char.categoryIdList.includes("alignment_light") ? "light" : "dark"
    let zetas = character.skills.filter(obj => obj.isZeta && obj.tier == obj.tiers).length
    // console.log(alignment, zetas)

    let zetaDisplay = ""
    if (zetas > 0) {
        zetaDisplay = <div className="char-portrait-full-zeta">{zetas}</div>
    }
    // console.log(character.relic.currentTier)
    let relicDisplay = ""
    if (character.relic.currentTier > 2) {
        relicDisplay = <div class="char-portrait-full-relic">{(character.relic.currentTier-2)}</div>
    }

    return (
        <Card>
        <div className={`collection-char collection-char-${alignment}-side`}>
            <div className={`player-char-portrait char-portrait-full char-portrait-full-gear-t${character.gear} char-portrait-full-alignment-${alignment}-side`}>
                <Image className="char-portrait-full-img loading" src={`/images/${character.defId}.png`} alt={character.nameKey} height="80" width="80" data-was-processed="true" />
                <div className="char-portrait-full-gear"></div>
                <div className={`star star1 ${character.rarity < 1 ? "star-inactive": ""}`}></div>
                <div className={`star star2 ${character.rarity < 2 ? "star-inactive": ""}`}></div>
                <div className={`star star3 ${character.rarity < 3 ? "star-inactive": ""}`}></div>
                <div className={`star star4 ${character.rarity < 4 ? "star-inactive": ""}`}></div>
                <div className={`star star5 ${character.rarity < 5 ? "star-inactive": ""}`}></div>
                <div className={`star star6 ${character.rarity < 6 ? "star-inactive": ""}`}></div>
                <div className={`star star7 ${character.rarity < 7 ? "star-inactive": ""}`}></div>
                {zetaDisplay}
                {relicDisplay}
                <div className="char-portrait-full-level">{character.level}</div>
            </div>

            {/* <div className="collection-char-name">
                {character.nameKey}
            </div> */}
        </div>
        </Card>
    )
}
