import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs';
import * as uuid from 'uuid';

@Injectable()
export class FileService {

    async createFile(file: Express.Multer.File): Promise<string> {
        try {
            console.log(123)
            console.log(file.originalname)
            const fileResolution = file.originalname.split('.')[1]
            console.log(fileResolution)
            const fileName = uuid.v4() + '.' + fileResolution;
            const filePath = path.resolve(__dirname, '..', 'static')
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true})
            }
            fs.writeFileSync(path.join(filePath, fileName), file.buffer)
            return fileName;
        } catch (e) {
            throw new HttpException('Error occurred with uploaded file', HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

}