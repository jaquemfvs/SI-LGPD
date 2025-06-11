const { User } = require("../models");
const deletedUser = require("../models/mongodb/deletedUser.model.js");

class anonymizeService {
  async anonymizeUserInSQL(userId) {
    await deletedUser.create({ userId });
    const user = await User.findOne({ where: { id: userId } });
    if (user) {
      await user.update({ email: null, password: null, active: false });
    }
  }
  forceAnonymizeAll = async (req, res) => {
    try {
      const deletedUsers = await deletedUser.find({});
      for (const entry of deletedUsers) {
        await this.anonymizeUserInSQL(entry.userId);
      }
      res
        .status(200)
        .json({ message: "All users in MongoDB have been anonymized in SQL." });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to force anonymize users." });
    }
  };
}

module.exports = new anonymizeService();
