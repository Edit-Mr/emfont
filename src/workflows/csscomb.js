/** @format */

import Comb from "csscomb";

const config = Comb.getConfig("yandex");
delete config["sort-order"];
const comb = new Comb(config);
comb.processPath("./static/css");
