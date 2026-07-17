import { useId } from "react";

export type SearchBoxProps = {
  mode?: "inline";
  label?: string;
  placeholder?: string;
};

export function SearchBox({
  label = "Search Syrtag",
  placeholder = "e.g. teacher identity",
}: SearchBoxProps) {
  const reactId = useId();
  const inputId = `${reactId}-search-query`;
  const formClassName = "search-box search-box--inline search-box__inline-form";

  return <form action="/search" className={formClassName}>
    <label className="search-box__label" htmlFor={inputId}>{label}</label>
    <input id={inputId} name="q" type="search" placeholder={placeholder} required />
    <button type="submit">Search</button>
  </form>;
}
