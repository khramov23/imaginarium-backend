import { Injectable } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class MailService {

    constructor(private readonly mailerService: MailerService) {}

    async sendMail(to: string, link: string) {
        await this.mailerService.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: "",
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке: </h1>
                    <a href="${link}">=== ссылка для активации ===</a>
                </div>
            `
        })
    }

}
