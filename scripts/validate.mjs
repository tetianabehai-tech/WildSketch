import fs from "node:fs/promises";
import path from "node:path";
import { HtmlValidate } from "html-validate";
import * as cssTree from "css-tree";
async function compose(file) {
  let html = await fs.readFile(file, "utf8");
  for (const match of [...html.matchAll(/<load src="([^"]+)"\s*\/>/g)])
    html = html.replace(
      match[0],
      await compose(path.resolve(path.dirname(file), match[1])),
    );
  return html;
}
const validator = new HtmlValidate(
  JSON.parse(await fs.readFile(".htmlvalidate.json", "utf8")),
);
const html = await compose("src/index.html");
const report = await validator.validateString(html, "src/index.html");
if (!report.valid) {
  for (const result of report.results)
    for (const message of result.messages)
      console.error(`${message.line}:${message.column} ${message.message}`);
  process.exitCode = 1;
} else console.log("PASS composed HTML (all partials)");
for (const name of (await fs.readdir("src/css")).filter((name) =>
  name.endsWith(".css"),
)) {
  const css = await fs.readFile("src/css/" + name, "utf8");
  const ast = cssTree.parse(css, {
    positions: true,
    onParseError(error) {
      throw error;
    },
  });
  cssTree.walk(ast, {
    visit: "Declaration",
    enter(node) {
      if (
        node.property.startsWith("-") ||
        cssTree.generate(node.value).includes("var(")
      )
        return;
      const result = cssTree.lexer.matchProperty(node.property, node.value);
      if (result.error) throw Error(name + ": " + result.error.message);
    },
  });
}
console.log("PASS CSS syntax and declaration values (all stylesheets)");
const images = new Set(
  [...html.matchAll(/\.\/img\/([\w@.-]+\.(?:webp|svg))/g)].map(
    (match) => match[1],
  ),
);
for (const name of images) await fs.access(path.join("src/img", name));
const sprite = await fs.readFile("src/img/sprite.svg", "utf8");
const ids = [...sprite.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
if (new Set(ids).size !== ids.length)
  throw Error("Duplicate IDs in SVG sprite");
console.log(
  `PASS ${images.size} referenced image files, favicon and unique sprite IDs`,
);
await fs.mkdir("qa", { recursive: true });
await fs.writeFile("qa/composed.html", html);
