const fs = require('fs')
const { prompt } = require('enquirer')
let currentWeapons = require('./currentWeapons.json')
let wordPool = require('./wordPool.json')
let { masterworks, seasonMap, sections } = require('./enums')
let { getDIMSearch } = require('./dim')


//General methods

const writeJson = (fileName, content) => {
    fs.writeFile(fileName, JSON.stringify(content, null, 4), (err) => {
        if (err) return console.error(err)
    })
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

const newWeapon = (name, season, imgSrc = '#') => {
    currentWeapons.push({ name, season, imgSrc, rolls: [] })
}

const newRoll = (weaponIndex, roll) => {
    let weapon = currentWeapons[weaponIndex]
    weapon.rolls.push(roll)
    return currentWeapons[weaponIndex]
}

const showAll = () => {
    //Temp - To figure out error
    console.dir(currentWeapons[1], { depth: 6 })
    console.table(currentWeapons.map(cw => {
        // if (cw.rolls)
        return {
            name: cw.name, season: cw.season, rolls: cw.rolls.map(r => { return r.name })
        }
    }))
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
        choices: ['New Weapon', 'New Roll', 'Get DIM Queries', 'Show All', 'Exit']
    })
    switch (firstPrompt.answer) {
        case 'New Weapon':
            weaponCLI()
            break;
        case 'New Roll':
            rollCLI()
            break;
        case 'Get DIM Queries':
            getDIMCLI()
            break;
        case 'Show All':
            showAll()
            break;
        case 'Exit':
        default:
            process.exit(0)
    }

}

const getDIMCLI = async () => {
    const weaponPrompt = await prompt({
        type: 'select',
        name: 'weapon',
        message: 'Choose a weapon:',
        choices: [...currentWeapons.map(w => { return w.name })]
    })
    let weaponIndex = getWeaponIndexByName(weaponPrompt.weapon)
    let weapon = currentWeapons[weaponIndex]
    const rollPrompt = await prompt({
        type: 'select',
        name: 'roll',
        message: 'Choose a roll:',
        choices: [...weapon.rolls.map(r => { return r.name })]
    })
    let rollIndex = getRollIndexByName(weaponIndex, rollPrompt.roll)
    let roll = currentWeapons[weaponIndex].rolls[rollIndex]
    console.log(getDIMSearch(weapon.name, roll))
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
        const seasonPrompt = await prompt([
            {
                type: 'select',
                name: 'season',
                message: 'From which season do these rolls apply?',
                choices: [...seasonMap.keys()].reverse()
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
            type: 'select',
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

    newRoll(getWeaponIndexByName(weaponName), roll)

    startCLI()
}

const sectionCLI = async (accRoll) => {
    const sectionPrompt = await prompt({
        type: 'select',
        name: 'section',
        message: 'What section are you adding?',
        choices: sections.filter(s => { return ![...Object.keys(accRoll)].includes(s) })
    })
    let section = { priority: 0 }
    if (sectionPrompt.section === 'mod') {
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
    let choices = Object.keys(roll).filter(s => { return (s !== 'name' && s !== 'mod') }).map(fs => {
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
        case 'perk1':
        case 'perk2':
            choices = wordPool.sort().filter(wp => { return wp.category === "general" }).map(fwp => { return fwp.name })
            keyName = "perkName"
            choices.unshift('ADD NEW')
            break;
        case 'mod':
            choices = wordPool.sort().filter(wp => { return wp.category === sectionName }).map(fwp => { return fwp.name })
            keyName = "modName"
            choices.unshift('ADD NEW')
            break;
        default:
            choices = wordPool.sort().filter(wp => { return wp.category === sectionName }).map(fwp => { return fwp.name })
            keyName = "perkName"
            choices.unshift('ADD NEW')
    }

    const optionsPrompt = await prompt({
        type: 'multiselect',
        message: `Select all the options in the ${sectionName} category`,
        name: 'options',
        // limit: 5,
        // initial: 0,
        choices: choices
    })
    if (optionsPrompt.options.some(o => { return o === 'ADD NEW' })) {
        //add New
        console.log('add new')
        optionsPrompt.options.shift()
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
    console.log(options)
    const orderedOptionsPrompt = await prompt({
        type: 'scale',
        message: `What's the ${sectionName} order?`,
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


startCLI()