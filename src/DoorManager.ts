import crypto from 'crypto';

export default class DoorManager {

    public create(doorAccess: Array<number>): string {
        //Generate Access Token (128 hex token)
        const accessToken: string = crypto.randomBytes(64).toString('hex');

        //setup access token in database to open stated doors

        return accessToken;
    }
}