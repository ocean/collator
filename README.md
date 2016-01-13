# Higgins

[![Travis CI Build Status](https://img.shields.io/travis/ocean/higgins/master.svg?style=flat-square)](https://travis-ci.org/ocean/higgins) [![David dependencies](https://img.shields.io/david/ocean/higgins.svg?style=flat-square)](https://david-dm.org/ocean/higgins) [![Coveralls coverage](https://img.shields.io/coveralls/ocean/higgins/master.svg?style=flat-square)](https://coveralls.io/github/ocean/higgins)

Higgins gets the news, and looks after it until it is required.

This server listens on specific URLs for news feeds. When a feed is requested, it checks for cached news (using [pantry](https://github.com/postmedia/pantry)) then delivers it as JSON, fetching beforehand if required.

The cached news can be refreshed with another query.

Valid URL arguments are, in order:

	http://[server]/v1/[feed-name][?forceRefresh=true]

* **Feed name**: required.
* **Force refresh**: optional.

## Usage

Give me the Ministerial Media Statements feed:

	curl http://[server]/v1/ministerials

Force a fetch of a new copy of the Commerce Media Releases feed:

	curl http://[server]/v1/commerce-media?forceRefresh=true

## TODO

* ~~Add JSONP capability.~~ done!
* Add caching of search results into Memcached.
* Other nice things.

## License

This news tool thingy is released under the MIT License (see the [license](https://github.com/ocean/higgins/blob/master/LICENSE) file) and is copyright Drew Robinson, 2015.
