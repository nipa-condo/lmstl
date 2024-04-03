import { Button, Result } from "antd";
import { useContext } from "react";
import { useRouteError, Link } from "react-router-dom";
import { AuthContext } from "./components/contexts/AuthContext";

export default function ErrorPage() {
  const error = useRouteError() as any;
  console.log({ error });
  // const { user } = useContext(AuthContext)
  return (
    <div id="error-page">
      {/* <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p> */}

      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link to="/home">
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    </div>
  );
}
