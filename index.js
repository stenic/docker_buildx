const core = require('@actions/core');
const os = require('os');
const child_process = require('child_process');

async function docker_buildx() {
    try {
        core.info('Checking platform')
        checkPlatform();
        core.info('Cloning action')
        cloneMyself();
        const imageName = extractInput('imageName', true);
        await executeShellScript('install_buildx');
        const imageTag = extractInput('tag', false, 'latest');
        const dockerFile = extractInput('dockerFile', false, 'Dockerfile');
        const publish = extractInput('publish', false, 'false').toLowerCase() === 'true';
        const load = extractInput('load', false, 'false').toLowerCase() === 'true';
        const platform = extractInput('platform', false, 'linux/amd64,linux/arm64,linux/arm/v7');
        const buildArg = extractInput('buildArg', false, '');
        const target = extractInput('target', false, '');
        const context = extractInput('context', false, '.');
        core.info(`Running ${publish ? 'buildAndPublish' : 'buildOnly'}`)
        const buildFunction = publish ? buildAndPublish : buildOnly;
        await buildFunction(platform, imageName, imageTag, dockerFile, buildArg, load, context, target);
        cleanMyself();
    } catch (error) {
        core.setFailed(error.message);
    }
}

function checkPlatform() {
    if (os.platform() !== 'linux') {
        throw new Error('Only supported on linux platform');
    }
}

function extractInput(inputName, required, defaultValue) {
    const inputValue = core.getInput(inputName);
    if (required) checkRequiredInput(inputName, inputValue);
    return inputValue ? inputValue : defaultValue;
}

function checkRequiredInput(inputName, inputValue) {
    if (!inputValue) {
        throw new Error(`The parameter ${inputName} is missing`);
    }
}

async function executeShellScript(scriptName, ...parameters) {
    parameters = (parameters || []).join(' ');
    const command = `docker_buildx/scripts/${scriptName}.sh ${parameters}`;
    child_process.execSync(command, { stdio: 'inherit' });
}

async function buildAndPublish(platform, imageName, imageTag, dockerFile, buildArg, load, context, target) {
    const dockerUser = extractInput('dockerUser', false, extractInput('dockerHubUser', false));
    checkRequiredInput('dockerUser (or dockerHubUser)', dockerUser);
    const dockerPassword = extractInput('dockerPassword', false, extractInput('dockerHubPassword', false));
    checkRequiredInput('dockerPassword (or dockerHubPassword)', dockerPassword);
    const dockerServer = extractInput('dockerServer', false, '');

    await executeShellScript('docker_login', dockerUser, dockerPassword, dockerServer);
    await executeShellScript('docker_build', platform, imageName, imageTag, dockerFile, true, buildArg, load, context, target);
}

async function buildOnly(platform, imageName, imageTag, dockerFile, buildArg, load, context, target) {
    await executeShellScript('docker_build', platform, imageName, imageTag, dockerFile, false, buildArg, load, context, target);
}

function cloneMyself() {
    // TODO revert to:
    // child_process.execSync(`git clone https://github.com/ilteoood/docker_buildx`);
    child_process.execSync(`git clone -b any-server https://github.com/stenic/docker_buildx`);
}

function cleanMyself() {
    child_process.execSync(`rm -rf docker_buildx`);
}

docker_buildx();