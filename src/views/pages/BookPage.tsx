import React, {useEffect, useState} from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useQuery} from "@apollo/client";
import {GET_ITEMS} from "../../graphql/queries";

const BookPage: React.FC = () => {
  const navigate = useNavigate();
  const {data} = useQuery(GET_ITEMS);
  const [books, setBooks] = useState<
    {id: string; title: string; author: string; description: string}[]
  >([]);

  useEffect(() => {
    if (data) {
      const booksData = data.items.filter(
        (item: {
          id: string;
          title: string;
          author: string;
          description: string;
          type: string;
        }) => item.type === "Books"
      );
      setBooks(booksData);
    }
  }, [data]);

  const handleBookClick = (id: string) => {
    navigate(`/detail/${id}?type=book`);
  };

  return (
    <Box sx={{flexGrow: 1, mt: 8, ml: {sm: 30}}}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{mb: 4}}>
          Books ({books.length})
        </Typography>
        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card
                elevation={3}
                sx={{height: "100%", cursor: "pointer"}}
                onClick={() => handleBookClick(book.id)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {book.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    by {book.author}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default BookPage;
