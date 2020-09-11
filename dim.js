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
    let invertedCombinedQueries = '(' + weaponName + ') NOT (' + combinedQueries + ')'
    searchQueries.set('All',combinedQueries)
    searchQueries.set('Not',invertedCombinedQueries)

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
    fRolls = fRolls.map(fr => {return fr[1].options})
    fRolls = fRolls.map(s => { return s.map(o => { return o.perkName }) })
    fRolls = fRolls.map(s => {
        return '(' + s.map(p => { return 'perkname:"' + p + '"' }).join(') OR (') + ')'
    })
    if (!!masterwork.length) {
        fRolls.push('(' + masterwork.map(s=>{return 'masterwork:' +  s.statName.toLowerCase()}).join(') OR (')  + ')')
    }
    // console.log(fRolls)
    fRolls = ' AND (' + fRolls.join(') AND (') + ')'
    return fRolls
}


// console.clear()
// console.log('--------------------------------------------')
// console.log(this.getDIMSearch("Erentil FR4", roll))