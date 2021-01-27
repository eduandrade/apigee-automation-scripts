const fs = require("fs"),
  path = require("path");

require('dotenv').config();

function getTestInputParameters() {
  console.log("Loading sample input...");

  //The products have to exist in Apigee already
  return [
    {
      developerEmail: "auto-onboarding1@email.com",
      developerFirstName: "auto",
      developerLastName: "onboarding1",
      developerApp: "auto-onboarding1 Dev App",
      apiProducts: "TEST-AutoOnboarding-1"
    },
    {
      developerEmail: "auto-onboarding2@email.com",
      developerFirstName: "auto",
      developerLastName: "onboarding2",
      developerApp: "auto-onboarding2 Dev App",
      apiProducts: "TEST-AutoOnboarding-2"
    },
    {
      developerEmail: "auto-onboarding3@email.com",
      developerFirstName: "auto",
      developerLastName: "onboarding3",
      developerApp: "auto-onboarding3 Dev App",
      apiProducts: "TEST-AutoOnboarding-1|TEST-AutoOnboarding-2"
    }
  ];
}

function getCsvInputParameters(csvFilePath) {

  if (fs.existsSync(csvFilePath)) {
    console.log(`Loading input from [${csvFilePath}]`);
    const parse = require('csv-parse/lib/sync');

    const csvContent = fs.readFileSync(path.join(process.cwd(), csvFilePath));
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true
    });
    //console.log(JSON.stringify(records));

    return records;
  } else {
    throw new Error(`Input file does not exists: [${csvFilePath}]`);
  }

}

module.exports.getInputParameters = function () {
  if (process.env.INPUT_FILE) {
    return getCsvInputParameters(process.env.INPUT_FILE);
  } else {
    return getTestInputParameters();
  }
};