/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRpmDependencies = void 0;
const child_process_1 = require("child_process");
const rpmDependencyScripts_1 = require("./linux-installer/rpm/rpmDependencyScripts");
function getRpmDependencies(buildDir) {
    // Get the files for which we want to find dependencies.
    const findResult = (0, child_process_1.spawnSync)('find', ['.', '-name', '*.node']);
    if (findResult.status) {
        console.error('Error finding files:');
        console.error(findResult.stderr.toString('utf-8'));
        return [];
    }
    // Filter the files and add on the Code binary.
    const files = findResult.stdout.toString('utf-8').split('\n').filter((file) => {
        return !file.includes('os.target') && file.includes('build/Release');
    });
    files.push(`${buildDir}/code-oss`);
    // Generate the dependencies.
    const dependencies = files.map((file) => (0, rpmDependencyScripts_1.calculatePackageDeps)(file));
    const mergedDependencies = (0, rpmDependencyScripts_1.mergePackageDeps)(dependencies);
    const sortedDependencies = [];
    for (const dependency in mergedDependencies) {
        sortedDependencies.push(dependency);
    }
    sortedDependencies.sort();
    return sortedDependencies;
}
exports.getRpmDependencies = getRpmDependencies;
