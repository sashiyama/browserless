# browserless

The simplest and lightest image to run a proxy server for Chromium headless browser that can be used through `browserWSEndpoint` with Puppeteer

```shell
$ docker build -t browserless .
```

```shell
$ docker run --rm -p 80:80 browserless
```

```javascript
import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.connect({
    browserWSEndpoint: 'ws://localhost/chromium?token=xxxxx', // You can find the token in server.js but **you should change it if you want to utilize in production**
  });
  const page = await browser.newPage();
})();
```
