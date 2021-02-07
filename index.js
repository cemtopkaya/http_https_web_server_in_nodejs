// Dosyayı index.js adıyla kaydedip, çalıştırmak için: "c:\> node index.js"

// HTTPS Server: https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/
/**
 * Sertifika oluşturma komutları

 > gizli anahtarı şifre ile oluşturuyoruz:
 $ openssl genrsa -passout pass:private_key_password -out key.pem

 > Sertifika istek dosyası oluşturuyoruz
 $ openssl req -new -key key.pem -out csr.pem

 > Herkese açık sertifikayı istek formu ve gizli anahtar ile oluşturuyoruz
 $ openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem

 > Sertifika istek dosyasını siliyoruz 
 $ rm csr.pem
 */
const https = require("https");
// HTTP Server: https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTP-server/
const http = require("http");
const fs = require("fs");
const { execSync } = require("child_process");

execSync(
  `openssl req -x509 -newkey rsa:2048 -sha256 -days 3650 -nodes -passout pass:"sifre123" -keyout key.pem -out cert.pem -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,DNS:www.localhost.com,IP:127.0.0.1"`
);

const public_key = `-----BEGIN CERTIFICATE-----
MIIDETCCAfkCFD41U1GvEWBU/ED8bLwJzexapQ/uMA0GCSqGSIb3DQEBCwUAMEUx
CzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRl
cm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMjEwMTE5MjIyNjI5WhcNNDgwNjA1MjIy
NjI5WjBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UE
CgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOC
AQ8AMIIBCgKCAQEAtwYlXGhedl3ZurN/P1+Z+iSByxiRNUhqOdQMfxDamJYHO+XL
BOR6PlOB9FZGNgO9sjReaRx2YNX6I92AouOkWD49Y6Z8CQ/4bm/F7K6Rqqjd0d2d
u1F5ZWMp31HTRYeN6adVLN2zxRSV6HurgC2QWUaLnsHYeGCUEIQnrrMFz49XsU2R
UA7wy16A+mjx7JnuKYNSvOb73Tnj9gS07IreEjQG+gk0l4fEkqmttIyd3ow86QkR
G52V4snCIcS3fHVpMW0WuFywtEEyYDgaqkqOK9cT1WUstSPjNG5QsdAFFMgAFUqg
aOxvfPKqzr0y6yGvqrpK3Dtrgg4TrtPfpfpNgQIDAQABMA0GCSqGSIb3DQEBCwUA
A4IBAQBkpnk4h0XwxFN/BbKP0pF4WHPBGAOB7SBaP+w9UntPzpAjYiXxuk5MrMmx
ez+S7qOyCjm+Y5JyPKg3ktY++5gOZWM0GBAh22gPdxRCOjXlo1gpmrXTxApXQESx
fSsMhnHxZJtDoO1D5EFCt2XsKi6bl+K0xRHJmLnpDjN9O0KPkfiLD6H+3fOBUK8q
oCbrHjEBaAekANVURLFeOqx6T0XmyQT6rEPz9wMBpZOh7DmT+RzZLB4Vvs7AYtW8
Osj69psCTpag5pHfbEIFovohcsydcliRiqRLSqwDyh22n3emCji4CeeK6Swn9rZL
gdcCtgI/c83+EdFC4ELzY2omnzHr
-----END CERTIFICATE-----
`;

