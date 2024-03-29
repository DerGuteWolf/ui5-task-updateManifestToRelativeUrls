# ui5-task-updateManifestToRelativeUrls
[![REUSE status](https://api.reuse.software/badge/github.com/DerGuteWolf/ui5-task-updateManifestToRelativeUrls)](https://api.reuse.software/info/github.com/DerGuteWolf/ui5-task-updateManifestToRelativeUrls)

## Description
A custom task for [ui5-builder](https://github.com/SAP/ui5-builder) of [UI5 Tooling](https://sap.github.io/ui5-tooling/) which translates OData URLs in manifest.json to appropriate relative URLs for SAP BTP Deployment .

## Usage

1. Define the dependency in `$yourapp/package.json`:

```json
"devDependencies": {
    // ...
    "ui5-task-updateManifestToRelativeUrls": "DerGuteWolf/ui5-task-updateManifestToRelativeUrls:^1.0.3"
    // ...
},
```


2. configure it in `$yourapp/ui5-deploy.yaml` (cf. Configuration Options above):

If you do not have the `$yourapp/ui5-deploy.yaml` file already, it can be generated with `npx fiori add deploy-config` command.

```yaml
builder:
  customTasks:
    - name: ui5-task-updateManifestToRelativeUrls
      beforeTask: escapeNonAsciiCharacters
```

## How to obtain support
In case you need any support, please create a GitHub issue.

## License
This work is dual-licensed under Apache 2.0 and the Derived Beer-ware License. The official license will be Apache 2.0 but finally you can choose between one of them if you use this work.

When you like this stuff, buy @DerGuteWolf a beer.

## Release History
See [CHANGELOG.md](CHANGELOG.md).
