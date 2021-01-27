const axios = require("axios");
const qs = require("qs");

require('dotenv').config();

const TOKEN_URL = process.env.TOKEN_URL;
const MGMT_URL = process.env.MGMT_URL;

const TOKEN_USER = process.env.TOKEN_USER;
const TOKEN_PASS = process.env.TOKEN_PASS;
const TOKEN_AUTH_HEADER = process.env.TOKEN_AUTH_HEADER;

const ORGANIZATION = process.env.ORGANIZATION;

module.exports.getAccessToken = async function () {
  const body = qs.stringify({
    username: TOKEN_USER,
    password: TOKEN_PASS,
    grant_type: "password",
  });

  let resp = await axios.post(TOKEN_URL, body, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: TOKEN_AUTH_HEADER,
    },
  });
  return resp.data.access_token;
};

module.exports.developerExists = async function (accessToken, developerEmail) {
  try {
    let resp = await axios.get(`${MGMT_URL}/o/${ORGANIZATION}/developers/${developerEmail}`, getAuthHeader(accessToken));
    return resp.status === 200;
  } catch (err) {
    //ignore error if developer does not exist
  }
  return false;
};

module.exports.deleteDeveloper = async function (accessToken, developerEmail) {
  try {
    let resp = await axios.delete(`${MGMT_URL}/o/${ORGANIZATION}/developers/${developerEmail}`, getAuthHeader(accessToken));
    return resp.status === 200;
  } catch (err) {
    //ignore error if developer does not exist
  }
  return false;
};

module.exports.createDeveloper = async function (accessToken, developerEmail, developerFirstName, developerLastName) {
  try {
    const body = {
      email: developerEmail,
      userName: developerEmail,
      firstName: developerFirstName,
      lastName: developerLastName,
      attributes: [
        {
          name: "AUTO_ONBOARDING",
          value: true,
        },
      ],
    };

    let resp = await axios.post(`${MGMT_URL}/o/${ORGANIZATION}/developers`, body, getAuthHeader(accessToken));
    return resp.status === 201;
    //console.log(resp.data);
  } catch (err) {
    throw new Error(`Error creating developer [${developerEmail}]: ${err.message}`);
  }
  return false;
};

module.exports.developerAppExists = async function (accessToken, developerEmail, developerApp) {
  try {
    let resp = await axios.get(`${MGMT_URL}/o/${ORGANIZATION}/developers/${developerEmail}/apps/${developerApp}`, getAuthHeader(accessToken));
    return resp.status === 200;
  } catch (err) {
    //ignore error if developer does not exist
  }
  return false;
};

module.exports.deleteDeveloperApp = async function (accessToken, developerEmail, developerApp) {
  try {
    let resp = await axios.delete(`${MGMT_URL}/o/${ORGANIZATION}/developers/${developerEmail}/apps/${developerApp}`, getAuthHeader(accessToken));
    return resp.status === 200;
  } catch (err) {
    //ignore error if developer does not exist
  }
  return false;
};

module.exports.createDeveloperApp = async function (accessToken, developerEmail, developerApp, apiProducts) {
  try {
    const body = {
      name: developerApp,
      apiProducts: apiProducts,
      attributes: [
        {
          name: "AUTO_ONBOARDING",
          value: true,
        },
      ],
    };

    let resp = await axios.post(`${MGMT_URL}/o/${ORGANIZATION}/developers/${developerEmail}/apps`, body, getAuthHeader(accessToken));
    //console.log(resp.data.credentials);
    //return resp.status === 201;
    return resp;
  } catch (err) {
    throw new Error(`Error creating developer app [${developerApp}]: ${err.message}`);
  }
};

module.exports.deleteDeveloperIfExists = async function (accessToken, developerEmail) {
  let developerExists = await this.developerExists(accessToken, developerEmail);
  if (developerExists) {
    await this.deleteDeveloper(accessToken, developerEmail);
  }
}

module.exports.deleteDeveloperAppIfExists = async function (accessToken, developerEmail, developerApp) {
  let developerAppExists = await this.developerAppExists(accessToken, developerEmail, developerApp);
  if (developerAppExists) {
    await this.deleteDeveloperApp(accessToken, developerEmail, developerApp);
  }
}

function getAuthHeader(accessToken) {
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
}
