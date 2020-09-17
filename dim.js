exports.getDIMSearch = (weaponName, roll) => {
    delete roll.name
    delete roll.mod

    let maxStar = Math.max(...[...Object.keys(roll)].map(sec => roll[sec].priority))

    let searchQueries = new Map
    for (i = 0; i < maxStar; i++) {
        let searchQuery = `(${weaponName})`
        let star = 5 - i
        let coverage = star - maxStar + 1
        searchQuery += sectionsToDIM(roll, coverage)
        searchQueries.set(star, searchQuery)
    }

    let combinedQueries = '(' + [...searchQueries.values()].join(') OR (') + ')'
    let invertedCombinedQueries = '(' + weaponName + ') -(' + combinedQueries + ')'
    searchQueries.set('All', combinedQueries.toLowerCase())
    searchQueries.set('Not', invertedCombinedQueries.toLowerCase())

    return searchQueries
}

const sectionsToDIM = (roll, coverage) => {
    let masterwork = []
    fRolls = Object.entries(roll).filter(r => {
        if (r[1].priority <= coverage) {
            if (r[0] === 'masterwork') {
                masterwork = r[1].options
                return false
            }
            return true
        } else {
            return false
        }
    })
    fRolls = fRolls.map(fr => { return fr[1].options })
    fRolls = fRolls.map(s => { return s.map(o => { return o.perkName }) })
    fRolls = fRolls.map(s => {
        return '(' + s.map(p => { return 'perkname:"' + p + '"' }).join(') OR (') + ')'
    })
    if (!!masterwork.length) {
        fRolls.push('(' + masterwork.map(s => { return 'masterwork:' + s.statName.toLowerCase() }).join(') OR (') + ')')
    }
    // console.log(fRolls)
    fRolls = ' (' + fRolls.join(') (') + ')'
    return fRolls
}

exports.getDIMMultiple = (weaponRolls) => {
    let weaponRollSearch = weaponRolls.map(wr => {
        let wrMap = this.getDIMSearch(wr.name, wr.roll)
        return {
            name: wr.name,
            all: wrMap.get('All'),
            not: wrMap.get('Not')
        }
    })
    let multiQueries = new Map
    let combinedQueries = '(' + weaponRollSearch.map(wrs => wrs.all).join(') OR (') + ')'
    let weaponNames = [...new Set(weaponRollSearch.map(wrs => wrs.name))]
    let invertedCombinedQueries = '(' + weaponNames.join(') OR (') + ') -(' + combinedQueries + ')'
    multiQueries.set('All', combinedQueries.toLowerCase())
    multiQueries.set('Not', invertedCombinedQueries.toLowerCase())

    return multiQueries

}
