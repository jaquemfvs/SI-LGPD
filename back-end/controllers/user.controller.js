const { User } = require("../models");
const service = require("../services/user.services.js");
class requestHandler {
  // POST
  registerUser = async (req, res) => {
    const { email, password, agreedToPromotionalEmails } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }
    
    const user = {
      email,
      password: await service.getHashed(password),
      agreedToPromotionalEmails,
    };

    // Create user
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
      res.status(401).send({error:err.message});
    }
  };

  updateSubscription = (req, res) => {
  let { user, query } = req;
  User.findOne({ where: { id: user.id } })
    .then((user) => {
      if (!user || !query.subscribe) return res.status(404).send();
      user.update({ subscribedToNewsletter: query.subscribe })
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
    User.findOne({ where: { id: user.id } })
      .then((user) => {
        if (!user) return res.status(404).send();
        user.update({ active: false })
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
  updatePromotionalEmailPreference = (req, res) => {
    let { user, query } = req;
    User.findOne({ where: { id: user.id } })
      .then((user) => {
        if (!user) return res.status(404).send();
        user.update({ agreedToPromotionalEmails: query.permit })
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
