/* eslint-disable */

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

let loading = true;

const ProtectedRoute = (WrappedComponent) => {
  return (props) => {
    const Router = useRouter();
    const { authenticated } = useSelector((state) => state.counter);
    // const [loading, setLoading] = useState(true);

    // console.log({ authenticated });

    useEffect(() => {
      const checkAuth = async () => {
        if (authenticated) {
          Router.replace("/");
        } else {
          Router.replace("");
        }
        // setLoading(false);
        loading = false;
      };
      checkAuth();
    }, [authenticated]);

    if (loading) return <h1>Loading...</h1>;
    return <WrappedComponent {...props} />;
  };
};

export default ProtectedRoute;
