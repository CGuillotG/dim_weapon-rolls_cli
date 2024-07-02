const fs = require('fs')
const { prompt } = require('enquirer')
const { join } = require('path')
let currentWeapons = require('./currentWeapons.json')
let wordPool = require('./wordPool.json')
let { masterworks, seasonMap, sections, vendorArmorQuery, vaultArmorQuery } = require('./enums')
let { getDIMSearch, getDIMMultiple, getWeaponNamesQuery } = require('./dim')
let { getAddedRemovedElementsFromArrays } = require('./utils')


//General methods

const writeJson = (fileName, content) => {
    fs.writeFile(join(__dirname, fileName), JSON.stringify(content, null, 4), (err) => {
        if (err) return console.error(err)
    })
}

const sortJson = fileContent => {
    let sortOptions = (roll) => {
        Object.keys(roll).forEach(key => {
            // console.log(typeof roll[key] === 'object' && 'options' in roll[key])
            if (typeof roll[key] === 'object' && 'options' in roll[key]) {
                roll[key].options.sort((oa, ob) => {
                    if (oa.order > ob.order) return 1
                    if (oa.order < ob.order) return -1
                    return 0
                })
            }
        })
    }
    let sortRoll = (ra, rb) => {
        sortOptions(ra)
        sortOptions(rb)
        if (ra.status > rb.status) return 1
        if (rb.status > ra.status) return -1
        if (ra.name > rb.name) return 1
        if (rb.name > ra.name) return -1
        return 0
    }

    fileContent.sort((a, b) => {
        a.rolls.sort(sortRoll)
        //This might be redundant, but I believe in some cases with the sorting algorithm not every element gets to be "a"
        b.rolls.sort(sortRoll)
        if (a.name > b.name) return 1
        if (b.name > a.name) return -1
        return 0
    })
    return fileContent
}

const getWeaponIndexByName = (name) => {
    let weaponIndex
    currentWeapons.find((weapon, index) => {
        weaponIndex = index
        return weapon.name === name
    })
    return weaponIndex
}

const getRollIndexByName = (weaponIndex, rollName) => {
    let rollIndex
    currentWeapons[weaponIndex].rolls.find((roll, index) => {
        rollIndex = index
        return roll.name === rollName
    })
    return rollIndex
}

const newWeapon = (name, season) => {
    currentWeapons.push({ name, season, dateAdded: (new Date()).toUTCString(), rolls: [] })
    writeJson('currentWeapons.json', sortJson(currentWeapons))
}

const newRoll = (weaponIndex, roll) => {
    currentWeapons[weaponIndex].rolls.push(roll)
    writeJson('currentWeapons.json', sortJson(currentWeapons))
    return currentWeapons[weaponIndex]
}


//CLI Methods

const startCLI = async () => {
    console.clear()
    console.log('--------------------------------------------')
    console.log('Greetings Guardian!')
    const firstPrompt = await prompt({
        type: 'select',
        name: 'answer',
        message: 'How can I help you today?',
        choices: ['New Weapon', 'New Roll', 'Get DIM Queries', 'Print Weapon', 'Toggle Status', 'Show All', 'Sort JSON', 'Exit']
    })
    switch (firstPrompt.answer) {
        case 'New Weapon':
            weaponCLI().catch(e => handleError(e))
            break;
        case 'New Roll':
            rollCLI().catch(e => handleError(e))
            break;
        case 'Get DIM Queries':
            getDIMCLI().catch(e => handleError(e))
            break;
        case 'Print Weapon':
            logRollCLI().catch(e => handleError(e))
            break;
        case 'Toggle Status':
            statusCLI().catch(e => handleError(e))
            break;
        case 'Show All':
            showAllCLI().catch(e => handleError(e))
            break;
        case 'Sort JSON':
            sortJSONCLI().catch(e => handleError(e))
            break;
        case 'Exit':
        default:
            process.exit(0)
    }
}

