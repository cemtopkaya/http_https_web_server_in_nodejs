//-------------------------------------------- Sunucu
const http = require("http");

let hostname = "127.0.0.1", //"192.168.99.1",
  portHttp = 60000;

// ------------------------ HTTP ------------------------

var writeResponse = function (req, res) {
  const { headers, method, url } = req;
  console.log(
    `${new Date()} >> [Sunucu] - (İstek yapıldı) : ${method} ${
      headers.host
    }${url}`
  );
  const gezegenler = require("./gezegenler");
  let index = Math.floor(Math.random() * 10) % gezegenler.length;
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(`hello ${gezegenler[index]} - ${new Date()} `);
};

http.createServer(writeResponse).listen(portHttp, hostname, () => {
  console.log(`HTTP Server running at http://${hostname}:${portHttp}/`);
});

//------------------------------------------- istemci
const req = http
  .get(`http://${hostname}:${portHttp}`, (res) => {
    console.log("---- on response : ");

    let data = "";

    res.on("data", (d) => {
      data += d;
    });
    res.on("end", () => {
      console.log(`${new Date()} >> [İstemci] - (Gelen veri) : ${data}`);
    });
  })
  .end();
