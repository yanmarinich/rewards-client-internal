#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { AppStack } from './stack';

const { PR_NUMBER, APP_ENV } = process.env;
const appEnvironment = APP_ENV != undefined ? APP_ENV : "staging";

const stackName = () => {
    if (PR_NUMBER != undefined) {
        return `PR-${PR_NUMBER}-NetworkConnectStack`
    } else {
        return `${appEnvironment}-NetworkConnectStack`
    }
}

const app = new App();
new AppStack(app, stackName(), appEnvironment, PR_NUMBER);