import { ObjectId } from "mongodb";

/**
 * A user of the application.
 * @param email The email address of the user.
 * @param passwordHash The hashed password of the user.
 * @param isSuperAdmin A boolean indicating if the user has sysadmin privileges.
 * @param id The unique identifier for the user (assigned by MongoDB).
*/
export default class User {
  constructor(
      public email: string,
      public passwordHash: string,
      public isSuperAdmin?: boolean,
      public id?: ObjectId,
  ) {}
}