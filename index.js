var parseString = require("xml2js").parseString;
const cheerio = require("cheerio");
fs = require("fs");

async function main() {
  const source = "https://berita.murungrayakab.go.id/feed/";
  const dataXML = await fetch(source).then((resp) => resp.text());

  let dataJSON;

  parseString(dataXML, function (err, result) {
    dataJSON = result;
  });

  const item = dataJSON.rss.channel[0].item;

  let listImgSrc = [];

  const arrContent = item.map((i) => {
    const joinText = i["content:encoded"].join();
    const loadHtml = cheerio.load(joinText, null, false);
    const images = loadHtml("img");

    const sementara = [];

    images.each(function (i, elem) {
      sementara.push(elem.attribs.src);
    });

    listImgSrc = [...listImgSrc, ...sementara];

    return sementara;
  });

  console.log(listImgSrc);
  console.log(listImgSrc.length);

  fs.writeFile("./img.txt", JSON.stringify(listImgSrc), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Output saved to /img.txt");
    }
  });
}

main();
