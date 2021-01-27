"use strict";
const input = require("./input-handler"),
  apigee = require("./apigee-client");

async function main() {
  console.log("Starting ", __filename);

  const params = input.getInputParameters();
  const accessToken = await apigee.getAccessToken();

  const total = params.length;
  console.log(`developers/apps to be deleted: [${total}]`);
  for (let i = 0; i < total; i++) {
    const p = params[i],
      developerEmail = p.developerEmail,
      developerApp = p.developerApp;

    try {
      await apigee.deleteDeveloperAppIfExists(accessToken, developerEmail, developerApp); //cannot delete developer if it's already assigned to a devapp
      await apigee.deleteDeveloperIfExists(accessToken, developerEmail);
      console.log(`(${i + 1}/${total}) Deleted Developer [${developerEmail}] / DeveloperApp [${developerApp}]`);
    } catch (err) {
      console.error(`Error deleting developer [${developerEmail}] - `, err);
    }
  }

}

main();
