const log = require("@ui5/logger").getLogger("builder:customtask:updateManifestToRelativeUrls");
const dotenv = require('dotenv');
const resourceFactory = require("@ui5/fs").resourceFactory;
const Resource = require("@ui5/fs").Resource;
const path = require('path');

dotenv.config();

/**
 * updateManifestToRelativeUrls
 *
 * @param {object} parameters Parameters
 * @param {module:@ui5/fs.DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {module:@ui5/fs.AbstractReader} parameters.dependencies Reader or Collection to read dependency files
 * @param {object} parameters.taskUtil Specification Version dependent interface to a
 *                [TaskUtil]{@link module:@ui5/builder.tasks.TaskUtil} instance
 * @param {object} parameters.options Options
 * @param {string} parameters.options.projectName Project name
 * @param {string} [parameters.options.projectNamespace] Project namespace if available
 * @param {string} [parameters.options.configuration] Task configuration if given in ui5.yaml
 * @returns {Promise<undefined>} Promise resolving with <code>undefined</code> once data has been written
 */
module.exports = async function({workspace, dependencies, taskUtil, options}) {
    const isDebug = options && options.configuration && options.configuration.debug;

    let manifestFiles;
    try {
        manifestFiles = await workspace.byGlob(['/**/manifest.json', '!/**/node_modules/**', '!/**/dist/**']);
    } catch (e) {
        log.error(`Couldn't read resources: ${e}`);
        manifestFiles = [];
    }
    log.info(`found ${manifestFiles.length} manifest.json files`);

    let mainManifestPath;
    if (manifestFiles.length > 1) { // library/application with components/applications
        mainManifestPath = manifestFiles[0].getPath();
        manifestFiles.forEach(manifestFile => { const path = manifestFile.getPath(); if (path.length < mainManifestPath.length) mainManifestPath = path; });
        mainManifestPath = mainManifestPath.slice(0, -'/manifest.json'.length);
        log.info(`mainManifestPath: ${mainManifestPath}`);
    }

    await Promise.all(manifestFiles.map( manifestFile =>
        manifestFile.getString().then( manifestFileContent => {
            const manifestJsonContent = JSON.parse(manifestFileContent);

            updateManifestDatasourceUri(manifestJsonContent["sap.app"], mainManifestPath?path.relative(manifestFile.getPath(), mainManifestPath).replace('\\','/'):'');

            var updatedManifestFile = new Resource({ path: manifestFile.getPath(), string: JSON.stringify(manifestJsonContent, null, 4)});
            return workspace.write(updatedManifestFile);
		})
    ));
}

function updateManifestDatasourceUri(sapAppBlock, pathPrefix) {
    if(sapAppBlock && sapAppBlock.dataSources) {
        for(dataSourceName in sapAppBlock.dataSources) {
            var dataSource = sapAppBlock.dataSources[dataSourceName];
            if(dataSource.uri) {
                if(dataSource.uri[0] === "/") {
                    if (pathPrefix) {
                        dataSource.uri = pathPrefix + dataSource.uri;
                    } else {
                        dataSource.uri = dataSource.uri.substring(1);
                    }
                }
                log.info(`dataSource.uri now: ${dataSource.uri}`);
            } else {
                log.warn("dataSource.uri attribute in the manifest.json file was not found");
            }
        }
    } else {
        log.warn("dataSource section in the manifest.json file was not found");
    }
}
