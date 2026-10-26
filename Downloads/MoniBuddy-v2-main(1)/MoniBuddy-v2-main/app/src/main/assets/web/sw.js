/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "pwa-maskable-512x512.png",
    "revision": "daac23cf3e1d6b96151c676bb6b05aad"
  }, {
    "url": "pwa-512x512.png",
    "revision": "8e51dc29feb2de3685a5b2bbec7d2ad2"
  }, {
    "url": "pwa-192x192.png",
    "revision": "46bbb3d3ce3bd8f9d8dc4e27bcdc6889"
  }, {
    "url": "index.html",
    "revision": "cac79ce6c53ecec1561549928949065a"
  }, {
    "url": "icon.svg",
    "revision": "0570f8a1dd07faace402c96f11574792"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "445e70e3c12c2074f654a981a51a9f18"
  }, {
    "url": "assets/workbox-window.prod.es5-Bd17z0YL.js",
    "revision": null
  }, {
    "url": "assets/plus-jakarta-sans-vietnamese-wght-normal-qRpaaN48.woff2",
    "revision": null
  }, {
    "url": "assets/plus-jakarta-sans-latin-wght-normal-eXO_dkmS.woff2",
    "revision": null
  }, {
    "url": "assets/plus-jakarta-sans-latin-ext-wght-normal-DmpS2jIq.woff2",
    "revision": null
  }, {
    "url": "assets/jetbrains-mono-vietnamese-wght-normal-Bt-aOZkq.woff2",
    "revision": null
  }, {
    "url": "assets/jetbrains-mono-latin-wght-normal-B9CIFXIH.woff2",
    "revision": null
  }, {
    "url": "assets/jetbrains-mono-latin-ext-wght-normal-DBQx-q_a.woff2",
    "revision": null
  }, {
    "url": "assets/jetbrains-mono-greek-wght-normal-Bw9x6K1M.woff2",
    "revision": null
  }, {
    "url": "assets/jetbrains-mono-cyrillic-wght-normal-D73BlboJ.woff2",
    "revision": null
  }, {
    "url": "assets/index-SuQIp6aY.js",
    "revision": null
  }, {
    "url": "assets/index-Drcwy_pU.css",
    "revision": null
  }, {
    "url": "assets/copy-CfCD8FXB.js",
    "revision": null
  }, {
    "url": "assets/circle-check-hKCfCurV.js",
    "revision": null
  }, {
    "url": "assets/TechnicalBrief-hns8zyaj.js",
    "revision": null
  }, {
    "url": "assets/Sync2G-BQaJY9p9.js",
    "revision": null
  }, {
    "url": "assets/ScamGuard-DNjTySMQ.js",
    "revision": null
  }, {
    "url": "assets/PrivacyLegal-DID1hTzI.js",
    "revision": null
  }, {
    "url": "assets/IncomeExpenses-BJ1Z0_AY.js",
    "revision": null
  }, {
    "url": "assets/BufferCredit-DQcL8oB8.js",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "445e70e3c12c2074f654a981a51a9f18"
  }, {
    "url": "icon.svg",
    "revision": "0570f8a1dd07faace402c96f11574792"
  }, {
    "url": "pwa-192x192.png",
    "revision": "46bbb3d3ce3bd8f9d8dc4e27bcdc6889"
  }, {
    "url": "pwa-512x512.png",
    "revision": "8e51dc29feb2de3685a5b2bbec7d2ad2"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "daac23cf3e1d6b96151c676bb6b05aad"
  }, {
    "url": "manifest.webmanifest",
    "revision": "2632588610b164a688d6c361feb72f89"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/\/assets\/.*\.(wasm|js)$/i, new workbox.CacheFirst({
    "cacheName": "monibuddy-local-wasm-runtime-v1",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 15,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/([^/]+\.)?(huggingface\.co|hf\.co|jsdelivr\.net)\/.*/i, new workbox.CacheFirst({
    "cacheName": "monibuddy-wasm-voice-pack-v1",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 40,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
