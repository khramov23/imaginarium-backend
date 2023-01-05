import {Colors} from "./colors.model";

export enum ColorsEnum {
    RED = 'red',
    GREEN = 'green',
    BLUE = 'blue',
    CYAN = 'cyan',
    PINK = 'pink',
    YELLOW = 'yellow',
    WHITE = 'white',
    BLACK = 'black'
}

export type ColorName =
    ColorsEnum.RED
    | ColorsEnum.GREEN
    | ColorsEnum.BLUE
    | ColorsEnum.CYAN
    | ColorsEnum.PINK
    | ColorsEnum.YELLOW
    | ColorsEnum.WHITE
    | ColorsEnum.BLACK

export interface ColorRGB {
    r: number
    g: number
    b: number
    name: ColorName
}

export interface ColorNumber {
    color: ColorName,
    number: number
}

export interface ImageInfo {
    width: number
    height: number
    colors: Colors
}

