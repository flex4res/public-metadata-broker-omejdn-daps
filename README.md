---

# Metadata Broker with Omejdn DAPS Integration

This guide provides instructions to run and test the integration of the Metadata Broker with Omejdn DAPS using the provided scripts and Postman collection.

---

## Prerequisites

- Install **Ruby** to run the `.rb` script for token creation.
- Install **Postman** for API testing.
- Ensure Docker and Docker Compose are installed to run the services.

---
### 1. Docker

Navigate to the root directory and run the following command to start the services:

```bash
docker-compose up
```

---
### 2. Register the Connector

Next, register the connector with the DAPS using the `register_connector.sh` script. Provide the connector name, security profile, and the path to the certificate:

```bash
PS C:\path\metadata-broker-omejdn-daps> ./register_connector.sh broker idsc:BASE_SECURITY_PROFILE C:\path\metadata-broker-omejdn-daps\omejdn-daps\keys\broker.crt
```

#### What Happens:
- A client is added to `omejdn-daps/config/clients.yml` with an ID (client_id).
- This ID is required for generating tokens in the next step.


---
## Setup and Commands

### 3. Update the Token Generation Script & Run the Token Generation Script

To generate a token for the registered connector, update the `broker/scripts/create-test-token-intra.rb` file with the **client_id** added in `omejdn-daps/config/clients.yml`. Locate the `iss` field in the script and update it with the corresponding **client_id**.

Example:
```ruby
# Update the 'iss' field with the ID from clients.yml
payload = {
  iss: "your_client_id_here",
  # ... other fields
}
```

Once updated, run the script to generate a test token:

```bash
PS C:\path\metadata-broker-omejdn-daps\broker\scripts> ./create-test-token-intra.rb
```

---

### 4. Postman Collection for Testing

Use the provided [Postman Collection](https://www.postman.com/collections/0a8f223c9141de195795) to test the setup.

#### Adjust Pre-request Script in Postman
1. Open the Postman collection and navigate to the **Pre-request Script** tab.
2. Replace the URL and ensure the token generated is used in the subsequent requests. Use the following script:

```javascript
const postRequest = {
    method: 'POST',
    url: 'https://localhost:443/auth/token',
    header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: {
        mode: 'raw',
        raw: "grant_type=client_credentials&client_assertion_type=urn:ietf:params:oauth:client-assertion-type:jwt-bearer&client_assertion=" +
            "eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiIzNDoyMDowRjo2OTo2Njo3OTpBMzpCQjo5RTpBQjo3RDo1NzoyNDoxRTozQjpBMzo0QjpCODo0NjoyQTozNDoyMDowRjo2OTo2Njo3OTpBMzpCQjo5RTpBQjo3RDo1NzoyNDoxRTozQjpBMzo0QjpCODo0NjoyQSIsInN1YiI6IjM0OjIwOjBGOjY5OjY2Ojc5OkEzOkJCOjlFOkFCOjdEOjU3OjI0OjFFOjNCOkEzOjRCOkI4OjQ2OjJBOjM0OjIwOjBGOjY5OjY2Ojc5OkEzOkJCOjlFOkFCOjdEOjU3OjI0OjFFOjNCOkEzOjRCOkI4OjQ2OjJBIiwiZXhwIjoxNzMyNzE0ODYyLCJuYmYiOjE3MzI3MTEyNjIsImlhdCI6MTczMjcxMTI2MiwiYXVkIjoiaWRzYzpJRFNfQ09OTkVDVE9SU19BTEwifQ.uAj6IxqvSdgnKq59Wgui-P00fBdQBJ_UxP6pnai6ScFPuwcPH0SnponoZ4xCArWFR6DgcPk6u7YLZcTyHGxOJBIPQcdrQZSnOY4fqsrLSlHviqkUYHr8TW-zhKRAYzI20ZRjdUnGj5OKp5ZhqcuV9yaaK_nrGBqwbZu1lktooOD79feM2xcKVymAZFkR0ytsxzfO8J6TXKyBCMHd_sTb9JQtJA5YdC8jKzMFO2smrhNM0Wd-rUbGl3X-VksjQvDnRkSwSfXTE2uED8A5Wxy08EM-MPxYJCMrIHfgKTV_FtU_4pFDsEbIqVA2lQuNt_v80zXbPYvYMTqg_qPl0ihsUMGiTcQ-9ad8XAu13FH9x4neWDVGkfsaJrz-Uv11bTY3p5J7oUmMQW9ATgxBP_9RjkqSBiXGdbQdAj0LtB9wibAInLC3jUHN_bJFakmcGJo1fs9p_YRevuw4somY-TwflKyCUNmio9BTPmqppN8cZOSVsu4O_AeeDX0KoVU2ztUFilricT5VAiQn43okbO_cbl-hKDiD0OavRdx8bzcYukNlIryjpi6J60BGtGtE-kA98QNHGKrBSw3LvCJ3xCJLzdSUpo4bXIpo6Vf43EpKEEEEV7Md0vfp-VEv4WCBZBn9rnNCcvq4ehMEDW2nolgm7mCRQq9rSpvzM_L9wXMpax0" +
            "&scope=idsc:IDS_CONNECTOR_ATTRIBUTES_ALL"
    }
};

pm.sendRequest(postRequest, (error, response) => {
    console.log('DAPS Response: ');
    if (error) {
        console.log('Error: ', error);
    } else {
        const jsonResponse = response.json();
        pm.collectionVariables.set('dat', jsonResponse.access_token);
        console.log('DAT: ', pm.collectionVariables.get('dat'));
    }
});

pm.collectionVariables.set('now', (new Date()).toISOString());
```

---

### **Run the Tests**
1. Import the Postman collection into Postman.
2. Make the request to `https://localhost:443/auth/token` to obtain the access token.
3. Use the generated token (`dat` variable) for further API calls.


---

## Notes
- the included certifcates only for test.

---

