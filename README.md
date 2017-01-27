# Collator

[![Travis CI Build Status](https://img.shields.io/travis/ocean/collator/master.svg?style=flat-square)](https://travis-ci.org/ocean/collator) [![David dependencies](https://img.shields.io/david/ocean/collator.svg?style=flat-square)](https://david-dm.org/ocean/collator) [![Coveralls coverage](https://img.shields.io/coveralls/ocean/collator/master.svg?style=flat-square)](https://coveralls.io/github/ocean/collator) [![Code Climate](https://codeclimate.com/github/ocean/collator/badges/gpa.svg)](https://codeclimate.com/github/ocean/collator)

Collator gets information, organises it and serves it up when required.

This server listens on specific URLs for requests for news feeds and other information. When a feed is requested, it checks for cached information then delivers it as JSON, fetching from the upstream URL beforehand if required.

Data is plain JSON by default. JSONP can be requested by adding a `?callback=yourCallbackFunctionNameHere` query parameter to the URL.

The cached news can be refreshed with another query.

Valid URL arguments are, in order:

	http://[server]/v1/[feed-name][?forceRefresh=true][&[callback=callbackName]]

* **Feed name**: required.
* **Force refresh**: optional.
* **Callback**: for JSONP requests, optional.

## Usage

Give me the Ministerial Media Statements feed:

	curl http://[server]/v1/ministerials

Force a fetch of a new copy of the Commerce Media Releases feed:

	curl http://[server]/v1/commerce-media?forceRefresh=true

## Test instance

A test instance of this app is running on [Heroku](https://heroku.com) at:

  https://collator-news.herokuapp.com/

## TODO

- [ ] Support GraphQL
- [ ] Build a Ministerials feed from the Media Statements website.
- [ ] Build a live train departure times feed from the Transperth website (with [x-ray](https://www.npmjs.com/package/x-ray)).
- [ ] Add a unified feed endpoint with sorting via query string parameters.
- [ ] Add caching of search results into Memcached (via Pantry's support).
- [ ] Supply other feeds.
- [x] Add JSONP capability.

## License

This information collator thingy is released under the Apache 2.0 License (see the [license](https://github.com/ocean/collator/blob/master/LICENSE) file) and is copyright Drew Robinson, 2017.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
