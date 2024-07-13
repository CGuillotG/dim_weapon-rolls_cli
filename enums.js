exports.seasonMap = new Map()
    .set("The Red War", 1)
    .set("Curse of Osiris", 2)
    .set("Warmind", 3)
    .set("Forsaken", 4)
    .set("Outlaw", 4)
    .set("Forge", 5)
    .set("Drifter", 6)
    .set("Opulence", 7)
    .set("Shadowkeep", 8)
    .set("Undying", 8)
    .set("Dawn", 9)
    .set("Worthy", 10)
    .set("Arrivals", 11)
    .set("Beyond Light", 12)
    .set("Hunt", 12)
    .set("Chosen", 13)
    .set("Splicer", 14)
    .set("Lost", 15)
    .set("30th Anniversary", 15)
    .set("The Witch Queen", 16)
    .set("Risen", 16)
    .set("Haunted", 17)
    .set("Plunder", 18)
    .set("Seraph", 19)
    .set("Lightfall", 20)
    .set("Defiance", 20)
    .set("Deep", 21)
    .set("Witch", 22)
    .set("Wish", 23)
    .set("Final Shape", 24)
    .set("Echoes", 24)
// .set("Revenant", 25)
// .set("Heresy", 26)

exports.masterworks = ['Impact', 'Range', 'Stability', 'Handling', 'Reload', 'Magazine', "Blast Radius", 'Velocity', "Draw Time", "Charge", "Accuracy", "Shield Duration"]

exports.sections = ['scopes', 'sights', 'barrels', 'bowstrings', 'hafts', 'blades', 'batteries', 'magazines', 'guards', 'arrows', 'trait1', 'trait2', 'origin', 'grips', 'stocks', 'masterwork', 'frames', 'exotic', 'mod']


//   TODO - TEMPORARY
// Migrating the armor quality code might be a good idea, but for now the queries will be hardcoded from the Excel File

// Queries generated by the Excel file on Jun 01 2024

// They are strings, but have them in Array form to be able to fold it in the IDE

exports.vendorArmorQuery = [
    '/* Vendor Top 0.15 % Armor */ basestat:total:>=60 ( ( basestat:any:>=28) or (((basestat:mobility&resilience:>=23.5) or (basestat:mobility&recovery:>=23.5) or (basestat:mobility&discipline:>=23.5) or (basestat:mobility&intellect:>=23.5) or  (basestat:mobility&strength:>=23.5) or  (basestat:resilience&recovery:>=23.5) or (basestat:resilience&discipline:>=23.5) or (basestat:resilience&intellect:>=23.5) or (basestat:resilience&strength:>=23.5) or (basestat:recovery&discipline:>=23.5) or (basestat:recovery&intellect:>=23.5) or (basestat:recovery&strength:>=23.5) or (basestat:discipline&intellect:>=23.5) or (basestat:discipline&strength:>=23.5) or (basestat:intellect&strength:>=23.5)) -basestat:thirdhighest:>=15) or (((basestat:mobility&resilience&recovery:>=18.33 ) or (basestat:mobility&resilience&discipline:>=18.33 ) or (basestat:mobility&resilience&intellect:>=18.33 ) or (basestat:mobility&resilience&strength:>=18.33 ) or (basestat:mobility&recovery&discipline:>=18.33 ) or (basestat:mobility&recovery&intellect:>=18.33 ) or (basestat:mobility&recovery&strength:>=18.33 ) or (basestat:mobility&discipline&intellect:>=18.33 ) or (basestat:mobility&discipline&strength:>=18.33 ) or (basestat:mobility&intellect&strength:>=18.33 ) or (basestat:resilience&recovery&discipline:>=18.33 ) or (basestat:resilience&recovery&intellect:>=18.33 ) or (basestat:resilience&recovery&strength:>=18.33 ) or (basestat:resilience&discipline&intellect:>=18.33 ) or (basestat:resilience&discipline&strength:>=18.33 ) or (basestat:resilience&intellect&strength:>=18.33 ) or (basestat:recovery&discipline&intellect:>=18.33 ) or (basestat:recovery&discipline&strength:>=18.33 ) or (basestat:recovery&intellect&strength:>=18.33 ) or (basestat:discipline&intellect&strength:>=18.33 )) -basestat:fourthhighest:>=13) or (((basestat:mobility&resilience&recovery&intellect:>=15 ) or (basestat:mobility&resilience&recovery&discipline:>=15 ) or (basestat:mobility&resilience&recovery&strength:>=15 ) or (basestat:mobility&resilience&intellect&discipline:>=15 ) or (basestat:mobility&resilience&intellect&strength:>=15 ) or (basestat:mobility&resilience&discipline&strength:>=15 ) or (basestat:mobility&recovery&intellect&discipline:>=15 ) or (basestat:mobility&recovery&intellect&strength:>=15 ) or (basestat:mobility&recovery&discipline&strength:>=15 ) or (basestat:mobility&intellect&discipline&strength:>=15 ) or (basestat:resilience&recovery&intellect&discipline:>=15 ) or (basestat:resilience&recovery&intellect&strength:>=15 ) or (basestat:resilience&recovery&discipline&strength:>=15 ) or (basestat:resilience&intellect&discipline&strength:>=15 ) or (basestat:recovery&intellect&discipline&strength:>=15 )) -basestat:fifthhighest:>=12) or (((basestat:mobility&resilience&recovery&discipline&intellect:>=12.6) or (basestat:mobility&resilience&recovery&discipline&strength:>=12.6) or (basestat:mobility&resilience&recovery&intellect&strength:>=12.6) or (basestat:mobility&resilience&discipline&intellect&strength:>=12.6) or (basestat:mobility&recovery&discipline&intellect&strength:>=12.6) or (basestat:resilience&recovery&discipline&intellect&strength:>=12.6)) -basestat:sixthhighest:>=10 ) )'
][0]

