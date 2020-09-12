const fs = require('fs')
const { prompt, Select, Input, Toggle, Form, Scale, AutoComplete } = require('enquirer')
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
            break;
        case 'New Roll':
            break;
        case 'Get DIM Queries':
            getDIMCLI()
            break;
        case 'Show All':
            console.table(currentWeapons.map(cw => {
                return {
                    name: cw.name, season: cw.season, rolls: cw.rolls.map(r => { return r.name })
                }
            }))
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








startCLI()