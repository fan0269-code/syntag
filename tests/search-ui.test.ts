import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const searchBox = readFileSync("src/components/search/SearchBox.tsx", "utf8");
const searchPage = readFileSync("src/app/search/page.tsx", "utf8");

test("SearchBox is a progressive inline search form with a stable homepage contract", () => {
  assert.match(searchBox, /export type SearchBoxProps\s*=/);
  assert.match(searchBox, /mode\?:\s*"inline"/);
  assert.match(searchBox, /label\?:\s*string/);
  assert.match(searchBox, /placeholder\?:\s*string/);
  assert.match(searchBox, /export function SearchBox/);
  assert.match(searchBox, /<form[\s\S]*action="\/search"[\s\S]*className=\{formClassName\}/);
  assert.match(searchBox, /<label[\s\S]*htmlFor=\{inputId\}[\s\S]*>\{label\}<\/label>/);
  assert.match(searchBox, /<input[\s\S]*id=\{inputId\}[\s\S]*name="q"[\s\S]*required/);
  assert.match(searchBox, /<button type="submit">Search<\/button>/);
});

test("SearchBox no longer ships unused dialog suggestion logic", () => {
  assert.doesNotMatch(searchBox, /role="dialog"/);
  assert.doesNotMatch(searchBox, /aria-modal/);
  assert.doesNotMatch(searchBox, /fetch\(`/);
  assert.doesNotMatch(searchBox, /Suggestion/);
  assert.doesNotMatch(searchBox, /useState/);
  assert.doesNotMatch(searchBox, /useRouter/);
  assert.doesNotMatch(searchBox, /graphFocusHref/);
});

test("search page keeps labelled query input and distinct recovery states", () => {
  assert.match(searchPage, /<label[\s\S]*htmlFor="search-page-query"/);
  assert.match(searchPage, /id="search-page-query"/);
  assert.match(searchPage, /name="q"/);
  assert.match(searchPage, /defaultValue=\{query\}/);
  assert.match(searchPage, /!query[\s\S]*Start with a research question/);
  assert.match(searchPage, /No matching published entities found\./);
  assert.match(searchPage, /Search is temporarily unavailable/);
  assert.match(searchPage, /href="\/topics"/);
  assert.match(searchPage, /href="\/theories"/);
  assert.match(searchPage, /href="\/#graph"/);
});
