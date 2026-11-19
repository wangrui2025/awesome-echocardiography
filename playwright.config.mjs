import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./e2e',forbidOnly:!!process.env.CI, retries:0,workers:2,
  reporter:process.env.CI?[['github'],['html',{open:'never'}]]:'list',
  use:{baseURL:'http://127.0.0.1:4321',trace:'retain-on-failure'},
  projects:['chromium','webkit'].flatMap(browserName=>[
    {name:`${browserName}-desktop`,use:{browserName,viewport:{width:1440,height:900}}},
    {name:`${browserName}-mobile`,use:{browserName,viewport:{width:440,height:956},deviceScaleFactor:3}},
  ]),
  webServer:{command:'npm run preview -- --host 127.0.0.1 --port 4321',url:'http://127.0.0.1:4321',reuseExistingServer:false,timeout:60000},
});
