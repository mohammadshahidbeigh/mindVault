import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App.tsx";
import {Provider} from "react-redux";
import {store, persistor} from "./store/index.ts";
import {PersistGate} from "redux-persist/integration/react";
import {SnackbarProvider} from "notistack";
import "./index.css";

import {ApolloClient, InMemoryCache, ApolloProvider} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql", // Replace with your GraphQL server URL
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
