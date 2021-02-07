/**
 * istemciyi de başlatmak için son parametre true olmalı.
 * aksi halde sadece http2 web sunucusunu çalıştırır ve istekleri bekler
 *
 *   node insecure-http2-server-and-client.js true
 *
 * */
const istemciyiCalistir = process.argv[2] == "true";

const http2 = require("http2");
//------------------------------------------------ Sunucu
const server = http2.createServer();

let hostname = "127.0.0.1", //"192.168.99.1",
  portHttp = 60000;

server.on("stream", (stream, requestHeaders) => {
  const url = `${requestHeaders[":method"]} ${requestHeaders[":scheme"]}://${requestHeaders[":authority"]}${requestHeaders[":path"]}`;
  console.log(`${new Date()} >> [Sunucu] - (İstek yapıldı) : `, url);
  const gezegenler = require("./gezegenler");
  let index = Math.floor(Math.random() * 10) % gezegenler.length;

  stream.respond({
    ":status": 200,
    "content-type": "text/plain; charset=utf-8",
  });
  stream.write(`hello ${gezegenler[index]}`);
  stream.end(` - ${new Date()}`);
});
server.listen(portHttp, hostname, () => {
  console.log(
    `\n****** http2 Web sunucu http://${hostname}:${portHttp} adresinden yayındadır ****\n`
  );
});

//------------------------------------------------ istemci

if (istemciyiCalistir) {
  const client = http2.connect(`http://${hostname}:${portHttp}`);
  const req = client.request({ ":method": "GET", ":path": "/" });

  req.on("response", (responseHeaders) => {
    // do something with the headers
    console.log(
      `${new Date()} >> [İstemci] - (on.response) :`,
      responseHeaders
    );
  });

  req.on("data", (chunk) => {
    // do something with the data
    console.log(`${new Date()} >> [İstemci] - (on.data) : ${chunk}`);
  });

  req.on("end", () => {
    console.log(`${new Date()} >> [İstemci] - (on.end)`);
    client.destroy();
  });
}
