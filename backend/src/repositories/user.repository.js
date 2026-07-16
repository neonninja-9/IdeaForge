/**
 * User Repository
 * ---------------
 * Data-access layer — the ONLY place that talks to Mongoose.
 * Controllers and services never import the User model directly;
 * they always go through these repository methods.
 *
 * This isolation makes it trivial to:
 *   - swap Mongoose for another ORM/driver later
 *   - mock database calls in unit tests
 */

import User from "../../models/user.js";

const userRepository = {
  /**
   * Find a single user by email address.
   * @param   {string}  email
   * @returns {Promise<import("mongoose").Document|null>}
   */
  async findByEmail(email) {
    return User.findOne({ email });
  },

  /**
   * Find a single user by username.
   * @param   {string}  username
   * @returns {Promise<import("mongoose").Document|null>}
   */
  async findByUsername(username) {
    return User.findOne({ username });
  },

  /**
   * Find a single user by their Mongo _id.
   * @param   {string}  id
   * @returns {Promise<import("mongoose").Document|null>}
   */
  async findById(id) {
    return User.findById(id);
  },

  /**
   * Persist a new user document.
   * @param   {{ username: string, email: string, passwordHash: string, role?: string }} data
   * @returns {Promise<import("mongoose").Document>}
   */
  async create(data) {
    const user = new User(data);
    return user.save();
  },
};

export default userRepository;
