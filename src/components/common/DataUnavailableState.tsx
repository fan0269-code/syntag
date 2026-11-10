import Link from "next/link";

export function DataUnavailableState({
  title = "Data temporarily unavailable",
  description = "Please try again shortly. You can still return to the homepage or read about the project.",
  indexHref = "/theories",
  indexLabel = "Browse theories",
}: {
  title?: string;
  description?: string;
  indexHref?: string;
  indexLabel?: string;
}) {
  return (
    <section className="route-notice" role="status">
      <h1>{title}</h1>
      <p>{description}</p>
      <p>
        <Link href="/">Return to the homepage</Link>
        {" · "}
        <Link href={indexHref}>{indexLabel}</Link>
        {" · "}
        <Link href="/about">About Syrtag</Link>
      </p>
    </section>
  );
}
