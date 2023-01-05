import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Colors, ColorsDocument} from "./colors.model";
import {Model} from "mongoose";
import {ColorName, ColorNumber, ColorRGB, ColorsEnum, ImageInfo} from "./colors.types";
import * as jimp from "jimp";
import * as path from "path";

@Injectable()
export class ColorsService {

    constructor(@InjectModel(Colors.name) private readonly colorsModel: Model<ColorsDocument>) {
    }

    private colorNumber(color: ColorRGB, pixel_rgba: Omit<ColorRGB, "name">): number {
        const number = Math.abs(color.r - pixel_rgba.r) + Math.abs(color.g - pixel_rgba.g) + Math.abs(color.b - pixel_rgba.b)
        return color.name === "black" || color.name === "white" ? number * 3 : number
    }

    private minColor(colorNumbers: ColorNumber[]): ColorName {
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

    private normalize(stats: Colors): void {
        let sum = 0
        for (const value of Object.values(stats))
            sum += value
        for (const [key, value] of Object.entries(stats))
            stats[key] = value / sum * 100
    }

    async getImageInfo(src: string): Promise<ImageInfo> {
        const filePath = path.resolve(__dirname, "..", "static", 'images', src)

        const imageInfo: ImageInfo = {
            colors: {} as Colors,
            height: 0,
            width: 0
        }
        const lenna = await jimp.read(filePath)

        imageInfo.width = lenna.getWidth()
        imageInfo.height = lenna.getHeight()

        console.log(imageInfo.width, imageInfo.height)

        const colors: ColorRGB[] = [
            {r: 255, g: 0, b: 0, name: ColorsEnum.RED},
            {r: 0, g: 255, b: 0, name: ColorsEnum.GREEN},
            {r: 0, g: 0, b: 255, name: ColorsEnum.BLUE},
            {r: 0, g: 255, b: 255, name: ColorsEnum.CYAN},
            {r: 255, g: 0, b: 255, name: ColorsEnum.PINK},
            {r: 255, g: 255, b: 0, name: ColorsEnum.YELLOW},
            {r: 0, g: 0, b: 0, name: ColorsEnum.BLACK},
            {r: 255, g: 255, b: 255, name: ColorsEnum.WHITE}
        ]

        const stats: Colors = {
            blue: 0,
            cyan: 0,
            red: 0,
            black: 0,
            pink: 0,
            green: 0,
            yellow: 0,
            white: 0
        }

        for (let x = 0; x < lenna.getWidth(); x++) {
            for (let y = 0; y < lenna.getHeight(); y++) {
                const pixel = lenna.getPixelColor(x, y)
                const pixel_rgba = jimp.intToRGBA(pixel)

                const color_numbers: ColorNumber[] = []
                for (const color of colors) {
                    color_numbers.push({color: color.name, number: this.colorNumber(color, pixel_rgba)})
                }

                const color = this.minColor(color_numbers)
                stats[color] += 1

            }
        }

        this.normalize(stats)
        imageInfo.colors = stats

        return imageInfo
    }
}
