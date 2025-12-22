exports.getDIMSearch = (weaponName, originalRoll, comments = true) => {
    const roll = { ...originalRoll }
    const rollName = roll.name
    const strictTraits = roll.strictTraits || false
    delete roll.name
    delete roll.mod
    delete roll.origin
    delete roll.status
    delete roll.strictTraits

    // Extract virtual section priorities before calculating maxPriority
    const secondaryTraitsPriority = roll.secondaryTraits?.priority || null
    delete roll.secondaryTraits
    delete roll.bonusTraits
    
    // Infer hasBonusTraits from trait options (order >= 3)
    const hasBonusTraits = strictTraits && ['trait1', 'trait2'].some(traitKey => 
        roll[traitKey]?.options?.some(opt => (opt.order || 1) >= 3)
    )

    // Calculate maxPriority - include secondaryTraitsPriority if set (virtual but affects star range)
    let maxPriority = Math.max(
        ...[...Object.keys(roll)].map(sec => roll[sec].priority),
        secondaryTraitsPriority || 0
    )

    let lowestQuery = ''
    let highestQuery = ''

    // Collect star queries in order
    const starQueries = []
    for (let i = 0; i < maxPriority; i++) {
        let star = 5 - i
        let searchComment = `/* ${weaponName} - ${rollName} - ${'⭐'.repeat(star)} */ `
        let searchQuery = `(name:"${weaponName.toLowerCase()}")`
        let coverage = Math.max(0, star - 5 + maxPriority)
        
        if (strictTraits) {
            searchQuery += strictSectionsToDIM(roll, coverage, secondaryTraitsPriority, false).toLowerCase()
        } else {
            searchQuery += sectionsToDIM(roll, coverage).toLowerCase()
        }
        
        starQueries.push([star, comments ? searchComment + searchQuery : searchQuery])
        if (i === 0) highestQuery = searchQuery
        lowestQuery = searchQuery
    }

    // Build final map with desired order: 5+ first (if exists), then stars descending, then ANY/NONE
    let searchQueries = new Map()
    
    // Generate 5★+ query first if strictTraits and has bonus traits (order 3+)
    if (strictTraits && hasBonusTraits) {
        let bonusQuery = `(name:"${weaponName.toLowerCase()}")`
        bonusQuery += strictSectionsToDIM(roll, maxPriority, secondaryTraitsPriority, true).toLowerCase()
        searchQueries.set(5n, comments ? `/* ${weaponName} - ${rollName} - ⭐⭐⭐⭐⭐+ */ ` + bonusQuery : bonusQuery)
    }
    
    // Add star queries
    starQueries.forEach(([star, query]) => {
        searchQueries.set(star, query)
    })

    let invertedCombinedQueries = '(name:"' + weaponName.toLowerCase() + '") -(' + lowestQuery + ')'

    searchQueries.set('ANY', comments ? `/* ${weaponName} - ${rollName} - ANY */ ` + lowestQuery : lowestQuery)
    searchQueries.set('NONE', comments ? `/* ${weaponName} - ${rollName} - NONE */ ` + invertedCombinedQueries : invertedCombinedQueries)

    return searchQueries
}

/**
 * Handle strict trait rolls:
 * - Main traits (order 1): OR within column, AND between columns
 * - Secondary traits (order 2): Combined from all columns into one OR group
 * - Bonus traits (order 3+): Combined from all columns into one OR group
 */
