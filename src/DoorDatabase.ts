
export default class DoorDatabase {
    //Map of Access code and the authorized doors they are allowed to access
    private AccessCode_Auth_Doors: Map<string, Array<number>> = new Map();

    /**
     * Adds An Access code to the database
     * @param AccessCode The Access Code Token
     * @param Auth_Doors Array of Door Ids Access Code is Authorized to use
     * @returns true if access code was successfully added, false if code already exists in database
     */
    public AddAccessCode(AccessCode: string, Auth_Doors: Array<number>): boolean {
        if(!this.IsValidAccessCode(AccessCode)) {
            this.AccessCode_Auth_Doors.set(AccessCode, Auth_Doors);
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
        return this.AccessCode_Auth_Doors.get(AccessCode);
    }
}