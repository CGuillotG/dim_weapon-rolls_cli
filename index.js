const fs = require('fs')
const { Select, Input, Toggle, AutoComplete } = require('enquirer')
let currentWeapons = require('./currentWeapons.json')
let wordPool = require('./wordPool.json')
let { masterworks, seasonMap } = require('./enums')
let { getDIMSearch } = require('./dim')

const writeJson = (fileName, content) => {
    fs.writeFile(fileName, JSON.stringify(content, null, 1), (err) => {
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

const newRoll = (weaponIndex) => {
    //Re-do this
    let weapon = currentWeapons[weaponIndex]
    console.log({ name: weapon.name, season: weapon.season, imgSrc: weapon.imgSrc })
    let roll = {}






    currentWeapons[weaponIndex].rolls.push(roll)
}

const startCLI = () => {
    console.clear()
    console.log('--------------------------------------------')
    console.log('Greetings Guardian!')
    const firstPrompt = new Select({
        message: 'How can I help you today?',
        choices: ['New Weapon', 'New Roll', 'Get DIM Queries', 'Exit']
    })
    const weaponPrompt = new Input({
        message: `What is the weapon's name?`
    })
    const dupeWeaponPrompt = new Toggle({
        message: `That weapon already exists, do you want to add some rolls to it?`
    })

    firstPrompt.run().then(answer => {
        switch (answer) {
            case 'New Weapon':
                weaponPrompt.run().then(sWeapon => {
                    if (currentWeapons.some(w => w.name === sWeapon)) {
                        dupeWeaponPrompt.run().then(answer => {
                            if (answer) {
                                rollCLI(sWeapon)
                            } else {
                                startCLI()
                            }
                        }).catch(err => console.error('Error: ' + err))
                    } else {
                        weaponCLI(sWeapon)
                        isSame = false
                    }
                }).catch(err => console.error('Error: ' + err))
                break;
            case 'New Roll':
                rollCLI()
                break;
            case 'Get DIM Queries':
                getDIMCLI()
                break;
            default:
                process.exit(0)
        }
    }).catch(err => console.error('Error: ' + err))
}

const weaponCLI = (wName) => {
    const seasonPrompt = new Select({
        message: 'From which season do these rolls apply?',
        choices: [...seasonMap.keys()]
    })
    const addRollPrompt = new Toggle({
        message: 'Do you want to add a roll?'
    })
    seasonPrompt.run().then(sName => {
        let season = seasonMap.get(sName)
        newWeapon(wName, season)
        addRollPrompt.run().then(answer => {
            answer ? rollCLI(wName) : (startCLI())
        }).catch(err => console.error('Error: ' + err))
    }).catch(err => console.error('Error: ' + err))
}

const rollCLI = (wName = "") => {
    const weaponPrompt = new Select({
        message: 'Which weapon do you want to add rolls to?',
        choices: currentWeapons.map(w => w.name)
    })
    if (!wName) {
        weaponPrompt.run().then(weaponName => {
            rollCLI(weaponName)
        }).catch(err => console.error('Error: ' + err))
    } else {
        console.log('Creating new roll for:', wName)

        let roll = { name: "Rolly Roll" }
        let sections = [...Object.keys(roll)]
        console.table(sections)
        console.log(sections.some(w => { return w === 'name' }))






        currentWeapons[getWeaponIndexByName(wName)].rolls.push(roll)
        // startCLI()
    }
}

const getDIMCLI = () => {
    weaponPrompt = new Select({
        message: 'Choose a weapon:',
        choices: [...currentWeapons.map(w => { return w.name })]
    }).run().then(weapon => {
        let weaponIndex = getWeaponIndexByName(weapon)
        weapon = currentWeapons[weaponIndex]
        rollPrompt = new Select({
            message: 'Choose a roll:',
            choices: [...weapon.rolls.map(r => { return r.name })]
        }).run().then(roll => {
            let rollIndex = getRollIndexByName(weaponIndex, roll)
            roll = currentWeapons[weaponIndex].rolls[rollIndex]
            console.log(getDIMSearch(weapon.name, roll), weapon.name)
        }).catch(err => console.error('Error: ' + err))
    }).catch(err => console.error('Error: ' + err))
}

startCLI()
// writeJson('currentWeapons.json',currentWeapons)