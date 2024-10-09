const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// const data = format(new Date(), "yyyy-MM-dd \t hh:mm:ss a");
// console.log(data);
const logEvents = async (data, logName) => {
  const dataTime = `${format(new Date(), "yyyy-MM-dd \t hh:mm:ss a")}`;
  const logItems = `${dataTime}\t${uuid()}\t${data}\n`;
  // console.log(logItems);
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItems
    );
  } catch (error) {
    console.error(error);
  }
};

const logger = (req, res, next) => {
  res.on("finish", () => {
    logEvents(
      `${req.method}\t${res.statusCode}\t${req.headers.origin}\t${req.url}`,
      `reqLog.txt`
    );
    // console.log(`${req.method} ---  ${req.path} --- ${res.statusCode}`);
  });
  next();
};

module.exports = { logEvents, logger };
