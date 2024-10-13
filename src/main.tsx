// main.tsx
import "symbol-observable";
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App.tsx";
import {Provider} from "react-redux";
import {store, persistor} from "./store/index.ts";
import {PersistGate} from "redux-persist/integration/react";
import {SnackbarProvider} from "notistack";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import "./index.css";

// Create an Apollo Link to set the authorization header
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("jwtToken"); // Assuming the token is stored in localStorage
  console.log("Retrieved token:", token); // Debugging log
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
    },
  });
  return forward(operation);
});

// Create the Apollo Client
const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    new HttpLink({uri: "http://localhost:4000/graphql"}), // Replace with your GraphQL API URL
  ]),
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{vertical: "top", horizontal: "right"}}
        >
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
