import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
// import AppRoutes from "app/AppRoutes";
// import { ME } from "app/queries";
import React from "react";
import { BrowserRouter } from "react-router-dom";

const Main = () => {
  // const { setUser } = useContext(AppContext);
  // const { data, loading, error } = useQuery<Query>(ME);
  // useEffect(() => {
  //   if (data && data.me) {
  //     setUser(data.me);
  //   }
  // }, [data]);
  return (
    <>
      {/*{loading || error ? (*/}
      {/*  <Typography>{error && "something is wrong"}</Typography>*/}
      {/*) : (*/}
      <BrowserRouter>
        {/*<Header />*/}
        <Container>
          <Box sx={{ my: 2 }}>
            hey
            {/*<AppRoutes />*/}
          </Box>
        </Container>
      </BrowserRouter>
      {/*)}*/}
    </>
  );
};

export default Main;
