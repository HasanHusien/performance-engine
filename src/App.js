import { memo, useContext, useEffect, useMemo, useState } from "react";
import { PostContext, PostProvider } from "./PostProvider";
import { faker } from "@faker-js/faker";
import Test from "./Test";

// make my faker data from this libarary
function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

function App() {
  const [isFakeDark, setIsFakeDark] = useState(false); // for darkMode

  // Whenever `isFakeDark` changes, we toggle the `fake-dark-mode` class on the HTML element (see in "Elements" dev tool).
  useEffect(
    function () {
      document.documentElement.classList.toggle("fake-dark-mode"); // add dark mode class
    },
    [isFakeDark],
  );

  return (
    <section>
      <button
        onClick={() => setIsFakeDark((isFakeDark) => !isFakeDark)}
        className="btn-fake-dark-mode"
      >
        {isFakeDark ? "☀️" : "🌙"}
      </button>

      <PostProvider>
        <Header />

        <Main />
        <Archive />
        <Footer />
      </PostProvider>
    </section>
  );
}

function Header() {
  //all data passed as an object in this veriable from provider value
  const { onClearPosts } = useContext(PostContext); // destructioning immedtly.

  return (
    <header>
      <h1>
        <span>⚛️</span>The Atomic Blog
      </h1>
      <div>
        <Results />
        <SearchPosts />
        <button onClick={onClearPosts}>Clear posts</button>
      </div>
    </header>
  );
}

function SearchPosts() {
  const { searchQuery, setSearchQuery } = useContext(PostContext);
  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search posts..."
    />
  );
}

function Results() {
  const { posts } = useContext(PostContext);
  return <p>🚀 {posts.length} atomic posts found</p>;
}
 
const Main = memo( function Main() {
  return (
    <main>
      <FormAddPost />
      <Posts />
    </main>
  );
})

function Posts() {
  return (
    <section>
      <List />
    </section>
  );
}

function FormAddPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { onAddPost } = useContext(PostContext);

  const handleSubmit = function (e) {
    e.preventDefault();
    if (!body || !title) return;
    // add my new data
    onAddPost({ title, body });
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Post body"
      />
      <button>Add post</button>
    </form>
  );
}

function List() {
  const { posts } = useContext(PostContext);

  const postsList = posts.map((post, index) => (
    <li key={index}>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
    </li>
  ));
  return <>
   <ul>{postsList}</ul>;
   
  </>
}
 
const Archive = memo( function Archive() {
  const { onAddPost } = useContext(PostContext);

  // Here we don't need the setter function. We're only using state to store these posts because the callback function passed into useState (which generates the posts) is only called once, on the initial render. So we use this trick as an optimization technique, because if we just used a regular variable, these posts would be re-created on every render. We could also move the posts outside the components, but I wanted to show you this trick 😉
  const [posts] = useState(() =>
    // 💥 WARNING: This might make your computer slow! Try a smaller `length` first
    Array.from({ length: 10000 }, () => createRandomPost()),
  );

  const [showArchive, setShowArchive] = useState(false);

  const archivedPosts = posts.map((post, index) => (
    <li key={index}>
      <p>
        <strong>{post.title}:</strong> {post.body}
      </p>
      <button onClick={() => onAddPost(post)}>Add as new post</button>
    </li>
  ));

  return (
    <aside>
      <h2>Post archive</h2>
      <button onClick={() => setShowArchive((s) => !s)}>
        {showArchive ? "Hide archive posts" : "Show archive posts"}
      </button>
      {showArchive && <ul>{archivedPosts}</ul>}
    </aside>
  );
})

function Footer() {
  return <footer>&copy; by The Atomic Blog ✌️</footer>;
}

export default App;
