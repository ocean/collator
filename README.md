# Higgins

Higgins gets the news, and looks after it until it is required.

This server listens on specific URLs for news feeds. When a feed is requested, it checks for cached news (using [pantry](https://github.com/postmedia/pantry)) then delivers it as JSON, fetching beforehand if required.

The cached news can be refreshed with another query.

Valid URL arguments are, in order:

	http://[server]/v1/[feed-name]/[clear-cache]

* **Feed name**: required.
* **Clear cache**: optional.

## Usage

Give me the Ministerial Media Statements:

	curl http://[server]/v1/ministerials

Clear the cache for the Commerce Media Releases:

	curl http://[server]/v1/commerce-media/clear-cache

## TODO

* Add JSONP capability.
* Add caching of search results into Memcached.
* Other nice things.

## License

This news tool is released under the MIT License (see the [license](https://github.com/ocean/higgins/blob/master/LICENSE) file) and is copyright Drew Robinson, 2015.
