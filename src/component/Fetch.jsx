import { useEffect, useState } from "react";
import Home from "./Home";
import Browse from "./Browse";
import { useLocation } from "react-router-dom";
import Details from "./Details";

function Fetch() {
  const [book, setBook] = useState([]);
  const location = useLocation();

  async function getBooks(url, category, prefix) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.log(`${category} API Error: ${response.status}`);
        return [];
      }

      const data = await response.json();

      if (!data.items || !Array.isArray(data.items)) {
        console.log(`${category}: No books found`);
        return [];
      }

      return data.items.map((b, i) => ({
        id: prefix + i,
        title: b.volumeInfo?.title || "Unknown Title",
        author: b.volumeInfo?.authors?.[0] || "Unknown Author",
        cover:
          b.volumeInfo?.imageLinks?.thumbnail ||
          "https://via.placeholder.com/150x220?text=No+Cover",
        description:
          b.volumeInfo?.description || "No description available.",
        rating: b.volumeInfo?.averageRating || "No Rating",
        category: category,
      }));
    } catch (error) {
      console.log(`${category} Error:`, error);
      return [];
    }
  }

  async function getData() {
    try {
      const fiction = await getBooks(
        "https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=10",
        "Fiction",
        "f"
      );

      const nonFiction = await getBooks(
        "https://www.googleapis.com/books/v1/volumes?q=subject:nonfiction&maxResults=10",
        "Non-Fiction",
        "n"
      );

      const sciFiction = await getBooks(
        "https://www.googleapis.com/books/v1/volumes?q=subject:science-fiction&maxResults=10",
        "Sci-Fiction",
        "s"
      );

      const allBooks = [
        ...fiction,
        ...nonFiction,
        ...sciFiction,
      ];

      setBook(allBooks);

      console.log("Books loaded:", allBooks);
    } catch (error) {
      console.log("Book API Error:", error);
      setBook([]);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {location.pathname === "/" ? (
        <Home book={book} />
      ) : location.pathname.includes("/book/") ? (
        <Details book={book} />
      ) : (
        <Browse book={book} />
      )}
    </>
  );
}

export default Fetch;