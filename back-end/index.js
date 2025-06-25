const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const db = require("./models");
const cors = require("cors");
const connectMongo = require("./mongodb");
connectMongo();
app.use(cors());

app.use(express.json());

app.use('/user', require('./routes/user.routes'));
app.use('/email', require('./routes/email.routes'));
app.use('/security', require('./routes/security.routes'));
app.use("/term", require("./routes/term.routes"));

db.sequelize.sync().then(async () => {

  const { Version, Term } = db;

  const versionCount = await Version.count();
  if (versionCount === 0) {
    const defaultVersion = await Version.create({
      version: "0.0",
      createdAt: new Date(),
    });

    await Term.create({
      name: "Default Term",
      description: "This is a default term. Please create other terms using the term creation page (/create-term).",
      versionId: defaultVersion.id,
      optional: false,
      createdAt: new Date(),
    });

    console.log("Default version and term created.");
  }

  app.listen(PORT, () =>
    console.log(`Server running on https://localhost:${PORT}`)
  );
});
