module.exports = {
  "extends": "airbnb-base",
  "rules": {
    "no-underscore-dangle": ["error", { "allow": ["_id"]}]
  },
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "plugins": [
        "react",
        "@typescript-eslint"
    ]
};
