import * as core from '@actions/core';
import {join} from 'path';
import {env} from 'process';
import {promises} from 'fs';

function getInputs(): [package_path: string, append: object, set: object, remove: object] {
    const package_path = core.getInput('package-path');
    const append_str = core.getInput('append');
    const set_str = core.getInput('set');
    const remove_str = core.getInput('remove');
    return [package_path, JSON.parse(append_str), JSON.parse(set_str), JSON.parse(remove_str)];
}

async function checkRepository(package_path: string): Promise<void> {
    const dirs = await promises.readdir(join(env['GITHUB_WORKSPACE']!, package_path));
    if (dirs.findIndex(value => value === 'package.json') === -1) {
        throw new Error('Unable to find \"package.json\"');
    }
}

interface MyObject {
    [key: string]: any;
}

function getDefault(data: MyObject, elem: any, defaulty: any): any {
    if (elem in data) {
        return data[elem]
    }
    else {
        return defaulty;
    }
}

function packageJSON(packagejson: MyObject, append: MyObject, set: MyObject, remove: MyObject): void {
    for (const elem in packagejson) {
        if (typeof packagejson[elem] === 'object') {
            if (elem in append && typeof append[elem] !== 'object') {
                if (Array.isArray(packagejson[elem])) {
                    packagejson[elem].push(append[elem]);
                }
            }
            if (elem in set && typeof set[elem] !== 'object') {
                packagejson[elem] = set[elem];
            }
            let removeBool = false;
            if (elem in remove && typeof remove[elem] !== 'object') {
                delete packagejson[elem];
                removeBool = true;
            }
            if (!removeBool) {
                packageJSON(packagejson[elem], getDefault(append, elem, {}), getDefault(set, elem, {}), getDefault(remove, elem, {}));
            }
        }
        else {
            if (elem in append) {
                packagejson[elem] += append[elem];
            }
            if (elem in set) {
                packagejson[elem] = set[elem];
            }
            if (elem in remove) {
                delete packagejson[elem];
            }
        }
    }
}

async function modifyPackageJSON(package_path: string, append: object, set: object, remove: object): Promise<void> {
    const packagejson = JSON.parse(await promises.readFile(join(env['GITHUB_WORKSPACE']!, package_path, 'package.json'), {encoding: 'utf-8', flag: 'r'}));
    packageJSON(packagejson, append, set, remove);
    await promises.writeFile(join(env['GITHUB_WORKSPACE']!, package_path, 'package.json'), JSON.stringify(packagejson), {encoding: 'utf-8', flag: 'w'});
}

async function main(): Promise<void> {
    const [package_path, append, set, remove] = getInputs();
    await checkRepository(package_path)
    await modifyPackageJSON(package_path, append, set, remove);
}


main().catch((e) => {
    core.setFailed('Action failed with error: ' + e.message);
});
