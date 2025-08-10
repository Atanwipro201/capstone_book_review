import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

//configs
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "aryan@123",
  port: 5432,
});
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let entries = [];
let current_book_isbn = "";
var dbtest = [];
//connect to database
db.connect();

//search for book with that name
async function searchISBN(bn) {
  var res = await axios.get("https://openlibrary.org/search.json?q=" + bn);
  const cover_id = res.data.docs[0].cover_i;
  return cover_id;
}

//entries array setup
async function searchBooks() {
  let result = await db.query("SELECT * FROM book_reviews ORDER BY id DESC");
  entries = result.rows.map((entry) => {
    return {
      id: entry.id,
      name: entry.name,
      isbn: entry.isbn,
      review: entry.review,
    };
  });
  return entries;
}
function makePhotoURL(i) {
  return `https://covers.openlibrary.org/b/id/${i}-S.jpg`;
}
//main page
app.get("/", async (req, res) => {
  res.render("index.ejs", {
    listTitle: "All books",
    listItems: await searchBooks(),
    imgURL: makePhotoURL(entries.isbn),
  });
});
//form to get info for book
app.get("/add", async (req, res) => {
  res.render("add.ejs", {});
});

//add to db
app.post("/get-book", async (req, res) => {
  var book_name = req.body.name;
  var user_review = req.body.user_review;
  var book_type = req.body.book_type;
  const current_book_cover_id = await searchISBN(
    book_name.replaceAll(" ", "+").trim()
  );
  db.query(
    "INSERT INTO book_reviews(name,isbn,review,type) VALUES ($1,$2,$3,$4)",
    [book_name, current_book_cover_id, user_review, book_type]
  );
  res.redirect("/");
});
//delete
app.post("/delete", (req, res) => {
  var book_id = req.body.id;
  db.query("DELETE FROM book_reviews WHERE id = $1", [book_id]);
  console.log("deleted: " + book_id);
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  var book_id = req.body.id;
  db.query("UPDATE book_reviews SET name = $1,review =$2 WHERE id = $3", [
    req.body.updatedName,
    req.body.updatedReview,
    req.body.updatedId,
  ]);
  console.log(req.body);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
