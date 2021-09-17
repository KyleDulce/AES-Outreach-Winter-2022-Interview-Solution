import crypto from 'crypto';
import DoorDatabase from './DoorDatabase';

export default class DoorManager {

    //The Database object that holds the data
    database: DoorDatabase;

    constructor() {
        this.database = new DoorDatabase();
    }

    /**
     * Creates an Access Token with specific Authorized Door Accesses
     * @param doorAccess List of Door Ids the Access Token is Authorized to access
     * @returns The Access token String
     */
    public create(doorAccess: Array<number>): string {
        //Generate Access Token (128 hex token)
        const accessToken: string = crypto.randomBytes(64).toString('hex');

        //setup access token in database to open stated doors
        this.database.AddAccessCode(accessToken, doorAccess);

        return accessToken;
    }
}