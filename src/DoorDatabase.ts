import { Database } from "sqlite3";

export default class DoorDatabase {

    //File location of the json database
    private static readonly DATABASE_FILE: string = "./data/AccessTokens.db";

    //Table Properties Note If you change these properties, change the name of 
    //properties in the  Class Object below
    private static readonly TABLE_NAME: string = "ACCESS_TOKEN_AUTH_DOOR";
    private static readonly PROPERTY_TOKEN: string = "AccessToken";
    private static readonly PROPERTY_AUTH_DOOR: string = "AuthorizedDoors";
    private static readonly PROPERTY_EXPIRATION: string = "Expiry";

    //Map of Access code and the authorized doors they are allowed to access
    //acting as a memory cache
    private AccessCode_Auth_Doors: Map<string, TableData> = new Map();

    //database file
    private AccessDatabase: Database;

    //boolean on if the database is working properly
    private databaseSafe: boolean = false;

    /**
     * Default constructor
     * @param callback Callback for when async tasks have completed
     */
    public constructor(callback?: Function) {
        this.AccessDatabase = new Database(DoorDatabase.DATABASE_FILE, (err) => {
            if (err) {
                console.warn("WARNING: Database cannot be opened, disabling database! Error: " + err);
                this.databaseSafe = false;
                if (callback) {
                    callback();
                }
            } else {
                console.log(`Database: '${DoorDatabase.DATABASE_FILE}' has been opened!`);

                //create table schema if not exists
                this.AccessDatabase.exec(
                    `CREATE TABLE IF NOT EXISTS '${DoorDatabase.TABLE_NAME}' (` +
                    `'${DoorDatabase.PROPERTY_TOKEN}' CHAR(128), '${DoorDatabase.PROPERTY_AUTH_DOOR}' SMALLINT, ` +
                    `'${DoorDatabase.PROPERTY_EXPIRATION}' TIMESTAMP)`,
                    (err) => { //callback when command is executed
                        //checks if error in table schema
                        if (err) {
                            console.warn("WARNING: Database Table Check failed! Error: " + err);
                            this.databaseSafe = false;
                            if (callback) {
                                callback();
                            }
                            return;
                        }
                        //schema was successful
                        console.log("Database Table was checked!");
                        this.databaseSafe = true;

                        //fill memory cache with each row
                        this.AccessDatabase.all(
                            `SELECT * FROM '${DoorDatabase.TABLE_NAME}'`,
                            (err, rows) => {
                                if (err) {
                                    console.warn("Error in reading the table! Error: " + err);
                                    if (callback) {
                                        callback();
                                    }
                                    return;
                                }

                                for (let r of rows) {
                                    
                                    //checks if access token was already added
                                    if(!this.AccessCode_Auth_Doors.has(r.AccessToken)) {
                                        //access token is not added yet
                                        var td: TableData = new TableData();
                                        td.AccessToken = r.AccessToken;
                                        
                                        if(r.Expiry == "undefined") {
                                            td.Expiry = undefined;
                                        } else {
                                            Number.parseInt(r.Expiry);
                                        }

                                        this.AccessCode_Auth_Doors.set(r.AccessToken, td);
                                    }
                                    this.AccessCode_Auth_Doors.get(r.AccessToken)?.AuthorizedDoors.push(r.AuthorizedDoors);
                                }
                                
                                console.log("Caching database in memory complete!");
                                if (callback) {
                                    callback();
                                }
                            }
                        );
                    }
                );

            }
        });
    }

    /**
     * Adds An Access code to the database
     * @param AccessCode The Access Code Token
     * @param Auth_Doors Array of Door Ids Access Code is Authorized to use
     * @param Expiry The expiration time as a UNIX timestamp
     * @returns true if access code was successfully added, false if code already exists in database
     */
    public AddAccessCode(AccessCode: string, Auth_Doors: Array<number>, Expiry: number | undefined): boolean {
        if (!this.IsValidAccessCode(AccessCode)) {

            var newData: TableData = new TableData();
            newData.AccessToken = AccessCode;
            newData.AuthorizedDoors = Auth_Doors;
            newData.Expiry = Expiry;

            this.AccessCode_Auth_Doors.set(AccessCode, newData);
            console.log("Added Token to memory cache");

            //add to database
            if (this.databaseSafe) {
                for (let door of Auth_Doors) {
                    this.AccessDatabase.exec(
                        `INSERT INTO '${DoorDatabase.TABLE_NAME}' ` +
                        `('${DoorDatabase.PROPERTY_TOKEN}', '${DoorDatabase.PROPERTY_AUTH_DOOR}', '${DoorDatabase.PROPERTY_EXPIRATION}')` +
                        `VALUES ('${AccessCode}', '${door}', '${Expiry}')`,
                        (err) => {
                            if (err) {
                                console.warn("Error in placing property into table, Token: " + AccessCode + " Error: " + err);
                            }
                        }
                    );
                }
            }

            return true;
        }
        return false;
    }

    /**
     * Returns true if the Access Code is avaliable within the database
     * @param AccessCode The Access Code Token to check
     * @returns Whether the Access code is avaliable in database
     */
    public IsValidAccessCode(AccessCode: string): boolean {
        return this.AccessCode_Auth_Doors.has(AccessCode);
    }

    /**
     * Returns all the Authorized Doors the Access code is authorized to access
     * @param AccessCode The Access Code Token to check
     * @returns The Authorized Doors according to the database
     */
    public getAccessCodeAuthDoors(AccessCode: string): Array<number> | undefined {
        return this.AccessCode_Auth_Doors.get(AccessCode)?.AuthorizedDoors;
    }

    /**
     * Returns the associated expiry for an Access Token
     * @param AccessCode The Token to check
     * @returns The expiry time as a Unix Timestamp
     */
    public getAccessCodeExpiry(AccessCode: string): number | undefined {
        return this.AccessCode_Auth_Doors.get(AccessCode)?.Expiry;        
    }
}

class TableData {
    public AccessToken: string = "";
    public AuthorizedDoors: Array<number> = [];
    public Expiry: number | undefined; //expiry dates are stored as a unix timestamp
}