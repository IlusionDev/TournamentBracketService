import * as https from "https";
import Player from "@/domain/models/Player";

export default class MobilePushService {

    private static instance: MobilePushService;

    static getInstance() {
        if (!MobilePushService.instance) {
            MobilePushService.instance = new MobilePushService();
        }
        return MobilePushService.instance;
    }

    public static async sendPushNotification(title: string, message: string, data: any) {
        const appId = process.env.ONESIGNAL_APP_ID;
        const restApiKey = process.env.ONESIGNAL_REST_API_KEY;
        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic " + restApiKey
        };
        const payload = {
            app_id: appId,
            headings: {
                en: title
            },
            contents: {
                en: message
            },
            data: data
        };
        const options = {
            host: "onesignal.com",
            port: 443,
            path: "/api/v1/notifications",
            method: "POST",
            headers: headers
        };
        return await new Promise((resolve, reject) => {
            const req = https.request(options, res => {
                res.on("data", d => {
                    resolve(d);
                });
            });
            req.on("error", e => {
                reject(e);
            });
            req.write(JSON.stringify(payload));
            req.end();
        });
    }

    async pushToAllPlayerNextRoundNotification(allRoundPlayers: Player[]) {
        const message = {
            to: '/topics/all',
            notification: {
                title: 'Next round',
                body: 'Next round is starting',
                sound: 'default'
            }
        };

        return await MobilePushService.sendPushNotification(message.notification.title, message.notification.body, {});
    }

}
