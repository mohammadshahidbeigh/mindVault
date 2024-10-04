import React from "react";
import {useParams, useLocation} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {GET_ITEM_BY_ID} from "../../graphql/queries";
import {Container, Typography, Box} from "@mui/material";

const DetailPage: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const location = useLocation();
  const type = new URLSearchParams(location.search).get("type");

  const {data, loading, error} = useQuery(GET_ITEM_BY_ID, {
    variables: {id},
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const item = data?.item;

  return (
    <Box sx={{flexGrow: 1, mt: 8, ml: {sm: 30}}}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{mb: 4}}>
          {item.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          by {item.author}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {item.description}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Type: {type}
        </Typography>
      </Container>
    </Box>
  );
};

export default DetailPage;
