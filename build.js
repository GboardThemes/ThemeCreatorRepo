const fs = require('fs')

const build = async () => {
    const presets = fs.readdirSync('./presets')

    const presetsMap = presets.reduce((acc, preset) => {
        acc[preset] = fs.readdirSync(`./presets/${preset}`)
        return acc
    }, {})

    const manifest = {}

    for (const [preset, files] of Object.entries(presetsMap)) {
        try {
            const obj = {
                name: preset,
                styleSheetMd: fs.readFileSync(`./presets/${preset}/styleSheetMd.css`, 'utf8'),
                styleSheetMdBorder: fs.readFileSync(`./presets/${preset}/styleSheetMdBorder.css`, 'utf8'),
                metadata: JSON.parse(fs.readFileSync(`./presets/${preset}/metadata.json`, 'utf8')),
                imageBase64: []
            }

            console.log(`Processing ${preset}...`)

            for (const file of files) {
                if (file.endsWith('png')) {
                    console.log(`Processing ${file}...`)
                    const base64 = fs.readFileSync(`./presets/${preset}/${file}`, 'base64')
                    obj.imageBase64.push({ file, base64 })
                }
            }

            manifest[preset] = obj
        } catch (e) {
            console.log(e)
        }
    }

    fs.writeFileSync('./manifest.json', JSON.stringify(manifest, null, 2))
}

build().then(() => console.log('Done!'))