exports.getDIMSearch = (weaponName, roll) => {
    delete roll.name
    delete roll.mod

    let maxPriority = Math.max(...[...Object.keys(roll)].map(sec => roll[sec].priority))

    let searchQueries = new Map
    for (i = 0; i < maxPriority; i++) {
        let searchQuery = `(${weaponName.toUpperCase()})`
        let star = 5 - i
        let coverage = Math.max(1, star - 5 + maxPriority)
        searchQuery += sectionsToDIM(roll, coverage).toLowerCase()
        searchQueries.set(star, searchQuery)
    }

    let combinedQueries = '(' + [...searchQueries.values()].join(') OR (') + ')'
    let invertedCombinedQueries = '(' + weaponName.toUpperCase() + ') -(' + combinedQueries + ')'
    searchQueries.set('ALL', combinedQueries)
    searchQueries.set('NOT', invertedCombinedQueries)

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
    fRolls = fRolls.map(s => { return s.map(o => { return o.traitName }) })
    fRolls = fRolls.map(s => {
        return '(' + s.map(p => { return 'perkname:"' + p.toLowerCase() + '"' }).join(') OR (') + ')'
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
            all: wrMap.get('ALL'),
            not: wrMap.get('NOT')
        }
    })
    let multiQueries = new Map
    let combinedQueries = '(' + weaponRollSearch.map(wrs => wrs.all).join(') OR (') + ')'
    let weaponNames = [...new Set(weaponRollSearch.map(wrs => wrs.name.toUpperCase()))]
    let invertedCombinedQueries = '(' + weaponNames.join(') OR (') + ') -(' + combinedQueries + ')'
    multiQueries.set('ALL', combinedQueries)
    multiQueries.set('NOT', invertedCombinedQueries)

    return multiQueries

}
