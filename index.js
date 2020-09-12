const fs = require('fs')
const { prompt, Select, Input, Toggle, Form, Scale, AutoComplete } = require('enquirer')
let currentWeapons = require('./currentWeapons.json')
let wordPool = require('./wordPool.json')
let { masterworks, seasonMap, sections } = require('./enums')
let { getDIMSearch } = require('./dim')

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

const startCLI = () => {
    console.clear()
    console.log('--------------------------------------------')
    console.log('Greetings Guardian!')
    const firstPrompt = new Select({
        message: 'How can I help you today?',
        choices: ['New Weapon', 'New Roll', 'Get DIM Queries', 'Show All', 'Exit']
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
            case 'Show All':
                console.table(currentWeapons.map(cw => {
                    return {
                        name: cw.name, season: cw.season, rolls: cw.rolls.map(r => { return r.name })
                    }
                }))
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

        sectionCLI(roll, wName)
        // currentWeapons[getWeaponIndexByName(wName)].rolls.push(roll)
        // startCLI()
    }
}

const sectionCLI = (accRoll, wName) => {

    const sectionPrompt = new Select({
        message: 'What section are you adding?',
        choices: sections.filter(s => { return ![...Object.keys(accRoll)].includes(s) })
    })
    sectionPrompt.run().then(s => {
        let section = { priority: 1, options: [] }








        accRoll[s] = section
        console.log('Current sections:', [...Object.keys(accRoll)])
        const newSectionPrompt = new Toggle({
            message: `Do you want to add any other section?`
        })
        newSectionPrompt.run().then(n => {
            if (n) {
                sectionCLI(accRoll)
            } else {
                console.log(accRoll)
                console.log("           ")
                // const sectionPriority = new Scale({
                //     message: 'What is the section Priority',
                //     scale: [
                //         { name: '1', message: 'Max Priority' },
                //         { name: '2', message: 'High Priority' },
                //         { name: '3', message: 'Mid Priority' },
                //         { name: '4', message: 'Low Priority' },
                //         { name: '5', message: 'Min Priority' },
                //     ],
                //     choices: [{
                //         message: 'What is the section Priority',
                //     }]
                // }).run().then(() => {

                // }).catch(err => console.error('Error: ' + err))
                newRoll(getWeaponIndexByName(wName), accRoll)
                startCLI()
            }
        }).catch(err => console.error('Error: ' + err))


    }).catch(err => console.error('Error: ' + err))
    // accRoll['section' + Object.keys(accRoll).length] = {}
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
            console.log(getDIMSearch(weapon.name, roll))
        }).catch(err => console.error('Error: ' + err))
    }).catch(err => console.error('Error: ' + err))
}

startCLI()
// writeJson('currentWeapons.json',currentWeapons)