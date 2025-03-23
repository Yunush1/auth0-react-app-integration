import React, {  useEffect, useState } from "react";
import React, {  useEffect, useState } from "react";
import { Button, Alert } from "reactstrap";
import Highlight from "../components/Highlight";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { getConfig } from "../config";
import usePermission from '../hooks/usePermission'


export const ExternalApiComponent = () => {

  const { apiOrigin, audience } = getConfig();
  const { hasPermission, role} = usePermission()
  const [state, setState] = useState({
    isLoading: false,
    showResult: false,
    apiMessage: "",
    error: null,
  });

  useEffect(()=>{
      if(!hasPermission){
        alert("Opps! You are not authorized")
        return ;
      }
  },[hasPermission])

  useEffect(()=>{
      if(!hasPermission){
        alert("Opps! You are not authorized")
        return ;
      }
  },[hasPermission])

  const { getAccessTokenSilently, loginWithPopup, getAccessTokenWithPopup } =
    useAuth0();

  const handleConsent = async () => {
    try {
      await getAccessTokenWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const handleLoginAgain = async () => {
    try {
      await loginWithPopup();
      setState({
        ...state,
        error: null,
      });
    } catch (error) {
      setState({
        ...state,
        error: error.error,
      });
    }

    await callApi();
  };

  const callApi = async (endPoint) => {
    try {

      setState({ isLoading: true })
      const accessToken = sessionStorage.getItem("accessToken")


      const token = accessToken === null ? await getAccessTokenSilently() : accessToken;
      if(!token){
        return setState({
          apiMessage:"Opps!, You are not assign any role for perform task"
        })
      }
      const response = await fetch(`${apiOrigin}/${endPoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = await response.json();

      setState({
        ...state,
        isLoading: false,
        showResult: true,
        apiMessage: responseData,
      });
    } catch (error) {
      setState({
        ...state,
        isLoading: false,
        showResult: true,
        error: error.error,
      });
    }
  };

  const handle = (e, fn) => {
    e.preventDefault();
    fn();
  };

  return (
    <>
      <div className="mb-5">
        {state.error === "consent_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleConsent)}
            >
              consent to get access to users api
            </a>
          </Alert>
        )}

        {state.error === "login_required" && (
          <Alert color="warning">
            You need to{" "}
            <a
              href="#/"
              class="alert-link"
              onClick={(e) => handle(e, handleLoginAgain)}
            >
              log in again
            </a>
          </Alert>
        )}

        <h1>You have <span style={{color:'red'}}>{role}</span> access</h1>
        <h1>You have <span style={{color:'red'}}>{role}</span> access</h1>
        <p className="lead">
          Ping an external API by clicking the button below.
        </p>

        <p>
          This will call a node.js API to sent email with token if it is running on local so port is 5000 that would have been started
          if you run <code>npm run dev</code>. An access token is sent as part
          of the request's `Authorization` header and the API will validate it
          using the API's audience value.
        </p>

        {!audience && (
          <Alert color="warning">
            <p>
              You can't call the API at the moment because your application does
              not have any configuration for <code>audience</code>, or it is
              using the default value of{" "}
              <code>&#123;yourApiIdentifier&#125;</code>. You might get this
              default value if you used the "Download Sample" feature of{" "}
              <a href="https://auth0.com/docs/quickstart/spa/react">
                the quickstart guide
              </a>
              , but have not set an API up in your Auth0 Tenant. You can find
              out more information on{" "}
              <a href="https://auth0.com/docs/api">setting up APIs</a> in the
              Auth0 Docs.
            </p>
            <p>
              The audience is the identifier of the API that you want to call
              (see{" "}
              <a href="https://auth0.com/docs/get-started/dashboard/tenant-settings#api-authorization-settings">
                API Authorization Settings
              </a>{" "}
              for more info).
            </p>

            <p>
              In this sample, you can configure the audience in a couple of
              ways:
            </p>
            <ul>
              <li>
                in the <code>src/index.js</code> file
              </li>
              <li>
                by specifying it in the <code>auth_config.json</code> file (see
                the <code>auth_config.json.example</code> file for an example of
                where it should go)
              </li>
            </ul>
            <p>
              Once you have configured the value for <code>audience</code>,
              please restart the app and try to use the "Ping API" button below.
            </p>
          </Alert>
        )}

       <div style={{display:'flex', gap:10}}>
       <Button
          color="primary"

          onClick={() => { callApi('auth/admin') }}
          disabled={!audience}
        >{ "Admin Send New Request"}
        </Button>
       <div style={{display:'flex', gap:10}}>
       <Button
          color="primary"

          onClick={() => { callApi('auth/admin') }}
          disabled={!audience}
        >{ "Admin Send New Request"}
        </Button>
        <Button
          color="primary"

          onClick={() => { callApi('auth/user') }}
          disabled={!audience}
        
        >{ "User Send New Request"}
        </Button>
       </div>
       {state.isLoading && <Alert color="loading" >Loading....</Alert>}
       </div>
       {state.isLoading && <Alert color="loading" >Loading....</Alert>}
      </div>

      <div className="result-block-container">
        {state.showResult && !state.isLoading && (
          <div className="result-block" data-testid="api-result">
            <h6 className="muted">Result</h6>
            <Highlight>
              <span>{JSON.stringify(state.apiMessage, null, 2)}</span>
            </Highlight>
          </div>
        )}
      </div>
    </>
  );
};
const RedirectingScreen = () => {
  const { loginWithRedirect } = useAuth0();
  useEffect(() => {
    loginWithRedirect();
}, [loginWithRedirect]); // Ensures `useEffect` runs only once

  return (
      <div style={styles.container}>
          <h2>🔐Wait for Auto get your login creadentials or Redirecting to Login...</h2>
          <p>Please wait while we authenticate you.</p>
      </div>
  );
};

// ✅ CSS for Spinner (Add in your CSS file)
const styles = {
  container: {
      textAlign: "center",
      marginTop: "50px",
      fontSize: "18px",
  },
  loadingContainer:{
    width:'20px',
    hight:'20px'
  }
};

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <RedirectingScreen />,
  onRedirecting: () => <RedirectingScreen />,
});
