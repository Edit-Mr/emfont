<!-- @format -->

# [emfont](https://font.emtech.cc)

免費的繁體中文 Web Font 服務。目前處於測試階段，還有很多功能沒做。歡迎使用並回報問題。

> 此專案目前還在很初期的開發階段，若對這個項目興趣歡迎加入 Telegram 群。
> 
> [![Telegram](https://img.shields.io/badge/-Telegram-169BD7?style=flat-square&logo=Telegram&logoColor=white)](https://t.me/emfont) 

## 特點

-   **免費**：完全免費，無需註冊。
-   **簡單**：只需一行程式碼即可完成引入。
-   **快速**：字體壓縮為 `.woff`，載入速度快。
-   **智能**：只載入需要的字體，節省流量。
-   **開源**：採用 Apache-2.0 授權。

## 使用方法

### 動態載入字體

在 HTML 中加入以下程式碼：

```html
<script src="https://font.emtech.cc/emfont.min.js"></script>
```

並為需要套用字體的元素加上 `emfont` 類別：

```html
<p class="emfont-jfopenhuninn">
    這是一個使用 emfont 的範例，這個段落使用了 jf-openhuninn-2.0 字型。
</p>
```

這樣字型就載入完成了，只有加上 `emfont` 類別的元素內的文字才會生成在字體中。你可以使用 CSS 來設定字體。

```css
.emfont-jfopenhuninn {
    font-family: "JF Open Huninn", sans-serif;
}
```

## 靜態載入字體

雖然使用動態載入字體的方法很簡單，且同樣文字並不會重新生成，但是每次都會需要多提交一次請求。因此如果網站內容不常更新，可於 JS 控制台中找到靜態字體檔案連結，直接引入到網站中，或是下載字體檔案後放到自己的伺服器上。

```css
@font-face {
    font-family: "JF Open Huninn";
    src: url("https://font.emtech.cc/f/g6VAMcqZoW/jf-openhuninn-2.0.woff") format("woff");
}
```

## 字體列表

> 此列表由 GitHub Action 自動更新。

<!-- fonts table start -->
<!-- fonts table end -->




## 範例

<https://font.emtech.cc/example.html>