const sortJSONCLI = async () => {
    writeJson('currentWeapons.json', await sortJson(currentWeapons))
    console.log('Weapons JSON sorted')
}

const statusCLI = async () => {
    let rollChoices = []
    let preSelectedRolls = []
    let indexedRolls = []
    let rcIndex = 0

    currentWeapons.filter(cw => { return !!cw.rolls.length }).forEach(cwf => {
        cwf.rolls.forEach(cwfr => {
            if (cwfr.status === 'ENABLED') {
                // preSelectedRolls.push(cwf.name + '  ->  ' + cwfr.name)
                preSelectedRolls.push(rcIndex)
            }
            indexedRolls.push([cwf.name, cwfr.name])
            rollChoices.push({
                'message': cwf.name + '  ->  ' + cwfr.name,
                'name': rcIndex
            })
            rcIndex++
        })
    })

    const weaponRollsStatusPrompt = await prompt({
        type: 'autocomplete',
        limit: 30,
        multiple: true,
        initial: preSelectedRolls,
        footer() { return '---Start typing, or scroll up and down to reveal more choices---'; },
        name: 'weaponRolls',
        message: 'Choose a weapon:',
        choices: rollChoices,
    })

    const { addedElements: addedIndexes, removedElements: removedIndexes } =
        getAddedRemovedElementsFromArrays(preSelectedRolls, weaponRollsStatusPrompt.weaponRolls, rollChoices[0].message)

    console.clear()
    if (!!addedIndexes.length) {
        addedIndexes.forEach(aI => {
            let weaponIndex = getWeaponIndexByName(indexedRolls[aI][0])
            let rollIndex = getRollIndexByName(weaponIndex, indexedRolls[aI][1])
            currentWeapons[weaponIndex].rolls[rollIndex].status = 'ENABLED'
        })
        console.log("ENABLED the following Rolls:")
        console.log(addedIndexes.map(aI => indexedRolls[aI].join('  ->  ')))
        console.log('')
    }

    if (!!removedIndexes.length) {
        removedIndexes.forEach(rI => {
            let weaponIndex = getWeaponIndexByName(indexedRolls[rI][0])
            let rollIndex = getRollIndexByName(weaponIndex, indexedRolls[rI][1])
            currentWeapons[weaponIndex].rolls[rollIndex].status = 'DISABLED'
        })
        console.log("DISABLED the following Rolls:");
        console.log(removedIndexes.map(rI => indexedRolls[rI].join('  ->  ')))
        console.log('')
    }

    if (!!addedIndexes.length || !!removedIndexes.length) {
        writeJson('currentWeapons.json', sortJson(currentWeapons))
    }
}

