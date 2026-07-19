import { expect, type ConsoleMessage, type Page, type Request, type Response } from "@playwright/test";

function isCancelledRscPrefetch(request: Request) {
  const requestUrl = new URL(request.url());
  const headers = request.headers();

  return request.method() === "GET"
    && requestUrl.searchParams.has("_rsc")
    && headers.rsc === "1"
    && headers["next-router-prefetch"] === "1"
    && request.failure()?.errorText === "net::ERR_ABORTED";
}

export function watchBrowserHealth(page: Page, baseURL: string | undefined) {
  const origin = new URL(baseURL ?? "http://127.0.0.1:3000").origin;
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  const failedRequests: string[] = [];
  const failedResponses: string[] = [];

  const onPageError = (error: Error) => {
    pageErrors.push(error.message);
  };
  const onConsole = (message: ConsoleMessage) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  };
  const onRequestFailed = (request: Request) => {
    const requestUrl = new URL(request.url());

    if (requestUrl.origin === origin && !isCancelledRscPrefetch(request)) {
      failedRequests.push(`${request.failure()?.errorText ?? "request failed"} ${requestUrl.pathname}${requestUrl.search}`);
    }
  };
  const onResponse = (response: Response) => {
    const responseUrl = new URL(response.url());
    if (responseUrl.origin === origin && response.status() >= 400) {
      failedResponses.push(`${response.status()} ${responseUrl.pathname}${responseUrl.search}`);
    }
  };

  page.on("pageerror", onPageError);
  page.on("console", onConsole);
  page.on("requestfailed", onRequestFailed);
  page.on("response", onResponse);

  return () => {
    page.off("pageerror", onPageError);
    page.off("console", onConsole);
    page.off("requestfailed", onRequestFailed);
    page.off("response", onResponse);

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
    expect(failedRequests).toEqual([]);
    expect(failedResponses).toEqual([]);
  };
}
