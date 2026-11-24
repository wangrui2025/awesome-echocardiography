import { defineConfig } from '@playwright/test';
const port = Number(process.env.ECHO_TEST_PORT ?? 4321);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw Error('invalid test port');
const baseURL = 'http://127.0.0.1:' + port;
export default defineConfig({
  testDir:'./e2e',forbidOnly:!!process.env.CI, retries:0,workers:2,
  reporter:process.env.CI?[['github'],['html',{open:'never'}]]:'list',
  use:{baseURL,trace:'retain-on-failure'},
  projects:['chromium','webkit'].flatMap(browserName=>[
    {name:`${browserName}-desktop`,use:{browserName,viewport:{width:1440,height:900}}},
    {name:`${browserName}-mobile`,use:{browserName,viewport:{width:440,height:956},deviceScaleFactor:3,isMobile:true,hasTouch:true}},
  ]),
  webServer:{command:'npm run preview -- --host 127.0.0.1 --port ' + port,url:baseURL,reuseExistingServer:false,timeout:60000},
});
