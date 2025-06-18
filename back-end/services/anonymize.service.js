const { User } = require("../models");
const deletedUser = require("../models/mongodb/deletedUser.model.js");

class anonymizeService {
  async anonymizeUserInSQL(userId) {
    await deletedUser.create({ userId });
    const user = await User.findOne({ where: { id: userId } });
    if (user) {
      await user.update({
        name: null,
        email: null,
        password: null,
        active: false,
      });
    }
  }
  forceAnonymizeAll = async () => {
    try {
      const deletedUsers = await deletedUser.find({});
      for (const entry of deletedUsers) {
        const user = await User.findOne({ where: { id: entry.userId } });
        if (user) {
          await user.update({
            name: null,
            email: null,
            password: null,
            active: false,
          });
        }
      }
    } catch (err) {
      console.log(err);
      return {
        success: false,
        message: "An error occurred while anonymizing users.",
      };
    }
  };
}

module.exports = new anonymizeService();