const getDIMCLI = async () => {
    let rollChoices = []
    let enabledRolls = []
    currentWeapons.filter(cw => { return !!cw.rolls.length }).forEach(cwf => {
        cwf.rolls.forEach(cwfr => {
            rollChoices.push({
                'message': cwf.name + '  ->  ' + cwfr.name,
                'name': [cwf.name, cwfr.name]
            })
            if (cwfr.status === 'ENABLED')
                enabledRolls.push({
                    'message': cwf.name + '  ->  ' + cwfr.name,
                    'name': [cwf.name, cwfr.name]
                })
        })
    })
    const weaponNamesQuery = getWeaponNamesQuery(currentWeapons.map(w => w.name))

    let searchTypeChoices = [{ name: 'Single', message: 'Single Roll (Stars, All, and Not)' },
    { name: 'Multiple', message: 'Multiple Rolls (All and Not)' }]
    if (!!process.env.POWERSHELL_DISTRIBUTION_CHANNEL) {
        searchTypeChoices.push({ name: 'Vendor', message: 'DIM Vendor Rolls' })
        searchTypeChoices.push({ name: 'Junk', message: 'DIM Junk Rolls' })
        searchTypeChoices.push({ name: 'Missing', message: 'DIM Missing Notes' })
        searchTypeChoices.push({ name: 'AllClipboard', message: 'ALL Clipboard Queries' })
    }
    const searchTypePrompt = await prompt({
        type: 'select',
        name: 'type',
        message: 'Which kind of query do you need?',
        choices: searchTypeChoices
    })
    console.log(searchTypePrompt.type)

    const clipboardQuery = (type) => {
        if (type === 'Missing') {
            const missingReviewPrefix = '/* Missing Notes */'
                + ' is:weapon -notes:Pv (-deepsight:harmonizable or (deepsight:harmonizable -tag:infuse)) -tag:archive'
                + ' ( (not:randomroll not:exotic not:crafted) or ( '

            console.log(`Query for Missing Notes copied to clipboard`)
            require('child_process').spawn('clip').stdin.end(missingReviewPrefix + weaponNamesQuery)
        } else {
            let allEnabledWeaponRolls = enabledRolls.map(wr => {
                let weaponIndex = getWeaponIndexByName(wr.name[0])
                let rollIndex = getRollIndexByName(weaponIndex, wr.name[1])
                let roll = currentWeapons[weaponIndex].rolls[rollIndex]
                return {
                    name: wr.name[0],
                    roll: roll
                }
            })
            let DIMEnabledRolls = getDIMMultiple(allEnabledWeaponRolls)
            const util = require('util');
            let weaponQuery = ''
            let armorQuery = ''
            if (type === 'Vendor') {
                // NOT Pattern Unlocked to avoid craftable weapons
                // ARE Random Rolls to ignore ritual and fixed vendor weapons
                weaponQuery = 'is:weapon not:sunset not:patternunlocked is:randomroll ( ('
                    // ARE in any ENABLED weapon rolls
                    + DIMEnabledRolls.get('ALL')
                    // OR
                    + ' ) OR -( '
                    // NOT any weapon in currentWeapons (ENABLED & DISABLED)
                    + weaponNamesQuery + ' ) )'
                armorQuery = vendorArmorQuery
            } else {
                // ARE Pattern Unlocked AND NOT Crafted to delete weapons that can already be crafted
                weaponQuery = 'is:weapon not:sunset -tag:archive ( ( is:patternunlocked not:crafted )'
                    // OR
                    + ' OR ( '
                    // ALL weapons reviewed
                    + weaponNamesQuery
                    // that are also NOT in 
                    + ' -(' + DIMEnabledRolls.get('ALL') + ') ) )'
                armorQuery = vaultArmorQuery
            }
            console.log(`Query for ${type} copied to clipboard`)
            require('child_process').spawn('clip').stdin.end(`/* DIM ${type} */ (${weaponQuery}) OR ( ${armorQuery} )`);
        }
    }

    switch (searchTypePrompt.type) {
        case 'Single':
            const weaponRollPrompt = await prompt({
                type: 'autocomplete',
                limit: 30,
                multiple: false,
                footer() { return '---Start typing, or scroll up and down to reveal more choices---'; },
                name: 'weaponRoll',
                message: 'Choose a weapon:',
                choices: rollChoices
            })
            let weaponIndex = getWeaponIndexByName(weaponRollPrompt.weaponRoll[0])
            let weapon = currentWeapons[weaponIndex]
            let rollIndex = getRollIndexByName(weaponIndex, weaponRollPrompt.weaponRoll[1])
            let roll = currentWeapons[weaponIndex].rolls[rollIndex]
            let print = printRoll(weaponIndex, rollIndex)
            print.DIM = getDIMSearch(weapon.name, roll)
            console.dir(print, { depth: 3, colors: true })
            break;
        case 'Multiple':
            const weaponRollsPrompt = await prompt({
                type: 'autocomplete',
                limit: 30,
                multiple: true,
                footer() { return '---Start typing, or scroll up and down to reveal more choices---'; },
                name: 'weaponRolls',
                message: 'Choose a weapon:',
                choices: rollChoices
            })
            let weaponRolls = weaponRollsPrompt.weaponRolls.map(wr => {
                let weaponIndex = getWeaponIndexByName(wr[0])
                let rollIndex = getRollIndexByName(weaponIndex, wr[1])
                let roll = currentWeapons[weaponIndex].rolls[rollIndex]
                console.dir(printRoll(weaponIndex, rollIndex), { depth: 3, colors: true })
                return {
                    name: wr[0],
                    roll: roll
                }
            })
            console.log(getDIMMultiple(weaponRolls))
            break;
        case 'Vendor':
        case 'Junk':
            clipboardQuery(searchTypePrompt.type)
            break;
        case 'Missing':
            clipboardQuery('Missing')
            break;
        case 'AllClipboard':
            // add time delays to allow clipboard to be copied
            clipboardQuery('Missing')
            await new Promise(resolve => setTimeout(resolve, 1000));
            clipboardQuery('Junk')
            await new Promise(resolve => setTimeout(resolve, 1000));
            clipboardQuery('Vendor')
            break;
        default:
            process.exit(0);
    }
}

