import { Injectable } from "@nestjs/common";
import * as cheerio from "cheerio";
import * as getUrls from "get-urls";
import * as fetch from "node-fetch";

@Injectable()
export class AppService {
	getLinkPreviews(text: string) {
		return this.scrapeMetaTags(text);
	}

	private scrapeMetaTags(text: string) {
		const urls = Array.from(getUrls(text));
		const requests = urls.map(async url => {
			const res = await fetch(url);
			const html = await res.text();
			const $ = cheerio.load(html);

			const getMetatag = name => {
				return (
					$(`meta[name=${name}]`).attr("content") ||
					$(`meta[property='og:${name}']`).attr("content") ||
					$(`meta[property='twitter:${name}']`).attr("content")
				);
			};

			return {
				url,
				title: getMetatag("title") || $("head title").text(),
				favicon: $(`link[rel="shortcut icon"]`).attr("href"),
				description: getMetatag("description"),
				image: getMetatag("image"),
				author: getMetatag("author"),
				type: getMetatag("type"),
				creator: getMetatag("creator"),
				charset: getMetatag("charset"),
				keywords: getMetatag("keywords")
			};
		});

		return Promise.all(requests);
	}
}
