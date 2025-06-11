const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const db = require("./models");
const cors = require("cors");
const connectMongo = require("./mongodb");
connectMongo();
app.use(cors());

app.use(express.json());

app.use("/user", require("./routes/user.routes"));
app.use("/email", require("./routes/email.routes"));

db.sequelize.sync().then(() => {
  app.listen(PORT, () =>
    console.log(`Server running on https://localhost:${PORT}`)
  );
});
