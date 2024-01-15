const config = require("config");
const app = require("./app");

const PORT = config.get("port");

app.listen(PORT, () => {
  console.log(
    `App running on port ${PORT} with ${process.env.NODE_ENV} environment`
  );
});