const private_key = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAtwYlXGhedl3ZurN/P1+Z+iSByxiRNUhqOdQMfxDamJYHO+XL
BOR6PlOB9FZGNgO9sjReaRx2YNX6I92AouOkWD49Y6Z8CQ/4bm/F7K6Rqqjd0d2d
u1F5ZWMp31HTRYeN6adVLN2zxRSV6HurgC2QWUaLnsHYeGCUEIQnrrMFz49XsU2R
UA7wy16A+mjx7JnuKYNSvOb73Tnj9gS07IreEjQG+gk0l4fEkqmttIyd3ow86QkR
G52V4snCIcS3fHVpMW0WuFywtEEyYDgaqkqOK9cT1WUstSPjNG5QsdAFFMgAFUqg
aOxvfPKqzr0y6yGvqrpK3Dtrgg4TrtPfpfpNgQIDAQABAoIBAHzp8+vay8XrjeOw
CIP/Qr8H1ZIA5XJBR0bKo/DBVwBXPP6zelmPeqM5KXPSwj6xVPHgbiM9KsoyoHOE
BPync45KhGmTwgoJXVw6axJ7nq2kbSiEIdgr5je9c2GYniJRPxkefLKPaddzklDG
vylPb7qOvFIRKSYXfFa9a7v/MVMT8FKd4sPoqtD4Cirn+EvWPIbkkRuYTnrQeSrM
O1Tx0q+8ImgsXm1xi9UciLjARpb4l6c9/gJfXLlWTjBsD9Y6DvoX+3aDSBjfcs+4
4KA0mWwTvtrAykBc49Obuvl/kFxXj5XVXQus93UPVvdsbvE3AOHjceaY/3aD/h3x
b+w+yrUCgYEA7emMQowDp7ksGzxhrD220D+KEfpQzTBjFqAZWYp/gpVVTXYg4A93
3jIJpEpWZkp54pQFNNT3Bui4X+pw4RUhRG1RBL3BiAmn2weT35uSOb4FrQeXvLU4
dHFrbBK7zWl8eJM/fnJy1MtG/4/NUe0IV8XDmQs53NZ9rDWvAO0zHwMCgYEAxPBQ
uiGkMTN3se6SuHpE8bBYOfFSOn5BxwblCxm3qT9xOAi1NiLFMnRJ2v25v9PEELJD
FEblBFYB+qXYFHRg59Exh5XZDa+EmIjITwmKA0eELT3DyyqI8yVXUhc572gUlG3X
IA6DVsTikqvN7nqTmujnuTdrn0g6Fi3VOvMkCCsCgYAEbrZ7QuqKhGuq8jwLnna6
eISVAyngOMeP01nFjkwD3c5iDBJeuksMa7g8RFpJu5d7vjA+pL0ZdtqAhvilaORe
xv6cbQCfDTcAYKrDnr1hsAWhDKQqEuJDYR2UPOEc2ZtFD9E+BNnY1xSyjDZSEW13
XSrgvhHM6H4c6D8jcEfkiwKBgBLsKEWKH/WeRVzyWGSjUuaKFCAVINp/8SAHeJB1
eyEm+GDy7T5zXtE3PTVudZ+J4GfeSPW0ziJ5hR0pPDbS69C6V/D4I+/dsnbZha2a
dAlWoMucCKkHwDrklpxLoQRw0rFkUGxDGLmIl2CSY2oLmw0iXcl9GrkmPnaNFtTg
MdEbAoGAXxpYaG88jtvHUxcyycR8jJsaSCgjPEGXYUg9eEvQFa5cAZ1SpnaxQ3pS
rlk33QRnQvrKFuOXQ5VrOCBoGAD2XLz5fuDtPAMW6BZuVYjdtzaaPhldTv7W998F
f/c5KFLBWrHIIqIyAblBjPTupp+riZl6+I3CTDtxUcipz40lkdY=
-----END RSA PRIVATE KEY-----
`;

var writeResponse = function (req, res) {
  const gezegenler = require("./gezegenler");
  const { headers, method, url } = req;
  console.log(
    `${new Date()} >> İstek yapıldı : ${method} ${headers.host}${url}`
  );
  let index = Math.floor(Math.random() * 10) % 7;
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(`hello ${gezegenler[index]} - ${new Date()} `);
};

let hostname = "127.0.0.1", //"192.168.99.1",
  portHttp = 60000,
  portHttps = 60666;

// ------------------------ HTTP ------------------------
http.createServer(writeResponse).listen(portHttp, hostname, () => {
  console.log(`HTTP Server running at http://${hostname}:${portHttp}/`);
});

// ------------------------ HTTPS ------------------------
const options = {
  // key: private_key,
  key: fs.readFileSync("key.pem"),
  // cert: public_key,
  cert: fs.readFileSync("cert.pem"),
  ciphers: [
    // "ECDHE-RSA-AES128-SHA256",
    // "DHE-RSA-AES128-SHA256",
    /** 
     * Wireshark çözebilsin diye sadece bu şifrelemeyi 
     * sunucu tarafında faal bırakıyorum. İstemci 21 farklı şifreleme yapabileceğini söyleyecek
     * ancak sunucu sadece açıkta olanı istemcinin 21 şifreleme türü içinde görünce bununla devam
     * etmek isteyecek 
     */
    "AES128-GCM-SHA256",
    // "RC4",
    // "HIGH",
    // "!MD5",
    // "!aNULL",
  ].join(":"),
};
https.createServer(options, writeResponse).listen(portHttps, hostname, () => {
  console.log(`httpS Server running at httpS://${hostname}:${portHttps}/`);
});