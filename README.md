<!-- @format -->

# [emfont](https://font.emtech.cc)

免費的繁體中文 Web Font 服務。

> 如果你喜歡這個項目，認同我們的理念，歡迎在 GitHub 給我們 ⭐ 一顆星星，分享給你的朋友，或是留下你寶貴的意見。

![og](og.png)

<https://font.emtech.cc>

> 若對這個項目興趣歡迎加入 Telegram 群或 Discord 伺服器，一起討論與開發。
> 
> [![Telegram](https://img.shields.io/badge/-Telegram-169BD7?style=flat-square&logo=Telegram&logoColor=white)](https://t.me/emfont) 
> [![Discord](https://img.shields.io/badge/-Discord-7289DA?style=flat-square&logo=Discord&logoColor=white)](https://discord.gg/W8r9x4PwUE)

## 特點

-   **免費**：完全免費，無需註冊。
-   **簡單**：只需一行程式碼即可完成引入。
-   **快速**：字體壓縮為 `.woff`，載入速度快。
-   **智能**：只載入需要的字體，節省流量。
-   **開源**：採用 Apache-2.0 授權。

## 使用方法

> [!WARNING]
> This is  Work In Progress Project!
> Document contents may and will change over time as more features and components are added. 

```html
<p class="emfont-jfopenhuninn">
  這個段落使用了 jf-openhuninn-2.0 字型。
</p>
  
<script src="https://font.emtech.cc/emfont.min.js"></script>
  
<script>
  // 看你還有甚麼要做的
    document.addEventListener("DOMContentLoaded", function () {
      emfont.init(function() {
        console.log('所有字體載入完成!');
      });
    });
</script>
```

## 開發與部屬

1. 克隆儲存庫

emfont 有著濃厚的背景 (大概兩個月吧)，因此 clone 此 repo 時建議設定 `--depth 1`，以加快下載速度。

```bash
git clone --depth 1 https://github.com/Edit-Mr/emfont.git
```

2. 安裝依賴

emfont 使用 [Yarn](https://yarnpkg.com) 作為包管理器，因此需要先安裝 Yarn。

```bash
yarn
````

3. 設定環境變數

複製 `.env.example` 並命名為 `.env`，然後根據需要修改其中的變數。

```bash
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
SESSION_SECRET=your_session_secret
```

3. 下載字體

如果要下載字體的 submodule，可以使用以下指令：

```bash
git submodule update --init --remote
```

4. 開發

若有安裝 nodemon，可以使用以下指令啟動開發伺服器：

```bash
yarn dev
```

或是直接啟動開發伺服器：

```bash
node index.js
```


如果你只要前端，可以使用

```md
yarn front
```

## 字體列表

> 此列表由 GitHub Action 自動更新。

<!-- fonts table start -->
Font ID | 中文名稱 | 英文名稱 | 字體風格 | 字種 | Class | 版本 | 許可證 | 來源
--- | --- | --- | --- | --- | --- | --- | --- | ---
975HazyGoSC | 975 朦胧黑体 | 975 Hazy Go SC | normal | 200, 300, 400, 500, 600 | emfont-975HazyGoSC | v2.01 | OFL-1.1 | https://github.com/lxgw/975HazyGo
CEF-Fonts-CJK | 快去写作业CJK | CEF Fonts CJK | normal | 400 | emfont-gensenrounded | v2.16 | OFL-1.1 | https://github.com/Partyb0ssishere/cef-fonts-cjk 
CEF-Fonts-CJK-mono | 快去写作业CJK | CEF Fonts CJK | mono | 400 | emfont-gensenrounded-mono | v2.16 | OFL-1.1 | https://github.com/Partyb0ssishere/cef-fonts-cjk 
ChenYuLuoYan-Thin | 辰宇落雁體 | ChenYuLuoYan Thin | normal | 400 | emfont-ChenYuLuoYan-Thin | v1.0 | OFL-1.1 | https://github.com/Chenyu-otf/chenyuluoyan_thin
ChillBitmap7x | 寒蟬點陣體 | Chill-Bitmap | normal | 400 | emfont-ChillBitmap7x | v2.5000 | OFL-1.1 | https://github.com/Warren2060/ChillBitmap_7px
ChillRoundGothic | 寒蟬圓黑體 | ChillRoundGothic | normal | 100, 200, 300, 400, 500, 700, 900 | emfont-ChillRoundGothic | v3.750 | OFL-1.1 | https://github.com/Warren2060/ChillRoundGothic
Cubic11 | 俐方體11號 | Cubic11 | normal | 400 | emfont-Cubic11 | v1.100 | OFL-1.1 | https://github.com/ACh-K/Cubic-11
GenJyuuGothic | 源柔黑體 | GenJyuuGothic | normal | 400 | emfont-GenJyuuGothic | v1.0 | OFL-1.1 | 
GenRyuMin | 源流明體 | GenRyuMin | normal | 100, 200, 300, 400, 500, 600, 700 | emfont-GenRyuMin | v1.1501 | OFL-1.1 | https://github.com/ButTaiwan/genryu-font
GenSekiGothic | 源石黑體 | GenSekiGothic | normal | 300, 400, 500, 700, 900 | emfont-GenSekiGothic | v1.1501 | OFL-1.1 | https://github.com/ButTaiwan/genseki-font
GenSenRounded | 源泉圓體 | GenSenRounded | normal | 200, 300, 400, 500, 700, 900 | emfont-GenSenRounded | v1.1501 | OFL-1.1 | https://github.com/ButTaiwan/gensen-font/
GenWanMin | 源雲明體 | GenWanMin | normal | 200, 300, 400, 500, 600 | emfont-GenWanMin | v1.1501 | OFL-1.1 | https://github.com/ButTaiwan/genwan-font
GenYoGothic | 源樣黑體 | GenYoGothic | normal | 200, 300, 350, 400, 500, 700, 900 | emfont-GenYoGothic | v1.1501 | OFL-1.1 | https://github.com/ButTaiwan/genyog-font
GenYoMin | 源樣明體 | GenYoMin | normal | 200, 300, 400, 500, 600, 700, 900 | emfont-GenYoMin | v1.1501 | OFL-1.1 | https://github.com/ButTaiwan/genyo-font/
Iansui | 芫荽 | iansui | normal | 400 | emfont-Iansui | v1.1002 | OFL-1.1 | https://github.com/ButTaiwan/iansui
jfopenhuninn | jf open 粉圓 | JF Open Huninn | normal | 400 | emfont-jfopenhuninn | v2.0 | OFL-1.1 | https://github.com/justfont/open-huninn-font
LXGW-FasmartGothic | 霞鶩尚智黑 | LXGW Neo XiHei | normal | 400 | emfont-LXGW-FasmartGothic | v1.121 | IPA-1.0 | https://github.com/lxgw/LxgwNeoXiHei
LXGW-HeartSerif | 霞鶩銘心宋 | LXGW Neo XiHei | normal | 400 | emfont-LXGW-FasmartGothic | v0.921.1 | IPA-1.0 | https://github.com/lxgw/LxgwNeoXiHei
LXGW-MarkerGothic | 霞鶩標楷 | LXGW Marker Gothic  | normal | 400 | emfont-LXGW-FasmartGothic | v0.200 | OFL-1.1 | https://github.com/lxgw/LxgwMarkerGothic
LXGW-NeoXiHei | 霞鶩新晰黑 | LXGW Neo XiHei | normal | 400 | emfont-LXGW-NeoXiHei | v1.121 | IPA-1.0 | https://github.com/lxgw/LxgwNeoXiHei
LXGW-NeoZhiSong | 霞鶩新緻宋 | LXGW Neo ZhiSong | normal | 400 | emfont-LXGW-NeoZhiSong | v0.921 | IPA-1.0 | https://github.com/lxgw/LxgwNeoZhiSong
LXGW-Wenkai | 霞鶩文楷 | LXGW Wenkai | normal | 300, 400, 700 | emfont-LXGW-Wenkai | 1.330 | OFL-1.1 | https://github.com/lxgw/LxgwWenKai
LXGW-Wenkai-mono | 霞鶩文楷 | LXGW Wenkai | mono | 300, 400, 700 | emfont-LXGW-Wenkai-mono | 1.330 | OFL-1.1 | https://github.com/lxgw/LxgwWenKai
MisekiBitmap | 美積點陣體 | Miseki Bitmap | normal | 400 | emfont-MisekiBitmap | v1.13 | OFL-1.1 | https://github.com/ItMarki/MisekiBitmap
MuzaiPixel | 目哉像素 | Muzai Pixel | normal | 400 | emfont-MuzaiPixel | v1.0 | OFL-1.1 | https://github.com/DWNfonts/MuzaiPixel
NotoSansTC | 思源黑體 | Noto Sans TC | normal | 100, 300, 400, 500, 700, 900 | emfont-NotoSansTC | v2.004 | OFL-1.1 | https://github.com/google/fonts/tree/main/ofl/notosanstc
NotoSerifTC | 思源宋體 | Noto Serif TC | normal | 200, 300, 400, 500, 600, 700, 900 | emfont-NotoSerifTC | v1.001 | OFL-1.1 | https://fonts.google.com/noto/specimen/Noto+Serif+TC
PopGothicCJK-TC | 大波浪圓體 | Pop Gothic | normal | 400, 700 | emfont-PopGothicCJK-TC | v2.143 | OFL-1.1 | https://github.com/max32002/pop-gothic
Smiley-Sans | 得意黑 | Smiley Sans | normal | 400 | emfont-Smiley-Sans | v2.01 | OFL-1.1 | https://github.com/atelier-anchor/smiley-sans
TaipeiSansTCBeta | 台北黑體Beta | Taipei Sans TC Beta | normal | 300, 400, 700 | emfont-TaipeiSansTCBeta | v1.000 | OFL-1.1 | https://sites.google.com/view/jtfoundry/
Tiejili | 鐵蒺藜體 | Tiejili | normal | 400 | emfont-Tiejili | v1.100 | OFL-1.1 | https://github.com/Buernia/Tiejili
UnboundedSans | 無界黑 | Unbounded Sans | normal | 900 | emfont-UnboundedSans | v1.100 | OFL-1.1 | https://github.com/maoken-fonts/unbounded-sans
XiaoLaiSC | 小賴字體 | Xiaolai Font | normal | 400 | emfont-XiaoLaiSC | v3.110 | OFL-1.1 | https://github.com/lxgw/kose-font
XiaoLaiSC-mono | 小賴字體 | Xiaolai Font | mono | 400 | emfont-XiaoLaiSC-mono | v3.110 | OFL-1.1 | https://github.com/lxgw/kose-font
Yozai-Font | 悠哉字體 | Yozai Font | normal | 300, 400, 500, 700 | emfont-Yozai | v0.850 | OFL-1.1 | https://github.com/lxgw/yozai-font
ZhuQueFangSong | 朱雀仿宋 | Zhu Que | normal | 400 | emfont-ZhuQueFangSong | v0.108 | OFL-1.1 | https://github.com/TrionesType/zhuque
<!-- fonts table end -->
