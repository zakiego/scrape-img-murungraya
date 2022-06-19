import { parseString } from "xml2js";
import cheerio from "cheerio";
import fs from "fs";
import fetch from "node-fetch";

async function main() {
  const source = "https://berita.murungrayakab.go.id/feed/";
  const dataXML = await fetch(source).then((resp) => resp.text());

  let dataJSON;

  parseString(dataXML, function (err, result) {
    dataJSON = result;
  });

  const item = dataJSON.rss.channel[0].item;

  let listImgSrc = [];

  let id = 0;

  const arrContent = item.map((i) => {
    const title = i["title"][0];
    const link = i["link"][0];

    const joinText = i["content:encoded"].join();
    const loadHtml = cheerio.load(joinText, null, false);
    const images = loadHtml("img");

    const sementara = [];

    images.each(function (i, elem) {
      sementara.push(elem.attribs.src);
    });

    listImgSrc = [...listImgSrc, { id, title, link, images: sementara }];

    id = id + 1;

    return sementara;
  });

  console.log(listImgSrc);
  console.log(listImgSrc.length);

  fs.writeFile("./img.json", JSON.stringify(listImgSrc), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Output saved to /img.json");
    }
  });
}

main();
