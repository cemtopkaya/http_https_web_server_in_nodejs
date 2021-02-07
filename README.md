HTTP ve HTTPS koşacak web sunucularını ayaklandıralım:
```
node index.js
```

Şimdi Wireshark açıp TCP iletişimini inceleyelim.
Önce curl ile bir HTTP isteği yapıyoruz ve Wireshark ile hareketleri izliyoruz:


## TCP Üstünde Veri İletimi

- Bağlantı kurulur
- Veri iletilir
- Bağlantı kapatılır

![image](https://user-images.githubusercontent.com/261946/107140256-ea4a8b80-6931-11eb-8b81-2b2cefedd67d.png)

### **3 Way Handshake**

![image](https://user-images.githubusercontent.com/261946/107142606-4b2d9000-6941-11eb-80e5-4f4e75739fc3.png)

İlk 3 paket TCP bağlantısının kurulması için: 
- [3] İstemciden (65271 portu) sunucuya (60000 portuna) SYN paketi gider (Synchronization, iki tarafın da veri gönderebildiği bağlantı), 
- [4] Sunucudan (60000) istemciye (65271) "SYN paketini kabul ettim" (ACK: Acknowledge) paketi cevabı verilir
- [5] İstemci bağlantının kurulduğunu sunucuya ACK paketiyle döner


### **Veri Akışı (Data Flow)**

Sonraki 2 paket veri transferi için:

![image](https://user-images.githubusercontent.com/261946/107142647-71533000-6941-11eb-8bae-5958f652fc13.png)

- [6] Merhabalaşıp sunucu (60000 portundan) veri istemciye (65271'e) veri gönderir. Bu Wireshark'ın sunucudan akan veriyi HTTP paketi olarak deşifre edilmiş gösterecek. 
- [7] İstemciden "gönderdiğin veriyi kabul ettim (ACK paketi)" sunucuya  döner


### **Bağlantı bırakma**

TCP bağlantısı ya "ani" veya "sorunsuz" olarak kapatılır. Bu örnekte bağlantıyı "sorunsuz" olacak şekilde kapatıyoruz.

[TCP Connection Termination](https://www.geeksforgeeks.org/tcp-connection-termination/) 

#### **1. Ani bağlantı bırakma**

Bağlantıyı bir tarafın bir anda kapatması halidir.

#### **2. Sorunsuz bağlantı bırakma**

A Uç Noktası 
|    Açıklama                                            | A Ucu  | Akışın Yönü | B Ucu |      Açıklama                                |
| ----------------------------                           | ------ | ----------- | ----- | -----------------------------------------    |
| Bağlantıyı kapatmak istiyorum                          | FIN    | ->          |       |                                              |
|                                                        |        | <-          | ACK   | Paketini kabul ettim (Artık veri yazamazsın) |
|                                                        |        | <-          | FIN   | Bağlantıyı kapatmak istiyorum                |
| Sonlandırma isteğini aldım (Bağlantıyı kapatabilirsin) | ACK    | ->          |       |                                              |

![image](https://user-images.githubusercontent.com/261946/107139784-de10ff00-692e-11eb-991f-4377e240b410.png)

Artık bağlantıyı kapatma zamanı. 4 Yönlü kapanış seromonisi:

![image](https://user-images.githubusercontent.com/261946/107142705-c4c57e00-6941-11eb-9929-431129b80b1c.png)

- [8] Sunucu bağlantıyı sonlandırmak (FIN: Finalize) ister ve bunun için "ben bağlantıyı sonlandırdım artık veri göndermeyeceğim [FIN, ACK]" paketini istemciye gönderir
- [9] İstemci "sonlandırma isteğini kabul ettim [ACK]" diye sunucuya cevap döner. Artık sadece istemci veri gönderebilir
- [10] [FIN, ACK] ile istemciden sunucuya "ben bağlantıyı sonlandırmak istiyorum ve FIN,ACK paketinden sonra ben de bu bağlantı kanalına -sokete- veri yazamayacağım"mesajı gider 
- [11] Sunucu da artık soketi bu mesajla birlikte kapatmadan önce "kabul edildi" [ACK] mesajı gönderir

---

## HTTP 1.x - Güvensiz

```
# node insecure-http-server-and-client.js
```

![image](https://user-images.githubusercontent.com/261946/107131971-54d8d880-68ec-11eb-8433-0be06b6c32cd.png)

Güvensiz bağlantı üstünde HTTP 1 standartı istek yapıyoruz. Wireshark bizim için doğrudan HTTP paketlerini ayrıştırıyor. Ancak HTTP2 isteklerinde bizim deşifre etmemiz gerekecek.

![image](https://user-images.githubusercontent.com/261946/107131865-8604d900-68eb-11eb-8f60-a82ef2a0eed4.png)

---

## HTTP 2.0 - Güvensiz

[NodeJS Http/2](https://nodejs.org/api/http2.html)

HTTP2 Bağlantısını internet gezgini üstünden yaptığımızda HTTP 1.1 sürümüyle web sunucusuna istek yapılacak ancak web sunucusu doğrudan 2.0 ile cevap vereceği için yükseltme işlemi yapamayıp istek yanıtsız kalacak.

![image](https://user-images.githubusercontent.com/261946/107139107-a3589800-6929-11eb-88c5-578ec24b66d2.png)

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

---

## HTTPS Trafiğinin Wireshark İle İncelenmesi

2 Türlü HTTPS trafiğinin deşifre edilmesi mümkündür:
1. Pre-Master Secret Key
2. RSA Keys List

### Pre-Master Secret 

1. Windows Start> Environment Variables  (just start typing) - a System Properties dialogue will appear.
2. Click on the Environment Variables button (bottom right) - an Environment Variables dialogue appears.
3. On the top half of that dialogue (User Variables) - click New
4. An input box appears, in the Variable Name field enter: "SSLKEYLOGFILE"
5. In the Variable Value field enter a path to where you want to store the keys: "C:\keys\keys.log" as an example
6. Click on OK - you should see the new variable in the list.
7. Click on OK to close the Environment Variables dialogue.
8. Click on OK to close the System Properties dialogue.
9. Now Reboot.
10. Once rebooted, launch either Chrome or Firefox.
11. Open Wireshark and start a capture.
12. In Wireshark, go to Edit> Preferences> Protocols> TLS
13. In the Pre-Master Secret log filename box, browse to and select the file you created in Step 5.
14. Click OK and close the dialogue. 

###  RSA Keys List

Aşağıdaki şartları kontrol ediniz:
- Linux üstünde koşuyorsanız Wireshark uygulamasının Gnu-TLS ve GCrypt ile derlendiğinden emin olun. Windows işletim sisteminde bunu kontrol etmeniz gerekmiyor
- Wireshark'ı çalıştırdığınız makinede, sunucuda kullanılan public ve private anahtarlardan gizli anahtarın (private key) bulunması gerekiyor.
- Gizli anahtar (private key) ikili formatta olmayıp [Base64 ASCII](https://www.google.com/search?q=pem+format+base64&newwindow=1&sxsrf=ALeKk03BXsZiNIyzm_lu__05FhpTVzJbRQ:1612692207391&source=lnms&tbm=isch&sa=X&ved=2ahUKEwis5JzRwtfuAhWeCRAIHfpFALoQ_AUoAXoECBsQAw&biw=1920&bih=969#imgrc=O-zZc-6e0f_c_M) kodlamasıyla bulunuyor olmalı. `-----BEGIN PRIVATE KEY-----` Metnini barındırıyor olmalı.
- Bir sertifika sadece bir anahtarı değil, birden fazla anahtarı (gizli, açık, otorite sertifikaları vs.) barındırabilir. Bizim kullanacağımız gizli anahtar dosyasında sadece private key bulunmalı!
- Ben test için parola korumalı olmayan gizli anahtar kullanıyorum. Buna artık gerek kalmamış olabilir ben denemedim (RSA Key List içinde "password" değerini de giriyoruz).
- Veriyi şifrelerken RSA şifreleme kullanılmalı (DHE şifreleme aşağıda anlatılacağı üzere deşifre etmekte sıkıntı çıkarmakta)
- Diffie-Hellman Ephemeral (DHE/EDH) veya RSA Ephemeral şifrelemenin kullanılmadığından emin olun. Bunu önlemek için sunucu tarafında kullanılabilecek şifreleme yöntemlerini deşifrelemeye uygun olanlarla değiştirin.
```
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
```

![image](https://user-images.githubusercontent.com/261946/107143614-0278d580-6947-11eb-907a-c7c20b4131a1.png)

**IP Adres:** Verilerin şifresini çözmek için kullanılan özel anahtarı tutan ve sertifikayı sunan ana bilgisayarın IP adresi

**Port:** Verilerin şifresini çözmek için kullanılan özel anahtarı tutan ve sertifikayı sunan ana bilgisayarla iletişim kurmak için kullanılan hedef bağlantı noktası

**Protocol:** SSL/TLS ile şifrelenen üst katman protokolü, örneğin bir HTTPS web bağlantısı üzerinden şifrelenen protokol HTTP'dir

**Key File:** Sunucu sertifikasının özel anahtarının dosya yoludur.

**Password:** Varsa özel anahtar (Key File) dosyasını korumak için kullanılan parola

Eğer IP için 0.0.0.0 ve Port için 0 girilirse * karakteri anlamına gelir ve her veriyi deşifre etmede girilmiş olan özel anahtar kullanılır.

İsteğe bağlı olarak, şifre çözme ile ilgili herhangi bir sorunu tanılamanıza yardımcı olmak için yararlı bulabileceğiniz bir hata ayıklama dosyasının yolunu ve adını girin (TLS debug file). Bunun, yakalama dosyasının ilk yüklemesini yavaşlatabileceğini unutmayın.

Ardından yakalamayı açın ve tüm gereksinimleri karşıladıysanız, uygulama verilerinin şifrelenmemiş olduğunu görmelisiniz. Standart SSL/TLS bağlantı noktası kullanılmıyorsa, ilgili bir paket seçmeniz ve ardından Analyse > Decode As… öğesini tıklamanız ve ardından TLS'i seçmeniz gerekebilir.

---

### Deşifrelenmiş TLS Akışının Pre-Master-Key Dosyasının Oluşturulması

Bir kere sitenin sertifikalarına göre deşifreleme yapabildiyseniz "File -> Export TLS Session Keys" ile Master-Key bir dosyaya aktarabilirsiniz:

![image](https://user-images.githubusercontent.com/261946/107149556-3f09f880-696a-11eb-8907-9658585a2de9.png)

![image](https://user-images.githubusercontent.com/261946/107149585-71b3f100-696a-11eb-98a9-d67e6236179f.png)

Bu dosyayı başka bir Wireshark yüklü makinede "Edit -> Preferences -> Protocols -> TLS" penceresinde "Pre-Master-Secret log filename" alanına yazarak çözebilirsiniz.

![image](https://user-images.githubusercontent.com/261946/107149625-a7f17080-696a-11eb-84a4-f15c17650551.png)

Aşağıdaki TLS akışının debug dosyasına baktığımızda bulunmuş gizli anahtarın ihraç edilen "Pre Master Secret" dosyasında yer aldığını göreibliriz.

![image](https://user-images.githubusercontent.com/261946/107149455-bab77580-6969-11eb-854c-05ae7077a93c.png)


Chrome ile HTTPS sunucu arasındaki trafikte pre-master secret key ssl-key.log dosyasında çözülür.

Buna göre trafikte bulunan TCP paketleri HTTP paketlerine deşifre edilerek görüntülenir.

Ancak bu akış curl ile HTTPS sunucu arasında şifreleme yöntemlerinin transferinde AES gibi bir şifreleme yerine ECDHE gibi deşifrelenmesi imkansız bir yöntemle trafiğin başlatılmasına neden olabilir.

Ancak trafik bu kez Pre-shared Master key'in çözümlenememesi ihtimaline karşın sunucunun kullandığı private key'in RSA key list içinde tanımlanmasıyla çözümlenebilir.

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
- https://support.citrix.com/article/CTX135889
- https://www.cloudflare.com/learning/ssl/what-happens-in-a-tls-handshake/
- https://www.cellstream.com/reference-reading/tipsandtricks/453-decrypthttps-wireshark
- https://www.youtube.com/watch?v=MQg48n9lV0s
- https://en.wikiversity.org/wiki/Wireshark/Start
- https://clcnetwork.wordpress.com/2020/05/03/ssh-tunneling-remote-wireshark/
- https://www.digitalocean.com/community/tutorials/how-to-route-web-traffic-securely-without-a-vpn-using-a-socks-tunnel