const strictSectionsToDIM = (roll, coverage, secondaryTraitsPriority, includeBonusTraits) => {
    const queryParts = []
    
    // Collect trait sections for special handling
    const traitSections = ['trait1', 'trait2']
    const mainTraitsByColumn = {}  // Grouped by column, OR within, AND between
    const secondaryTraits = []     // Combined into one OR group
    const bonusTraits = []         // Combined into one OR group
    
    // Process all sections
    Object.entries(roll).forEach(([sectionName, sectionData]) => {
        // Skip sections not in coverage
        if (sectionData.priority > coverage) return
        
        // Special handling for trait sections in strict mode
        if (traitSections.includes(sectionName)) {
            sectionData.options.forEach(opt => {
                const order = opt.order || 1
                const traitName = opt.traitName
                
                if (order === 1) {
                    // Main traits - group by column
                    if (!mainTraitsByColumn[sectionName]) {
                        mainTraitsByColumn[sectionName] = []
                    }
                    mainTraitsByColumn[sectionName].push(traitName)
                } else if (order === 2) {
                    // Secondary traits - collected for combined OR
                    secondaryTraits.push(traitName)
                } else {
                    // Bonus traits (order 3+) - collected for combined OR
                    bonusTraits.push(traitName)
                }
            })
            return
        }
        
        // Handle other sections normally
        const queryPart = sectionToQuery(sectionName, sectionData)
        if (queryPart) queryParts.push(queryPart)
    })
    
    // Add main traits: OR within each column, AND between columns
    Object.values(mainTraitsByColumn).forEach(columnTraits => {
        if (columnTraits.length === 1) {
            queryParts.push(`(exactperk:"${columnTraits[0].toLowerCase()}")`)
        } else if (columnTraits.length > 1) {
            const columnQuery = '(' + columnTraits.map(t => `exactperk:"${t.toLowerCase()}"`).join(') OR (') + ')'
            queryParts.push(columnQuery)
        }
    })
    
    // Add secondary traits as combined OR group (if coverage >= secondaryTraitsPriority)
    if (secondaryTraitsPriority !== null && coverage >= secondaryTraitsPriority && secondaryTraits.length > 0) {
        const secondaryQuery = '(' + secondaryTraits.map(t => `exactperk:"${t.toLowerCase()}"`).join(') OR (') + ')'
        queryParts.push(secondaryQuery)
    }
    
    // Add bonus traits as combined OR group (only for 5★+)
    if (includeBonusTraits && bonusTraits.length > 0) {
        const bonusQuery = '(' + bonusTraits.map(t => `exactperk:"${t.toLowerCase()}"`).join(') OR (') + ')'
        queryParts.push(bonusQuery)
    }
    
    if (queryParts.length === 0) return ''
    return ' (' + queryParts.join(') (') + ')'
}

/**
 * Convert a single section to a DIM query part
 */
const sectionToQuery = (sectionName, sectionData) => {
    let keyName = 'traitName'
    let queryName = 'exactperk'
    
    switch (sectionName) {
        case 'masterwork':
            keyName = 'statName'
            queryName = 'masterwork'
            break
        case 'frames':
            keyName = 'frameName'
            break
        case 'tier':
            return `tier:>=${sectionData.tierValue}`
        default:
            break
    }
    
    const options = sectionData.options
    if (!options || options.length === 0) return null
    
    const namesArray = options.map(o => o[keyName])
    
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
}

/**
 * Original sectionsToDIM for non-strict rolls
 */
const sectionsToDIM = (roll, coverage) => {
    //Check if the roll should be included in the stars coverage
    let fRolls = Object.entries(roll).filter(r => { return r[1].priority <= coverage })

    fRolls = fRolls.map(fr => {
        const sectionName = fr[0]
        const sectionData = fr[1]
        let keyName = 'traitName'
        let queryName = 'exactperk'

        switch (sectionName) {
            case 'masterwork':
                keyName = 'statName'
                queryName = 'masterwork'
                break;
            case 'frames':
                keyName = 'frameName'
                break;
            case 'tier':
                // Tier uses simplified format with tierValue directly
                return ['tier', [sectionData.tierValue]]
            default:
                break;
        }

        return [queryName, sectionData.options.map(o => { return o[keyName] })]
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

    if (fRolls.length === 0) return ''
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
    let weaponNames = [...new Set(weaponRollSearch.map(wrs => `name:"${wrs.name.toLowerCase()}"`))]
    let invertedCombinedQueries = '(' + weaponNames.join(') OR (') + ') -(' + combinedQueries + ')'
    multiQueries.set('ANY', combinedQueries)
    multiQueries.set('NONE', invertedCombinedQueries)

    return multiQueries
}

exports.getWeaponNamesQuery = (weaponNamesArray) => {
    return '( (' + weaponNamesArray.map(wrs => `name:"${wrs.toLowerCase()}"`).join(') OR (') + ') )'
}
