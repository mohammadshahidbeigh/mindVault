import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App.tsx";
import {Provider} from "react-redux";
import {store, persistor} from "./store/index.ts";
import {PersistGate} from "redux-persist/integration/react";
import {SnackbarProvider} from "notistack";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{vertical: "top", horizontal: "right"}}
        >
          <App />
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
