# Higgins

[![Travis CI Build Status](https://travis-ci.org/ocean/higgins.svg?branch=master)](https://travis-ci.org/ocean/higgins)

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
