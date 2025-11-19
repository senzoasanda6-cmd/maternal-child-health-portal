import React, { useState } from "react";
import "./styles.css";

function Storytime() {
    const [searchTerm, setSearchTerm] = useState("");

    const publicDomainStoryBooks = [
        {
            title: "Alice’s Adventures in Wonderland",
            author: "Lewis Carroll",
            description:
                "A Victorian girl falls through a rabbit hole into a topsy-turvy world with beloved characters like the Mad Hatter and Cheshire Cat.",
            link: "https://www.gutenberg.org/ebooks/11",
            image: "/storybooks/Alices-adventures-in-wonderland-by-Lewis-Carroll-300x0.jpg.webp",
        },
        {
            title: "The Wonderful Wizard of Oz",
            author: "L. Frank Baum",
            description:
                "Dorothy’s iconic journey from Kansas to Oz, meeting Scarecrow, Tin Man, and Cowardly Lion.",
            link: "https://www.gutenberg.org/ebooks/55",
            image: "/storybooks/The-Wonderful-Wizard-of-Oz-300x0.jpg.webp",
        },
        {
            title: "Anne of Green Gables",
            author: "L. M. Montgomery",
            description:
                "The story of orphan Anne Shirley finding a home in Prince Edward Island.",
            link: "https://www.gutenberg.org/ebooks/45",
            image: "/storybooks/anne-of-green-gables-by-lm-montgomery-300x0.jpg.webp",
        },
        {
            title: "The Wind in the Willows",
            author: "Kenneth Grahame",
            description:
                "Adventures of anthropomorphic animals along an English riverbank, featuring Mr. Toad.",
            link: "https://www.gutenberg.org/ebooks/27805",
            image: "/storybooks/the-wind-in-the-willows-cover-300x0.jpg.webp",
        },
        {
            title: "Little Women",
            author: "Louisa May Alcott",
            description:
                "The March sisters navigate life, love, and dreams during the Civil War.",
            link: "https://www.gutenberg.org/ebooks/514",
            image: "/storybooks/Little-Women-1-300x0.jpg.webp",
        },
        {
            title: "Treasure Island",
            author: "Robert Louis Stevenson",
            description:
                "Jim Hawkins embarks on a pirate-filled treasure hunt.",
            link: "https://www.gutenberg.org/ebooks/120",
            image: "/storybooks/Treasure-Island-by-Robert-Louis-Stevenson-300x0.jpg.webp",
        },
        {
            title: "The Secret Garden",
            author: "Frances Hodgson Burnett",
            description:
                "Mary Lennox discovers a hidden garden and transforms her life.",
            link: "https://www.gutenberg.org/ebooks/113",
            image: "/storybooks/The-Secret-Garden-Frances-Hodgson-Burnett-300x0.jpg.webp",
        },
        {
            title: "Peter Pan",
            author: "J. M. Barrie",
            description:
                "Peter whisks the Darling children to Neverland, where kids never grow up.",
            link: "https://www.gutenberg.org/ebooks/16",
            image: "/storybooks/Peter-Pan-by-JM-Barrie-300x0.jpg.webp",
        },
        {
            title: "The Velveteen Rabbit",
            author: "Margery Williams",
            description:
                "A stuffed rabbit becomes real through the power of love.",
            link: "https://www.gutenberg.org/ebooks/11757",
            image: "/storybooks/The-Velveteen-Rabbit-Margery-Williams-300x0.png.webp",
        },
        {
            title: "The Tale of Peter Rabbit",
            author: "Beatrix Potter",
            description:
                "Mischievous Peter Rabbit’s adventures in Mr. McGregor’s garden.",
            link: "https://www.gutenberg.org/ebooks/14838",
            image: "/storybooks/tale-of-peter-rabbit-potter-cover-300x0.jpg.webp",
        },
        {
            title: "Grimm’s Fairy Tales",
            author: "Jacob & Wilhelm Grimm",
            description:
                "Includes Cinderella, Snow White, Hansel and Gretel, and more.",
            link: "https://www.gutenberg.org/ebooks/2591",
            image: "/storybooks/Grimms-Fairy-Tales-300x0.jpg.webp",
        },
        {
            title: "Fairy Tales",
            author: "Hans Christian Andersen",
            description:
                "Stories like The Little Mermaid, The Ugly Duckling, and The Snow Queen.",
            link: "https://www.gutenberg.org/ebooks/27200",
            image: "/storybooks/fairy-tales-300x0.jpg",
        },
        {
            title: "The Blue Fairy Book",
            author: "Andrew Lang",
            description:
                "Classic tales like Beauty and the Beast, Aladdin, and Sleeping Beauty.",
            link: "https://www.gutenberg.org/ebooks/503",
            image: "/storybooks/The-Blue-Fairy-Book-by-Andrew-Lang-300x0.jpg.webp",
        },
        {
            title: "East of the Sun and West of the Moon",
            author: "Peter Christen Asbjornsen",
            description: "Nordic tales including The Three Billy Goats Gruff.",
            link: "https://www.gutenberg.org/ebooks/30973",
            image: "/storybooks/east-of-the-sun-and-west-of-the-moon-300x0.jpg.webp",
        },
        {
            title: "Daddy-Long-Legs",
            author: "Jean Webster",
            description:
                "Orphan Jerusha Abbott writes letters to her mysterious benefactor.",
            link: "https://www.gutenberg.org/ebooks/157",
            image: "/storybooks/daddy-long-legs-300x0.jpg.webp",
        },
        {
            title: "The Five Little Peppers and How They Grew",
            author: "Margaret Sidney",
            description:
                "Heartwarming story of five siblings and their widowed mother.",
            link: "https://www.gutenberg.org/ebooks/684",
            image: "/storybooks/five-little-peppers-cover-300x0.jpg.webp",
        },
        {
            title: "Five Children and It",
            author: "E. Nesbit",
            description:
                "Siblings discover a sand fairy who grants wishes—with unexpected results.",
            link: "https://www.gutenberg.org/ebooks/172",
            image: "/storybooks/Nesbit-Five-Children-and-It-300x0.jpg.webp",
        },
        {
            title: "The School at the Chalet",
            author: "Elinor M. Brent-Dyer",
            description:
                "Madge Bettany opens a girls’ school in the Austrian Alps.",
            link: "https://www.gutenberg.org/ebooks/author/Brent-Dyer",
            image: "/storybooks/School-at-the-Chalet-Cover-300x0.jpg.webp",
        },
        {
            title: "The Knave of Hearts",
            author: "Louise Saunders",
            description:
                "A play-format story behind the nursery rhyme from Wonderland.",
            link: "https://www.gutenberg.org/ebooks/author/Saunders",
            image: "/storybooks/The-Knave-of-Hearts-Cover-300x0.jpg.webp",
        },
        {
            title: "A Gallery of Children",
            author: "A. A. Milne",
            description:
                "Short vignettes exploring childhood in the early 20th century.",
            link: "https://www.gutenberg.org/ebooks/author/Milne",
            image: "/storybooks/A-gallery-of-children-cover-300x0.jpg.webp",
        },
    ];

    const filteredBooks = publicDomainStoryBooks.filter(
        (book) =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mt-5" style={{
            background: "linear-gradient(135deg, #E1BEE7 0%, #F3E5F5 100%)",
            borderRadius: "20px",
            padding: "30px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
        }}>
            <h2
                className="fw-bold text-center"
                style={{
                    fontFamily: "Comic Neue, cursive",
                    color: "#4A148C"
                }}
            >
                Storytime📖🦁
            </h2>
            <p className="text-center" style={{ fontFamily: "Baloo, sans-serif", color: "#6A1B9A" }}>Enjoy magical stories with fun characters! 📖🦁</p>
            

            <input
                type="text"
                placeholder="Search by title or author"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control mb-4"
            />

            <hr />

            <p className="mb-2 text-center">Source: <a href={"https://bookriot.com/public-domain-childrens-books/"} target="_blank" rel="noopener noreferrer">Book Riot</a></p>

            <div className="book-grid">
                {filteredBooks.map((book, index) => (
                    <div key={index} className="book-card" style={{
                        background: "#fff",
                        border: `3px solid #4A148C`
                    }}>
                        <img src={book.image} alt={book.title} className="book-image" />
                        <div className="book-info">
                            <h3>{book.title}</h3>
                            <p>
                                <strong>Author:</strong> {book.author}
                            </p>
                            <p>{book.description}</p>
                            <a
                                href={book.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Read Now
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Storytime;
