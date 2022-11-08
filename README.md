# How Angular Universal (SSR) treats runtime errors

This project checks how `ngExpressEngine` from `@nguniversal/express-engine` exposes the errors from an angular SSR app to the ExpressJS. In particular, this project checks, if any uncaught exception during the SSR of the Angular app causes sending a `500` status response to the client. Technically speaking, the project checks what are the values of arguments (`err` and `html`) passed from `ngExpressEngine` to `callback(err, html)` (the rendering callback of ExpressJS).

### Observations
- Rejected promise passed to the `APP_INITIALIZER` causes sending `500` status response to the client, with a HTML being only the printed stacktrace of the error. It's because `ngExpressEngine` passes this rejection error as the argument `err` to the ExpressJS callback: `callback(err, html)`.

- RxJs error in the Observable passed to `APP_INITIALIZER` also causes `500` status response and the error stacktrace in the HTML, similar as above.

- But for any other runtime unhandled exceptions and errors (including Http errors from `HttpClient` or errors of kind "`'window' object is not defined`" ), the `200` status response is sent to the client, with the HTML being the normally rendered page. Obviously, this HTML might be malformed 😕

### Conclusions
- Beware that, by default any promise rejection in `APP_INITIALIZER` in your SSR app will result in **sending the rejection error stacktrace** to the client with status `500`. 

- Beware that, by default any http errors from the backend endpoints or runtime errors in your SSR app, will result in a fake "success" - sending the response status `200` with the rendered page to the client. Please note, that the output HTML may be malformed, because of those runtime errors. The http errors from http backend endpoints may result in not getting the crucial data to be displayed in final HTML output. Because of sending status code `200`, your CDN or end user won't notice any errors happened and may cache the malformed HTML.
## Install dependencies
```
yarn
```

## Run
```
yarn dev:ssr
```

## Test expected behavior:
Run one of those `curl` commands to trigger errors in different areas of the app:
```
curl http://localhost:4200/?errorIn=PromiseAppInitializer
```
```
curl http://localhost:4200/?errorIn=ObservableAppInitializer
```
```
curl http://localhost:4200/?errorIn=AppComponentConstructor
```
```
curl http://localhost:4200/?errorIn=AppComponentNgOnInit
```
```
curl http://localhost:4200/?errorIn=ChildComponentConstructor
```
```
curl http://localhost:4200/?errorIn=ChildComponentNgOnInit
```

When running those commands, please observe in the console of the SSR process the following:

```
customNgExpressEngine req.url: <<url of the requested page>>
```
and
```
customNgExpressEngine result: {
  err: ...,
  html: ...
}
```

In case of errors in `APP_INITIALIZER`, the `err` property will be present. In other cases, the `err` property will be `null`, but `html` will be present.