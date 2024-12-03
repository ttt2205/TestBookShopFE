import { useRouteError } from "react-router-dom";

export default function ErrorPage({ children, otherError }) {
  // console.log(otherError);
  const routerError = useRouteError();
  let error = routerError || otherError;

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.message || error.statusText}</i>
      </p>
      {children}
    </div>
  );
}
