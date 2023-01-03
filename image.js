const jimp = require("jimp")

const colorNumber = (color, pixel_rgba) => {
    const number = Math.abs(color.r - pixel_rgba.r) + Math.abs(color.g - pixel_rgba.g) + Math.abs(color.b - pixel_rgba.b)
    return color.name === "black" || color.name === "white" ? number * 3 : number
}

const minColor = (colorNumbers) => {
    let color = colorNumbers[0].color
    let colorNumber = colorNumbers[0].number
    for (const obj of colorNumbers) {
        if (obj.number <= colorNumber) {
            colorNumber = obj.number
            color = obj.color
        }
    }
    return color
}

const normalize = (stats) => {
    let sum = 0
    for (const value of Object.values(stats))
        sum += value
    for (const [key, value] of Object.entries(stats))
        stats[key] = (value / sum * 100).toFixed(2) + " %"
}

jimp.read('./images/10.jpg', (err, lenna) => {
    if (err) throw err

    console.log('Width: ', lenna.getWidth())
    console.log('Height: ', lenna.getHeight())

    const colors = [
         {r: 255, g: 0, b: 0, name: 'red'},
         {r: 0, g: 255, b: 0, name: 'green'},
         {r: 0, g: 0, b: 255, name: 'blue'},
         {r: 0, g: 255, b: 255, name: 'cyan'},
         {r: 255, g: 0, b: 255, name: 'pink'},
         {r: 255, g: 255, b: 0, name: 'yellow'},
         {r: 0, g: 0, b: 0, name: 'black'},
         {r: 255, g: 255, b: 255, name: 'white'}
    ]

    const stats = {}
    colors.forEach(color => stats[color.name] = 0)
    let counter = 0
    for (let x = 0; x < lenna.getWidth(); x++) {
        for (let y = 0; y < lenna.getHeight(); y++) {
            counter++
            const pixel = lenna.getPixelColor(x, y)
            const pixel_rgba = jimp.intToRGBA(pixel)

            const color_numbers = []
            for (const color of colors) {
                color_numbers.push({color: color.name, number: colorNumber(color, pixel_rgba)})
            }

            const color = minColor(color_numbers)
            stats[color] += 1

        }
    }

    console.log("Pixels: " + counter)
    normalize(stats)
    console.log(stats)

})