HTTP ve HTTPS koşacak web sunucularını ayaklandıralım:
```
node index.js
```

Şimdi Wireshark açıp TCP iletişimini inceleyelim.
Önce curl ile bir HTTP isteği yapıyoruz ve Wireshark ile hareketleri izliyoruz:

## HTTP 1.x - Güvensiz

```
# node insecure-http-server-and-client.js
```

![image](https://user-images.githubusercontent.com/261946/107131971-54d8d880-68ec-11eb-8433-0be06b6c32cd.png)

Güvensiz bağlantı üstünde HTTP 1 standartı istek yapıyoruz. Wireshark bizim için doğrudan HTTP paketlerini ayrıştırıyor. Ancak HTTP2 isteklerinde bizim deşifre etmemiz gerekecek.

![image](https://user-images.githubusercontent.com/261946/107131865-8604d900-68eb-11eb-8f60-a82ef2a0eed4.png)


## HTTP 2.0 - Güvensiz

Güvensiz bağlantı üstünde HTTP 2 standartı istek yapıyoruz. İletişimi TCP paketleri olarak görüyoruz.

![image](https://user-images.githubusercontent.com/261946/107131096-cf9df580-68e4-11eb-8d12-53ad5c6daba9.png)

Bu hareketlerin Türkçe mealini aşağıdaki örnek trafik akışında görebiliyoruz:

![image](https://user-images.githubusercontent.com/261946/107131115-ee9c8780-68e4-11eb-9b26-c3fe51f69704.png)

Buradaki rakamların matematiği sayesinde hangi paketin ne kadar veri taşıdığı ve transfer edildiğini kolaylıkla görüp, 
noksan paketleri tespit edebiliyor oluşumuz (TCP'nin alameti farikası)

Bu paketler TCP verileri olup içerisinde çeşitli protokollerin verilerini taşımaktadırlar. Şimdiki örneğimizde HTTP2 verileri içeriyor olduğu için "Decode As" ile içeriğini dönüştürmemiz gerekiyor.

![wireshark_TCP_http2](https://user-images.githubusercontent.com/261946/107131349-7fc02e00-68e6-11eb-93ee-c6e7bd7a0921.gif)

Şimdi HTTP2 için tüm sürece bir daha bakalım ve paketlerin içeriğiyle birlikte isteğimizin sonucunu birlikte inceleyelim:

![wireshark_http2_decode](https://user-images.githubusercontent.com/261946/107132423-1218ff80-68f0-11eb-87c0-d9f43ee2dc81.gif)


Chrome ile HTTPS sunucu arasındaki trafikte 
pre-shared master key ssl-key.log dosyasında çözülür.

Buna göre trafikte bulunan TCP paketleri HTTP paketlerine
deşifre edilerek görüntülenir.

Ancak bu akış curl ile HTTPS sunucu arasında şifreleme 
yöntemlerinin transferinde AES gibi bir şifreleme yerine 
ECDHE gibi deşifrelenmesi imkansız bir yöntemle 
trafiğin başlatılmasına neden olabilir.

Ancak trafik bu kez Pre-shared Master key'in çözümlenememesi
ihtimaline karşın sunucunun kullandığı private key'in RSA key list
içinde tanımlanmasıyla çözümlenebilir.

![wireshark_https_decode](https://user-images.githubusercontent.com/261946/107133660-b94f6400-68fb-11eb-9407-61897e43355c.gif)

Kaynaklar:
- https://wiki.wireshark.org/TLS#Using_the_.28Pre.29-Master-Secret
- https://superuser.com/questions/1551263/wireshark-is-not-decrypting-tls-traffic-from-an-exe-file
- http://www.cncdesigner.com/wordpress/?p=6362
- https://superuser.com/questions/1023583/what-does-a-sequence-of-retransmissions-with-psh-ack-flags-mean-and-a-spurious
- https://osqa-ask.wireshark.org/questions/59621/psh-ack-fin-ack-psh-ack-rstack
- https://www.comparitech.com/net-admin/decrypt-ssl-with-wireshark/
- https://expeditedsecurity.com/blog/a-plus-node-js-ssl/
- https://packetpushers.net/using-wireshark-to-decode-ssltls-packets/
- https://unit42.paloaltonetworks.com/using-wireshark-display-filter-expressions/
- https://support.citrix.com/article/CTX135889#:~:text=Open%20the%20trace%20in%20Wireshark,the%20private%20key)%20in%20Wireshark.
- https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/
- https://www.cellstream.com/reference-reading/tipsandtricks/453-decrypthttps-wireshark
- https://www.youtube.com/watch?v=MQg48n9lV0s
- https://en.wikiversity.org/wiki/Wireshark/Start
- https://clcnetwork.wordpress.com/2020/05/03/ssh-tunneling-remote-wireshark/
- https://www.digitalocean.com/community/tutorials/how-to-route-web-traffic-securely-without-a-vpn-using-a-socks-tunnel