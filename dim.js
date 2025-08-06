exports.getDIMSearch = (weaponName, originalRoll, comments = true) => {
    const roll = { ...originalRoll }
    const rollName = roll.name
    delete roll.name
    delete roll.mod
    delete roll.origin
    delete roll.status

    let maxPriority = Math.max(...[...Object.keys(roll)].map(sec => roll[sec].priority))

    let lowestQuery = ''

    let searchQueries = new Map()
    for (i = 0; i < maxPriority; i++) {
        let star = 5 - i
        let searchComment = `/* ${weaponName} - ${rollName} - ${'⭐'.repeat(star)} */ `
        let searchQuery = `(exactname:"${weaponName.toLowerCase()}")`
        let coverage = Math.max(1, star - 5 + maxPriority)
        searchQuery += sectionsToDIM(roll, coverage).toLowerCase()
        searchQueries.set(star, comments ? searchComment + searchQuery : searchQuery)
        lowestQuery = searchQuery
    }

    // let combinedQueries = '(' + [...searchQueries.values()].join(') OR (') + ')'

    let invertedCombinedQueries = '(exactname:"' + weaponName.toLowerCase() + '") -(' + lowestQuery + ')'

    searchQueries.set('ANY', comments ? `/* ${weaponName} - ${rollName} - ANY */ ` + lowestQuery : lowestQuery)
    searchQueries.set('NONE', comments ? `/* ${weaponName} - ${rollName} - NONE */ ` + invertedCombinedQueries : invertedCombinedQueries)

    return searchQueries
}

const sectionsToDIM = (roll, coverage) => {
    //Check if the roll should be included in the stars coverage
    let fRolls = Object.entries(roll).filter(r => { return r[1].priority <= coverage })

    fRolls = fRolls.map(fr => {
        let keyName = 'traitName'
        let queryName = 'exactperk'
        switch (fr[0]) {
            case 'masterwork':
                keyName = 'statName'
                queryName = 'masterwork'
                break;
            case 'frames':
                keyName = 'frameName'
                break;
            case 'tier':
                keyName = 'tierValue'
                queryName = 'tier'
                break;
            default:
                break;
        }
        return [queryName, fr[1].options.map(o => { return o[keyName] })]
    })

    fRolls = fRolls.map(row => {
        const queryName = row[0]
        const namesArray = row[1]
        
        // Special handling for tier queries
        if (queryName === 'tier') {
            return namesArray
                .map(n => {
                    return queryName + ':>=' + n
                })
                .join(' OR ')
        }
        
        return (
            '(' +
            namesArray
                .map(n => {
                    const name = (queryName === 'masterwork' ? n.replace(/\s/g, '') : n).toLowerCase()
                    return queryName + ':"' + name + '"'
                })
                .join(') OR (') +
            ')'
        )
    })
    fRolls = ' (' + fRolls.join(') (') + ')'
    return fRolls
}

exports.getDIMMultiple = (weaponRolls) => {
    let weaponRollSearch = weaponRolls.map(wr => {
        let wrMap = this.getDIMSearch(wr.name, wr.roll, false)
        return {
            name: wr.name,
            all: wrMap.get('ANY'),
            not: wrMap.get('NONE')
        }
    })
    let multiQueries = new Map()
    let combinedQueries = '(' + weaponRollSearch.map(wrs => wrs.all).join(') OR (') + ')'
    let weaponNames = [...new Set(weaponRollSearch.map(wrs => `exactname:"${wrs.name.toLowerCase()}"`))]
    let invertedCombinedQueries = '(' + weaponNames.join(') OR (') + ') -(' + combinedQueries + ')'
    multiQueries.set('ANY', combinedQueries)
    multiQueries.set('NONE', invertedCombinedQueries)

    return multiQueries

}

exports.getWeaponNamesQuery = (weaponNamesArray) => {
    return '( (' + weaponNamesArray.map(wrs => `exactname:"${wrs.toLowerCase()}"`).join(') OR (') + ') )'
}
