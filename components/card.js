import { Card, Image, CardContent } from 'semantic-ui-react'
import { pathToFileURL } from 'url'
import path from 'path'

export default function CharCard({character, charactersList}) {
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
            <CardContent>
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

            <div className="collection-char-name">
                {character.nameKey}
        {/* <p>${character.gp}<p> */}
            </div>
            </CardContent>
        </div>
        </Card>
    )
}