const weaponCLI = async () => {
    const weaponPrompt = await prompt({
        type: 'input',
        name: 'weapon',
        message: `What is the weapon's name?`
    })
    if (currentWeapons.some(w => w.name === weaponPrompt.weapon)) {
        const dupeWeaponPrompt = await prompt({
            type: 'toggle',
            name: 'answer',
            enabled: 'Yep',
            disabled: 'Nope',
            message: `That weapon already exists, do you want to add some rolls to it?`
        })
        if (dupeWeaponPrompt.answer) {
            rollCLI(weaponPrompt.weapon)
        } else {
            startCLI()
        }
    } else {
        let seasonChoices = []
        seasonMap.forEach((sMValue, sMKey) => {
            seasonChoices.push({
                'message': `${sMKey} - ${sMValue}`,
                'name': sMKey
            }
            )
        })
        const seasonPrompt = await prompt([
            {
                type: 'select',
                name: 'season',
                message: 'From which season is this gun?',
                choices: seasonChoices.reverse()
            }, {
                type: 'toggle',
                name: 'addRoll',
                enabled: 'Yep',
                disabled: 'Nope',
                message: 'Do you want to add a roll?'
            }
        ])
        let season = seasonMap.get(seasonPrompt.season)
        newWeapon(weaponPrompt.weapon, season)
        if (seasonPrompt.addRoll) {
            rollCLI(weaponPrompt.weapon)
        } else {
            startCLI()
        }
    }
}

const rollCLI = async (weaponName = "") => {
    if (!weaponName) {
        const weaponPrompt = await prompt({
            type: 'autocomplete',
            limit: 30,
            multiple: false,
            footer() { return '---Start typing, or scroll up and down to reveal more choices---'; },
            name: 'name',
            message: 'Which weapon do you want to add rolls to?',
            choices: currentWeapons.map(w => w.name)
        })
        weaponName = weaponPrompt.name
    }

    const rollNamePrompt = await prompt({
        type: 'input',
        name: 'name',
        message: `What is the roll's name?`
    })

    let roll = await prioritizeSectionsCLI(await sectionCLI({ name: rollNamePrompt.name }))

    roll.status = 'ENABLED'

    newRoll(getWeaponIndexByName(weaponName), roll)

    startCLI()
}

