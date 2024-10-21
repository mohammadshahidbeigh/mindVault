// main.tsx
import "symbol-observable";
import {StrictMode, useState} from "react";
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
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {Brightness4, Brightness7} from "@mui/icons-material";

// Create an Apollo Link to set the authorization header
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("jwtToken"); // Assuming the token is stored in localStorage
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
    new HttpLink({uri: "http://43.205.10.7:4000"}), // Replace with your GraphQL API URL
  ]),
  cache: new InMemoryCache(),
});

// eslint-disable-next-line react-refresh/only-export-components
const Main = () => {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const customTheme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{vertical: "top", horizontal: "right"}}
          >
            <ApolloProvider client={client}>
              <ThemeProvider theme={customTheme}>
                <CssBaseline />
                {!isMobile && (
                  <IconButton
                    sx={{position: "fixed", top: 16, right: 16}}
                    onClick={toggleDarkMode}
                    color="inherit"
                  >
                    {darkMode ? <Brightness7 /> : <Brightness4 />}
                  </IconButton>
                )}
                <App />
              </ThemeProvider>
            </ApolloProvider>
          </SnackbarProvider>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
};

createRoot(document.getElementById("root")!).render(<Main />);
