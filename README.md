# apigee-automation-scripts

Node.JS scripts for administrative tasks on Apigee.

Currently I have developed scripts for:
- Creating developers and developer apps (create-devs-apps.js)
- Deleting developers and developer apps (delete-devs-apps.js)

## Input file

The input for `create-devs-apps.js` and `delete-devs-apps.js` is a csv file with the following format (the csv header is mandatory):

```
developerEmail,developerFirstName,developerLastName,developerApp,apiProducts
auto-onboarding1@email.com,auto1,onboarding1,auto-onboarding1 Dev App,TEST-AutoOnboarding-1
auto-onboarding2@email.com,auto2,onboarding2,auto-onboarding2 Dev App,TEST-AutoOnboarding-2
```
    
## Parameters

These scripts use the `dotenv` library to load all the required parameters into environment variables. You can set all environment variables manually or create a file in the root directory called `.env` with the parameters shown below:

```
#Path to the input csv file
INPUT_FILE=

#Apigee Management API url
MGMT_URL=https://api.enterprise.apigee.com/v1
#Apigee OAuth token endpoint
TOKEN_URL=https://login.apigee.com/oauth/token
#Apigee OAuth credentials
TOKEN_USER=
TOKEN_PASS=
TOKEN_AUTH_HEADER=

#Apigee organization
ORGANIZATION=
```

## Executing the scripts

First you need to install the required dependencies

    npm install

Create developers and developer apps

    npm run devs-apps:create

Delete developers and developer apps

    npm run devs-apps:delete
    
