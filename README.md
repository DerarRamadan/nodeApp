# API Documentation

    ## Get Account

    Get the currently logged in user.

    <div style="border: 1px solid #ddd; padding: 16px; margin: 16px 0; border-radius: 8px;">
      <h3 style="margin-top: 0;">Endpoint</h3>
      <p>
        <strong>Method:</strong> <code>GET</code>
      </p>
      <p>
        <strong>URL:</strong> <code>/account</code>
      </p>
    </div>

    <div style="border: 1px solid #ddd; padding: 16px; margin: 16px 0; border-radius: 8px;">
      <h3 style="margin-top: 0;">Web Example</h3>
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
    </div>

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