const sectionCLI = async (accRoll) => {
    const sectionPrompt = await prompt({
        type: 'autocomplete',
        limit: 30,
        multiple: false,
        footer() { return '---Start typing, or scroll up and down to reveal more choices---'; },
        name: 'section',
        message: 'What section are you adding?',
        choices: sections.filter(s => { return ![...Object.keys(accRoll)].includes(s) })
    })
    let section = { priority: 0 }
    if (sectionPrompt.section === 'mod' || sectionPrompt.section === 'origin') {
        delete section.priority
    }

    let options = await optionsCLI([], sectionPrompt.section)
    if (!!options.length) {
        options = await orderOptionsCLI(options, sectionPrompt.section)
        section.options = options
        accRoll[sectionPrompt.section] = section
    }

    if (!!sections.filter(s => { return ![...Object.keys(accRoll)].includes(s) }).length) {
        //TODO Replace NewSectionPrompt with custom that clears previous line
        const newSectionPrompt = await prompt({
            type: 'toggle',
            name: 'new',
            message: `Do you want to add any other section?`,
            enabled: 'Yes',
            disabled: 'No'
        })
        if (newSectionPrompt.new) {
            accRoll = await sectionCLI(accRoll)
        }
    }
    return accRoll
}

const prioritizeSectionsCLI = async (roll) => {
    let choices = Object.keys(roll).filter(s => { return (s !== 'name' && s !== 'mod' && s !== 'origin') }).map(fs => {
        //this could be done with a flatmap instead of a filter and map, but then it's less comprehensible
        return {
            name: fs,
            message: fs.toUpperCase()
        }
    })

    const prioritizedRolls = await prompt({
        type: 'scale',
        message: 'What is the section Priority',
        name: 'priorities',
        scale: [
            { name: 1, message: 'Max Priority' },
            { name: 2, message: 'High Priority' },
            { name: 3, message: 'Mid Priority' },
            { name: 4, message: 'Low Priority' },
            { name: 5, message: 'Min Priority' },
        ],
        margin: [2, 10, 2, 10],
        choices: choices
    })

    Object.keys(prioritizedRolls.priorities).forEach(sn => {
        roll[sn].priority = prioritizedRolls.priorities[sn] + 1
    })

    return roll
}

const optionsCLI = async (accOptions, sectionName) => {
    let keyName = ""
    let choices = []

    switch (sectionName) {
        case 'masterwork':
            choices = masterworks
            keyName = "statName"
            break;
        case 'trait1':
        case 'trait2':
            choices = wordPool.sort().filter(wp => { return wp.category === "general" }).map(fwp => { return fwp.name })
            keyName = "traitName"
            choices.unshift('ADD NEW')
            break;
        case 'mod':
            choices = wordPool.sort().filter(wp => { return wp.category === sectionName }).map(fwp => { return fwp.name })
            keyName = "modName"
            choices.unshift('ADD NEW')
            break;
        default:
            choices = wordPool.sort().filter(wp => { return wp.category === sectionName }).map(fwp => { return fwp.name })
            keyName = "traitName"
            choices.unshift('ADD NEW')
    }

    const optionsPrompt = await prompt({
        type: 'autocomplete',
        limit: 30,
        multiple: true,
        footer() { return '---Start typing, or scroll up and down to reveal more choices---'; },
        message: `Select all the options in the ${sectionName.toUpperCase()} category`,
        name: 'options',
        choices: choices
    })
    if (optionsPrompt.options.some(o => { return o === 'ADD NEW' })) {
        optionsPrompt.options.shift()
        const newOptionPrompt = await prompt({
            type: 'list',
            name: 'list',
            message: `What new options (comma-separated) do you want to add to ${sectionName.toUpperCase()}?`
        })
        if (sectionName.includes('trait')) { sectionName = 'general' }
        newOptionPrompt.list.forEach(l => {
            if (!wordPool.some(w => { return w.name === l })) {
                wordPool.push({ name: l, category: sectionName })
                // console.log({[keyName]: l})
                accOptions.push({ [keyName]: l })
            }
        })
        writeJson('wordPool.json', wordPool)
        console.log(`Options added to ${sectionName}. Add again the section to the roll.`)
    }

    accOptions.push(...optionsPrompt.options.map(o => { return { [keyName]: o } }))
    return accOptions
}

