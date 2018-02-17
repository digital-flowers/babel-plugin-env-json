# babel-plugin-env-json

Loads environment variables from a json file through `import` statement.

## Installation

```sh
$ npm install babel-plugin-env-json
```

## Usage

**.babelrc**

```json
{
  "plugins": [["babel-plugin-env-json", {
      "replacedModuleName": "babel-env-json"
   }]]
}
```

**env/default.json**

```json
{
  "db":{
    "host":"localhost",
    "username":"root",
    "password":"LOL"
  },
  "api":{
    "endpoint":"https://google.com/api"
  }
}
```

In **your-code.js**

```js
import {db, api} from "babel-env-json"
connection.connect(db);
console.log(api.endpoint); // "https://google.com/api"
```
