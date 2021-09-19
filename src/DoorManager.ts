import crypto from 'crypto';
import DoorDatabase from './DoorDatabase';

export default class DoorManager {

    //The Database object that holds the data
    database: DoorDatabase;

    public constructor(callback?: Function) {
        this.database = new DoorDatabase(callback);
    }

    /**
     * Creates an Access Token with specific Authorized Door Accesses
     * @param doorAccess List of Door Ids the Access Token is Authorized to access
     * @param Expiry The UNIX timestamp of when the token will expire
     * @returns The Access token String
     */
    public create(doorAccess: Array<number>, Expiry: number): string {
        //Generate Access Token (128 hex character token)
        const accessToken: string = crypto.randomBytes(64).toString('hex');

        //setup access token in database to open stated doors
        if (!this.database.AddAccessCode(accessToken, doorAccess, Expiry)) {
            console.error("Problem Adding Access token " + accessToken);
        }

        return accessToken;
    }

    /**
     * Returns whether or not the Access token is authorized to open the specified door
     * @param AccessToken The Access Code Token
     * @param DoorId The numeric Door Id to check
     * @returns Whether or not Specified Access token is authorized to open Specified Door
     */
    public validate(AccessToken: string, DoorId: number): boolean {
        const AuthDoors: Array<number> | undefined = this.database.getAccessCodeAuthDoors(AccessToken);
        const Expiry: number | undefined = this.database.getAccessCodeExpiry(AccessToken);

        if (Expiry != undefined && Expiry > Date.now()) {
            if (AuthDoors != undefined) {
                return AuthDoors.indexOf(DoorId) >= 0;
            }
        }

        return false;
    }
}