
import { useEffect, useState, useCallback } from "react";

const Booklist = () => {
    const [books, setBooks] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchBooks = useCallback(async (url) => {
        setLoading(true);
        try {
            const response = await fetch(url);
            const data = await response.json();

            // Batch state updates for better performance
            setBooks(data.results);
            setNextPage(data.next);
            setPreviousPage(data.previous);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch on component mount
    useEffect(() => {
        fetchBooks('https://gutendex.com/books');
    }, [fetchBooks]);


    const setTowishlist = (book) => {
        const books = localStorage.getItem("books");
        if (!books) {
            localStorage.setItem("books", JSON.stringify([book]))

        }
        else {

            const newbooks = JSON.parse(books);
            const exists = newbooks.find(bookr => bookr.id === book.id) !== undefined
            if (exists) {
                console.log('y');
                alert('the book is already in the wishlist');
            }
            else {
                console.log('n');
                newbooks.push(book);
                localStorage.setItem("books", JSON.stringify(newbooks))
                console.log(JSON.parse(localStorage.getItem("books")));
                alert("the book is successfully added to wishlist")
            }
            

        }



    }

    return (
        <>
            <h1>Book List</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                books.map((book) => (
                    <div key={book.id}>
                        <h3>Book ID: {book.id}</h3>
                        <h4>Title: {book.title}</h4>
                        <p>Authors: {book.authors.map((author) => author.name).join(", ")}</p>
                        <button id={book.id} className="border-2" onClick={() => setTowishlist(book)}>save to wishlist</button>
                    </div>
                ))
            )}

            {/* Pagination Buttons */}
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={() => previousPage && fetchBooks(previousPage)}
                    disabled={!previousPage}
                    style={{ marginRight: "10px" }}
                >
                    Previous
                </button>

                <button
                    onClick={() => nextPage && fetchBooks(nextPage)}
                    disabled={!nextPage}
                >
                    Next
                </button>
            </div>
        </>
    );
};

export default Booklist;
