# API Documentation

    ## Get Account

    ### Description
    <p>Retrieves the currently logged-in user's account information.</p>

    ### Endpoint
    <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
      <p><strong>Method:</strong> <code>GET</code></p>
      <p><strong>URL:</strong> <code>/account</code></p>
    </div>

    ### Input
    <p>This endpoint does not require any input parameters.</p>

    ### Output
    <p>The response is a JSON object containing the user's account details.</p>
    <pre style="background-color: #f8f8f8; padding: 10px; border-radius: 4px; overflow-x: auto;">
      <code style="display: block; white-space: pre;">
{
  "id": "string",
  "email": "string",
  "name": "string",
  "prefs": "object",
  "registration": "string",
  "status": "boolean",
  "passwordUpdate": "string",
  "emailVerification": "boolean",
  "phoneVerification": "boolean",
  "labels": "array"
}
      </code>
    </pre>

    ### Web Example
    <p>Here's an example of how to use this endpoint in a web application:</p>
    <pre style="background-color: #f8f8f8; padding: 10px; border-radius: 4px; overflow-x: auto;">
      <code style="display: block; white-space: pre;">
import { Client, Account } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('&lt;YOUR_PROJECT_ID&gt;'); // Your project ID

const account = new Account(client);

const result = await account.get();

console.log(result);
      </code>
    </pre>
    <button style="background-color: #4CAF50; color: white; padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer;" onclick="copyCode(this)">Copy Code</button>

    <script>
      function copyCode(button) {
        const code = button.previousElementSibling.querySelector('code').innerText;
        navigator.clipboard.writeText(code).then(() => {
          button.innerText = 'Copied!';
          setTimeout(() => {
            button.innerText = 'Copy Code';
          }, 2000);
        }, (err) => {
          console.error('Failed to copy code: ', err);
          button.innerText = 'Copy Failed';
        });
      }
    </script>