exports.vaultArmorQuery = [
    "/* Armor Cleanup */ is:armor not:classitem not:exotic -tag:infuse ( (basestat:total:<=60) or (is:Titan ( ( -modslot:artifice -source:fotl -( basestat:any:>=29 ) -( ((basestat:mobility&resilience:>=26.5) or (basestat:mobility&recovery:>=26.5) or (basestat:mobility&discipline:>=26.5) or (basestat:mobility&intellect:>=26.5) or  (basestat:mobility&strength:>=26.5) or  (basestat:resilience&recovery:>=26.5) or (basestat:resilience&discipline:>=26.5) or (basestat:resilience&intellect:>=26.5) or (basestat:resilience&strength:>=26.5) or (basestat:recovery&discipline:>=26.5) or (basestat:recovery&intellect:>=26.5) or (basestat:recovery&strength:>=26.5) or (basestat:discipline&intellect:>=26.5) or (basestat:discipline&strength:>=26.5) or (basestat:intellect&strength:>=26.5)) -basestat:thirdhighest:>=17 ) -( ((basestat:mobility&resilience&recovery:>=20 ) or (basestat:mobility&resilience&discipline:>=20 ) or (basestat:mobility&resilience&intellect:>=20 ) or (basestat:mobility&resilience&strength:>=20 ) or (basestat:mobility&recovery&discipline:>=20 ) or (basestat:mobility&recovery&intellect:>=20 ) or (basestat:mobility&recovery&strength:>=20 ) or (basestat:mobility&discipline&intellect:>=20 ) or (basestat:mobility&discipline&strength:>=20 ) or (basestat:mobility&intellect&strength:>=20 ) or (basestat:resilience&recovery&discipline:>=20 ) or (basestat:resilience&recovery&intellect:>=20 ) or (basestat:resilience&recovery&strength:>=20 ) or (basestat:resilience&discipline&intellect:>=20 ) or (basestat:resilience&discipline&strength:>=20 ) or (basestat:resilience&intellect&strength:>=20 ) or (basestat:recovery&discipline&intellect:>=20 ) or (basestat:recovery&discipline&strength:>=20 ) or (basestat:recovery&intellect&strength:>=20 ) or (basestat:discipline&intellect&strength:>=20 )) -basestat:fourthhighest:>=15 ) -( ((basestat:mobility&resilience&recovery&intellect:>=15.5 ) or (basestat:mobility&resilience&recovery&discipline:>=15.5 ) or (basestat:mobility&resilience&recovery&strength:>=15.5 ) or (basestat:mobility&resilience&intellect&discipline:>=15.5 ) or (basestat:mobility&resilience&intellect&strength:>=15.5 ) or (basestat:mobility&resilience&discipline&strength:>=15.5 ) or (basestat:mobility&recovery&intellect&discipline:>=15.5 ) or (basestat:mobility&recovery&intellect&strength:>=15.5 ) or (basestat:mobility&recovery&discipline&strength:>=15.5 ) or (basestat:mobility&intellect&discipline&strength:>=15.5 ) or (basestat:resilience&recovery&intellect&discipline:>=15.5 ) or (basestat:resilience&recovery&intellect&strength:>=15.5 ) or (basestat:resilience&recovery&discipline&strength:>=15.5 ) or (basestat:resilience&intellect&discipline&strength:>=15.5 ) or (basestat:recovery&intellect&discipline&strength:>=15.5 )) -basestat:fifthhighest:>=12 ) -( ((basestat:mobility&resilience&recovery&discipline&intellect:>=13) or (basestat:mobility&resilience&recovery&discipline&strength:>=13) or (basestat:mobility&resilience&recovery&intellect&strength:>=13) or (basestat:mobility&resilience&discipline&intellect&strength:>=13) or (basestat:mobility&recovery&discipline&intellect&strength:>=13) or (basestat:resilience&recovery&discipline&intellect&strength:>=13)) -basestat:sixthhighest:>=10 ) ) or ( modslot:artifice -( basestat:any:>=26 ) -( ((basestat:mobility&resilience:>=25) or (basestat:mobility&recovery:>=25) or (basestat:mobility&discipline:>=25) or (basestat:mobility&intellect:>=25) or  (basestat:mobility&strength:>=25) or  (basestat:resilience&recovery:>=25) or (basestat:resilience&discipline:>=25) or (basestat:resilience&intellect:>=25) or (basestat:resilience&strength:>=25) or (basestat:recovery&discipline:>=25) or (basestat:recovery&intellect:>=25) or (basestat:recovery&strength:>=25) or (basestat:discipline&intellect:>=25) or (basestat:discipline&strength:>=25) or (basestat:intellect&strength:>=25)) -basestat:thirdhighest:>=16 ) -( ((basestat:mobility&resilience&recovery:>=19 ) or (basestat:mobility&resilience&discipline:>=19 ) or (basestat:mobility&resilience&intellect:>=19 ) or (basestat:mobility&resilience&strength:>=19 ) or (basestat:mobility&recovery&discipline:>=19 ) or (basestat:mobility&recovery&intellect:>=19 ) or (basestat:mobility&recovery&strength:>=19 ) or (basestat:mobility&discipline&intellect:>=19 ) or (basestat:mobility&discipline&strength:>=19 ) or (basestat:mobility&intellect&strength:>=19 ) or (basestat:resilience&recovery&discipline:>=19 ) or (basestat:resilience&recovery&intellect:>=19 ) or (basestat:resilience&recovery&strength:>=19 ) or (basestat:resilience&discipline&intellect:>=19 ) or (basestat:resilience&discipline&strength:>=19 ) or (basestat:resilience&intellect&strength:>=19 ) or (basestat:recovery&discipline&intellect:>=19 ) or (basestat:recovery&discipline&strength:>=19 ) or (basestat:recovery&intellect&strength:>=19 ) or (basestat:discipline&intellect&strength:>=19 )) -basestat:fourthhighest:>=14 ) -( ((basestat:mobility&resilience&recovery&intellect:>=14.75 ) or (basestat:mobility&resilience&recovery&discipline:>=14.75 ) or (basestat:mobility&resilience&recovery&strength:>=14.75 ) or (basestat:mobility&resilience&intellect&discipline:>=14.75 ) or (basestat:mobility&resilience&intellect&strength:>=14.75 ) or (basestat:mobility&resilience&discipline&strength:>=14.75 ) or (basestat:mobility&recovery&intellect&discipline:>=14.75 ) or (basestat:mobility&recovery&intellect&strength:>=14.75 ) or (basestat:mobility&recovery&discipline&strength:>=14.75 ) or (basestat:mobility&intellect&discipline&strength:>=14.75 ) or (basestat:resilience&recovery&intellect&discipline:>=14.75 ) or (basestat:resilience&recovery&intellect&strength:>=14.75 ) or (basestat:resilience&recovery&discipline&strength:>=14.75 ) or (basestat:resilience&intellect&discipline&strength:>=14.75 ) or (basestat:recovery&intellect&discipline&strength:>=14.75 )) -basestat:fifthhighest:>=11 ) -( ((basestat:mobility&resilience&recovery&discipline&intellect:>=12.4) or (basestat:mobility&resilience&recovery&discipline&strength:>=12.4) or (basestat:mobility&resilience&recovery&intellect&strength:>=12.4) or (basestat:mobility&resilience&discipline&intellect&strength:>=12.4) or (basestat:mobility&recovery&discipline&intellect&strength:>=12.4) or (basestat:resilience&recovery&discipline&intellect&strength:>=12.4)) -basestat:sixthhighest:>=12 ) ) )) or (is:Warlock ( ( -modslot:artifice -source:fotl -( basestat:any:>=28 ) -( ((basestat:mobility&resilience:>=23.5) or (basestat:mobility&recovery:>=23.5) or (basestat:mobility&discipline:>=23.5) or (basestat:mobility&intellect:>=23.5) or  (basestat:mobility&strength:>=23.5) or  (basestat:resilience&recovery:>=23.5) or (basestat:resilience&discipline:>=23.5) or (basestat:resilience&intellect:>=23.5) or (basestat:resilience&strength:>=23.5) or (basestat:recovery&discipline:>=23.5) or (basestat:recovery&intellect:>=23.5) or (basestat:recovery&strength:>=23.5) or (basestat:discipline&intellect:>=23.5) or (basestat:discipline&strength:>=23.5) or (basestat:intellect&strength:>=23.5)) -basestat:thirdhighest:>=15 ) -( ((basestat:mobility&resilience&recovery:>=18.33 ) or (basestat:mobility&resilience&discipline:>=18.33 ) or (basestat:mobility&resilience&intellect:>=18.33 ) or (basestat:mobility&resilience&strength:>=18.33 ) or (basestat:mobility&recovery&discipline:>=18.33 ) or (basestat:mobility&recovery&intellect:>=18.33 ) or (basestat:mobility&recovery&strength:>=18.33 ) or (basestat:mobility&discipline&intellect:>=18.33 ) or (basestat:mobility&discipline&strength:>=18.33 ) or (basestat:mobility&intellect&strength:>=18.33 ) or (basestat:resilience&recovery&discipline:>=18.33 ) or (basestat:resilience&recovery&intellect:>=18.33 ) or (basestat:resilience&recovery&strength:>=18.33 ) or (basestat:resilience&discipline&intellect:>=18.33 ) or (basestat:resilience&discipline&strength:>=18.33 ) or (basestat:resilience&intellect&strength:>=18.33 ) or (basestat:recovery&discipline&intellect:>=18.33 ) or (basestat:recovery&discipline&strength:>=18.33 ) or (basestat:recovery&intellect&strength:>=18.33 ) or (basestat:discipline&intellect&strength:>=18.33 )) -basestat:fourthhighest:>=13 ) -( ((basestat:mobility&resilience&recovery&intellect:>=15 ) or (basestat:mobility&resilience&recovery&discipline:>=15 ) or (basestat:mobility&resilience&recovery&strength:>=15 ) or (basestat:mobility&resilience&intellect&discipline:>=15 ) or (basestat:mobility&resilience&intellect&strength:>=15 ) or (basestat:mobility&resilience&discipline&strength:>=15 ) or (basestat:mobility&recovery&intellect&discipline:>=15 ) or (basestat:mobility&recovery&intellect&strength:>=15 ) or (basestat:mobility&recovery&discipline&strength:>=15 ) or (basestat:mobility&intellect&discipline&strength:>=15 ) or (basestat:resilience&recovery&intellect&discipline:>=15 ) or (basestat:resilience&recovery&intellect&strength:>=15 ) or (basestat:resilience&recovery&discipline&strength:>=15 ) or (basestat:resilience&intellect&discipline&strength:>=15 ) or (basestat:recovery&intellect&discipline&strength:>=15 )) -basestat:fifthhighest:>=12 ) -( ((basestat:mobility&resilience&recovery&discipline&intellect:>=12.6) or (basestat:mobility&resilience&recovery&discipline&strength:>=12.6) or (basestat:mobility&resilience&recovery&intellect&strength:>=12.6) or (basestat:mobility&resilience&discipline&intellect&strength:>=12.6) or (basestat:mobility&recovery&discipline&intellect&strength:>=12.6) or (basestat:resilience&recovery&discipline&intellect&strength:>=12.6)) -basestat:sixthhighest:>=10 ) ) or ( modslot:artifice -( basestat:any:>=25 ) -( ((basestat:mobility&resilience:>=22) or (basestat:mobility&recovery:>=22) or (basestat:mobility&discipline:>=22) or (basestat:mobility&intellect:>=22) or  (basestat:mobility&strength:>=22) or  (basestat:resilience&recovery:>=22) or (basestat:resilience&discipline:>=22) or (basestat:resilience&intellect:>=22) or (basestat:resilience&strength:>=22) or (basestat:recovery&discipline:>=22) or (basestat:recovery&intellect:>=22) or (basestat:recovery&strength:>=22) or (basestat:discipline&intellect:>=22) or (basestat:discipline&strength:>=22) or (basestat:intellect&strength:>=22)) -basestat:thirdhighest:>=14 ) -( ((basestat:mobility&resilience&recovery:>=17.33 ) or (basestat:mobility&resilience&discipline:>=17.33 ) or (basestat:mobility&resilience&intellect:>=17.33 ) or (basestat:mobility&resilience&strength:>=17.33 ) or (basestat:mobility&recovery&discipline:>=17.33 ) or (basestat:mobility&recovery&intellect:>=17.33 ) or (basestat:mobility&recovery&strength:>=17.33 ) or (basestat:mobility&discipline&intellect:>=17.33 ) or (basestat:mobility&discipline&strength:>=17.33 ) or (basestat:mobility&intellect&strength:>=17.33 ) or (basestat:resilience&recovery&discipline:>=17.33 ) or (basestat:resilience&recovery&intellect:>=17.33 ) or (basestat:resilience&recovery&strength:>=17.33 ) or (basestat:resilience&discipline&intellect:>=17.33 ) or (basestat:resilience&discipline&strength:>=17.33 ) or (basestat:resilience&intellect&strength:>=17.33 ) or (basestat:recovery&discipline&intellect:>=17.33 ) or (basestat:recovery&discipline&strength:>=17.33 ) or (basestat:recovery&intellect&strength:>=17.33 ) or (basestat:discipline&intellect&strength:>=17.33 )) -basestat:fourthhighest:>=12 ) -( ((basestat:mobility&resilience&recovery&intellect:>=14.25 ) or (basestat:mobility&resilience&recovery&discipline:>=14.25 ) or (basestat:mobility&resilience&recovery&strength:>=14.25 ) or (basestat:mobility&resilience&intellect&discipline:>=14.25 ) or (basestat:mobility&resilience&intellect&strength:>=14.25 ) or (basestat:mobility&resilience&discipline&strength:>=14.25 ) or (basestat:mobility&recovery&intellect&discipline:>=14.25 ) or (basestat:mobility&recovery&intellect&strength:>=14.25 ) or (basestat:mobility&recovery&discipline&strength:>=14.25 ) or (basestat:mobility&intellect&discipline&strength:>=14.25 ) or (basestat:resilience&recovery&intellect&discipline:>=14.25 ) or (basestat:resilience&recovery&intellect&strength:>=14.25 ) or (basestat:resilience&recovery&discipline&strength:>=14.25 ) or (basestat:resilience&intellect&discipline&strength:>=14.25 ) or (basestat:recovery&intellect&discipline&strength:>=14.25 )) -basestat:fifthhighest:>=11 ) -( ((basestat:mobility&resilience&recovery&discipline&intellect:>=12) or (basestat:mobility&resilience&recovery&discipline&strength:>=12) or (basestat:mobility&resilience&recovery&intellect&strength:>=12) or (basestat:mobility&resilience&discipline&intellect&strength:>=12) or (basestat:mobility&recovery&discipline&intellect&strength:>=12) or (basestat:resilience&recovery&discipline&intellect&strength:>=12)) -basestat:sixthhighest:>=12 ) ) )) or (is:Hunter ( ( -modslot:artifice -source:fotl -( basestat:any:>=25 ) -( ((basestat:mobility&resilience:>=21.5) or (basestat:mobility&recovery:>=21.5) or (basestat:mobility&discipline:>=21.5) or (basestat:mobility&intellect:>=21.5) or  (basestat:mobility&strength:>=21.5) or  (basestat:resilience&recovery:>=21.5) or (basestat:resilience&discipline:>=21.5) or (basestat:resilience&intellect:>=21.5) or (basestat:resilience&strength:>=21.5) or (basestat:recovery&discipline:>=21.5) or (basestat:recovery&intellect:>=21.5) or (basestat:recovery&strength:>=21.5) or (basestat:discipline&intellect:>=21.5) or (basestat:discipline&strength:>=21.5) or (basestat:intellect&strength:>=21.5)) -basestat:thirdhighest:>=14 ) -( ((basestat:mobility&resilience&recovery:>=17.33 ) or (basestat:mobility&resilience&discipline:>=17.33 ) or (basestat:mobility&resilience&intellect:>=17.33 ) or (basestat:mobility&resilience&strength:>=17.33 ) or (basestat:mobility&recovery&discipline:>=17.33 ) or (basestat:mobility&recovery&intellect:>=17.33 ) or (basestat:mobility&recovery&strength:>=17.33 ) or (basestat:mobility&discipline&intellect:>=17.33 ) or (basestat:mobility&discipline&strength:>=17.33 ) or (basestat:mobility&intellect&strength:>=17.33 ) or (basestat:resilience&recovery&discipline:>=17.33 ) or (basestat:resilience&recovery&intellect:>=17.33 ) or (basestat:resilience&recovery&strength:>=17.33 ) or (basestat:resilience&discipline&intellect:>=17.33 ) or (basestat:resilience&discipline&strength:>=17.33 ) or (basestat:resilience&intellect&strength:>=17.33 ) or (basestat:recovery&discipline&intellect:>=17.33 ) or (basestat:recovery&discipline&strength:>=17.33 ) or (basestat:recovery&intellect&strength:>=17.33 ) or (basestat:discipline&intellect&strength:>=17.33 )) -basestat:fourthhighest:>=12 ) -( ((basestat:mobility&resilience&recovery&intellect:>=14.75 ) or (basestat:mobility&resilience&recovery&discipline:>=14.75 ) or (basestat:mobility&resilience&recovery&strength:>=14.75 ) or (basestat:mobility&resilience&intellect&discipline:>=14.75 ) or (basestat:mobility&resilience&intellect&strength:>=14.75 ) or (basestat:mobility&resilience&discipline&strength:>=14.75 ) or (basestat:mobility&recovery&intellect&discipline:>=14.75 ) or (basestat:mobility&recovery&intellect&strength:>=14.75 ) or (basestat:mobility&recovery&discipline&strength:>=14.75 ) or (basestat:mobility&intellect&discipline&strength:>=14.75 ) or (basestat:resilience&recovery&intellect&discipline:>=14.75 ) or (basestat:resilience&recovery&intellect&strength:>=14.75 ) or (basestat:resilience&recovery&discipline&strength:>=14.75 ) or (basestat:resilience&intellect&discipline&strength:>=14.75 ) or (basestat:recovery&intellect&discipline&strength:>=14.75 )) -basestat:fifthhighest:>=11 ) -( ((basestat:mobility&resilience&recovery&discipline&intellect:>=12.4) or (basestat:mobility&resilience&recovery&discipline&strength:>=12.4) or (basestat:mobility&resilience&recovery&intellect&strength:>=12.4) or (basestat:mobility&resilience&discipline&intellect&strength:>=12.4) or (basestat:mobility&recovery&discipline&intellect&strength:>=12.4) or (basestat:resilience&recovery&discipline&intellect&strength:>=12.4)) -basestat:sixthhighest:>=10 ) ) or ( modslot:artifice -( basestat:any:>=22 ) -( ((basestat:mobility&resilience:>=20) or (basestat:mobility&recovery:>=20) or (basestat:mobility&discipline:>=20) or (basestat:mobility&intellect:>=20) or  (basestat:mobility&strength:>=20) or  (basestat:resilience&recovery:>=20) or (basestat:resilience&discipline:>=20) or (basestat:resilience&intellect:>=20) or (basestat:resilience&strength:>=20) or (basestat:recovery&discipline:>=20) or (basestat:recovery&intellect:>=20) or (basestat:recovery&strength:>=20) or (basestat:discipline&intellect:>=20) or (basestat:discipline&strength:>=20) or (basestat:intellect&strength:>=20)) -basestat:thirdhighest:>=13 ) -( ((basestat:mobility&resilience&recovery:>=16.33 ) or (basestat:mobility&resilience&discipline:>=16.33 ) or (basestat:mobility&resilience&intellect:>=16.33 ) or (basestat:mobility&resilience&strength:>=16.33 ) or (basestat:mobility&recovery&discipline:>=16.33 ) or (basestat:mobility&recovery&intellect:>=16.33 ) or (basestat:mobility&recovery&strength:>=16.33 ) or (basestat:mobility&discipline&intellect:>=16.33 ) or (basestat:mobility&discipline&strength:>=16.33 ) or (basestat:mobility&intellect&strength:>=16.33 ) or (basestat:resilience&recovery&discipline:>=16.33 ) or (basestat:resilience&recovery&intellect:>=16.33 ) or (basestat:resilience&recovery&strength:>=16.33 ) or (basestat:resilience&discipline&intellect:>=16.33 ) or (basestat:resilience&discipline&strength:>=16.33 ) or (basestat:resilience&intellect&strength:>=16.33 ) or (basestat:recovery&discipline&intellect:>=16.33 ) or (basestat:recovery&discipline&strength:>=16.33 ) or (basestat:recovery&intellect&strength:>=16.33 ) or (basestat:discipline&intellect&strength:>=16.33 )) -basestat:fourthhighest:>=12 ) -( ((basestat:mobility&resilience&recovery&intellect:>=14 ) or (basestat:mobility&resilience&recovery&discipline:>=14 ) or (basestat:mobility&resilience&recovery&strength:>=14 ) or (basestat:mobility&resilience&intellect&discipline:>=14 ) or (basestat:mobility&resilience&intellect&strength:>=14 ) or (basestat:mobility&resilience&discipline&strength:>=14 ) or (basestat:mobility&recovery&intellect&discipline:>=14 ) or (basestat:mobility&recovery&intellect&strength:>=14 ) or (basestat:mobility&recovery&discipline&strength:>=14 ) or (basestat:mobility&intellect&discipline&strength:>=14 ) or (basestat:resilience&recovery&intellect&discipline:>=14 ) or (basestat:resilience&recovery&intellect&strength:>=14 ) or (basestat:resilience&recovery&discipline&strength:>=14 ) or (basestat:resilience&intellect&discipline&strength:>=14 ) or (basestat:recovery&intellect&discipline&strength:>=14 )) -basestat:fifthhighest:>=11 ) -( ((basestat:mobility&resilience&recovery&discipline&intellect:>=11.8) or (basestat:mobility&resilience&recovery&discipline&strength:>=11.8) or (basestat:mobility&resilience&recovery&intellect&strength:>=11.8) or (basestat:mobility&resilience&discipline&intellect&strength:>=11.8) or (basestat:mobility&recovery&discipline&intellect&strength:>=11.8) or (basestat:resilience&recovery&discipline&intellect&strength:>=11.8)) -basestat:sixthhighest:>=12 ) ) )) )"
][0]