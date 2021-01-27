"use strict";
const input = require("./input-handler"),
  apigee = require("./apigee-client");

async function saveResults(results) {
  const header = ["developerEmail, developerApp, consumerKey, consumerSecret"];
  const rows = results.map(r =>
     `${r.developerEmail},${r.developerApp},${r.consumerKey},${r.consumerSecret}`
  );

  let outputFileName = "output-" + Math.floor(Date.now()) + ".csv";
  console.log(`Saving consumerKey and consumerSecret in the output csv file: [${outputFileName}]`);

  let resultsCsv = header.concat(rows).join("\n");
  const fs = require("fs")
  fs.writeFileSync(outputFileName, resultsCsv); 
}

async function main() {
  let start = Date.now();
  console.log("Starting ", __filename);

  let results = [],
    failed = [];
  const params = input.getInputParameters();
  const accessToken = await apigee.getAccessToken();

  const total = params.length;
  console.log(`developers/apps to be created: [${total}]`);
  for (let i = 0; i < total; i++) {
    const p = params[i],
      developerEmail = p.developerEmail,
      developerFirstName = p.developerFirstName,
      developerLastName = p.developerLastName,
      developerApp = p.developerApp,
      apiProducts = p.apiProducts;

    try {
      await apigee.deleteDeveloperAppIfExists(accessToken, developerEmail, developerApp); //cannot delete developer if it's already assigned to a devapp
      await apigee.deleteDeveloperIfExists(accessToken, developerEmail);

      let developerCreated = await apigee.createDeveloper(accessToken, developerEmail, developerFirstName, developerLastName);
      let devAppResp = await apigee.createDeveloperApp(accessToken, developerEmail, developerApp, apiProducts.split("|"));
      
      let consumerKey = devAppResp.data.credentials[0].consumerKey;
      let consumerSecret = devAppResp.data.credentials[0].consumerSecret;

      results.push({
        developerEmail: developerEmail,
        developerApp: developerApp,
        consumerKey: consumerKey,
        consumerSecret: consumerSecret
      });

      console.log(`(${i + 1}/${total}) Created Developer [${developerEmail}] / DeveloperApp [${developerApp}]`);
    } catch (err) {
      console.error(`Error processing developer [${developerEmail}] - `, err);
      failed.push(p);
    }
  }

  await saveResults(results);
  console.log(`Created ${results.length} of ${total} developers/apps! Total time:  ${Math.floor((Date.now() - start) / 1000)} seconds`);

  failed.forEach(item => {
    console.error(`Failed Request: Developer [${item.developerEmail}] / DeveloperApp [${item.developerApp}]`);
  });
}

main();
