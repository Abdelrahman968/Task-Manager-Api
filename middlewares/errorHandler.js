const { logEvents } = require("./logEvents");

const errHandler = (err, req, res, next) => {
  logEvents(
    `${req.headers.origin}\t${req.url}\t${err.name}: ${err.message}`,
    "errLog.txt"
  );
  //   console.error(err.stack);
  res.status(500).send("Something broke!");
};

module.exports = errHandler;
