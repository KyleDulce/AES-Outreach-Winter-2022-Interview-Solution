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
    public create(doorAccess: any, Expiry: any): string {

        //error testing
        if(!this.isArrayIntFilled(doorAccess) || (Expiry != undefined && !Number.isInteger(Expiry))) {
            return "";
        }

        //Generate Access Token (128 hex character token)
        const accessToken: string = crypto.randomBytes(64).toString('hex');

        //setup access token in database to open stated doors
        if (!this.database.AddAccessCode(accessToken, doorAccess, Expiry)) {
            console.error("Problem Adding Access token " + accessToken);
        }

        return accessToken;
    }

    /**
     * Tests if the object is an array and filled with numbers
     * @param array 
     */
    private isArrayIntFilled(array: any): boolean {
        if(Array.isArray(array)) {
            //check each element
            for(let x = 0; x < array.length; x++) {
                if(!Number.isInteger(array[x])) {
                    return false;
                }
            }
            return true;
        }
        return false;
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

        if (Expiry == undefined || Expiry > Date.now()) {
            if (AuthDoors != undefined) {
                return AuthDoors.indexOf(DoorId) >= 0;
            }
        }

        return false;
    }
}