const orderOptionsCLI = async (options, sectionName) => {
    let keyName = Object.keys(options[0])[0]
    let choices = options.map((o, i) => {
        return {
            name: o[keyName],
            message: o[keyName]
        }
    })
    const orderedOptionsPrompt = await prompt({
        type: 'scale',
        message: `What's the ${sectionName.toUpperCase()} order?`,
        name: 'order',
        scale: [
            { name: 1, message: 'Max Priority' },
            { name: 2, message: 'High Priority' },
            { name: 3, message: 'Mid Priority' },
            { name: 4, message: 'Low Priority' },
            { name: 5, message: 'Min Priority' },
        ],
        margin: [2, 5, 2, 5],
        choices: choices
    })

    return options.map(o => { return { order: orderedOptionsPrompt.order[o[keyName]] + 1, ...o } })
}

const logRollCLI = async () => {
    const weaponPrompt = await prompt({
        type: 'autocomplete',
        limit: 30,
        multiple: false,
        footer() { return '---Start typing, or scroll up and down to reveal more choices---'; },
        name: 'name',
        message: 'Choose a weapon:',
        choices: currentWeapons.map(w => w.name)
    })
    weaponName = weaponPrompt.name
    let weaponIndex = getWeaponIndexByName(weaponName)
    currentWeapons[weaponIndex].rolls.forEach((r, i) => {
        console.dir(printRoll(weaponIndex, i), { depth: 3, colors: true })
    })
}

const showAllCLI = async () => {
    const sortPrompt = await prompt({
        type: 'select',
        name: 'sort',
        message: 'How do you want it sorted?',
        choices: ['Name', 'Season', 'Date']
    })
    let sortFunction
    switch (sortPrompt.sort) {
        case 'Name':
            sortFunction = (a, b) => {
                if (a.name >= b.name) return -1
                if (b.name > a.name) return 1
            }
            break;
        case 'Season':
            sortFunction = (a, b) => {
                if (a.season > b.season) return 1
                if (b.season > a.season) return -1
                if (a.season === b.season) {
                    if (a.name >= b.name) return -1
                    if (b.name > a.name) return 1
                }
            }
            break;
        case 'Date':
            sortFunction = (a, b) => {
                if (Date.parse(a.dateAdded) >= Date.parse(b.dateAdded)) return 1
                if (Date.parse(a.dateAdded) < Date.parse(b.dateAdded)) return -1
            }
            break;
        default:
            sortFunction = () => { }
            break;
    }
    console.table(currentWeapons.sort(sortFunction).map(cw => {
        return {
            Name: cw.name, Season: cw.season, date: (new Date(Date.parse(cw.dateAdded))).toLocaleDateString(), rolls: cw.rolls.map(r => { return r.name })
        }
    }))
}

const printRoll = (weaponIndex, rollIndex) => {
    let weapon = currentWeapons[weaponIndex]
    let roll = { ...currentWeapons[weaponIndex].rolls[rollIndex] }
    let printName = weapon.name + " -> " + roll.name
    let printStatus = roll.status
    delete roll.name
    delete roll.status
    let fRoll = new Map
    Object.keys(roll).forEach(r => {
        let rSectionName = [roll[r].priority, r]
        if (r === 'mod' || r === 'origin') {
            rSectionName = [r]
        }
        fRoll.set(rSectionName, roll[r].options.map(ro => {
            let oName = ""
            if (ro['traitName']) {
                oName = ro['traitName']
            }
            if (ro['statName']) {
                oName = ro['statName']
            }
            if (ro['modName']) {
                oName = ro['modName']
            }
            return [ro.order, oName]
        }).sort((a, b) => { return (a[0] - b[0]) }))
    })
    return {
        name: printName,
        status: printStatus,
        roll: fRoll
    }
}

const handleError = (e) => {
    console.log(e)
    process.exit(1)
}

startCLI().catch(e => handleError(e))