const { User } = require("../models");
const service = require("../services/user.services.js");
const anonymizeService = require("../services/anonymize.service.js");
class requestHandler {
  // POST
  registerUser = async (req, res) => {
    const {
      name,
      email,
      password,
      agreedToPromotionalEmails,
      termsOfUseVersionAccepted,
      privacyPolicyVersionAccepted,
      termsOfUseLastUpdatedAt,
      privacyPolicyLastUpdatedAt,
    } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Os campos email, senha e nome são obrigatórios." });
    }

    const user = {
      name,
      email,
      password: await service.getHashed(password),
      agreedToPromotionalEmails,
      termsOfUseVersionAccepted,
      privacyPolicyVersionAccepted,
      termsOfUseLastUpdatedAt,
      privacyPolicyLastUpdatedAt,
    };

    User.create(user)
      .then(() => {
        res.status(201).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send();
      });
  };

  loginUser = async (req, res) => {
    let { body } = req;

    const user = await User.findOne({ where: { email: body.email } });

    try {
      if (!user) throw new Error("Invalid password or email");
      const token = await service.login(user, body.password);
      res.status(200).json({ token: token });
    } catch (err) {
      res.status(401).send({ error: err.message });
    }
  };

  getUserInfo = async (req, res) => {
    try {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error retrieving user information." });
    }
  };

  updateSubscription = (req, res) => {
    let { user, query } = req;
    User.findOne({ where: { id: user.id } })
      .then((user) => {
        if (!user || !query.subscribe) return res.status(404).send();
        user
          .update({ subscribedToNewsletter: query.subscribe })
          .then(() => {
            res.status(200).send();
          })
          .catch((err) => {
            console.log(err);
            res.status(400).send();
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  };

  deactivateUser = (req, res) => {
    let { user } = req;
    anonymizeService
      .anonymizeUserInSQL(user.id)
      .then(() => {
        res.status(200).send();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  };
  updatePromotionalEmailPreference = (req, res) => {
    let { user, query } = req;
    const updatedAt = query.updatedAt || new Date().toISOString();

    User.findOne({ where: { id: user.id } })
      .then((user) => {
        if (!user) return res.status(404).send();
        user
          .update({
            agreedToPromotionalEmails: query.permit,
            promotionalEmailsLastUpdatedAt: updatedAt,
          })
          .then(() => {
            res.status(200).send();
          })
          .catch((err) => {
            console.log(err);
            res.status(400).send();
          });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  };
}

module.exports = new requestHandler();
