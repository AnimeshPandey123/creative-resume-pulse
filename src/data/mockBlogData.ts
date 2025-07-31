
import { BlogAuthor, BlogPost, BlogTag } from "../types/BlogTypes";

export const blogAuthors: BlogAuthor[] = [
  {
    id: "1",
    name: "Animesh Pandey",
    bio: "Senior Software Engineer with 6+ years of experience in PHP, Python, and backend development.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  }
];

export const blogTags: BlogTag[] = [
  { id: "1", name: "Web Development", slug: "web-development" },
  { id: "2", name: "React", slug: "react" },
  { id: "3", name: "JavaScript", slug: "javascript" },
  { id: "4", name: "Python", slug: "python" },
  { id: "5", name: "Backend", slug: "backend" },
  { id: "6", name: "DevOps", slug: "devops" },
  { id: "7", name: "Career", slug: "career" }
];

export const blogPosts: BlogPost[] = [
  {
    id: "5",
    title: "Modern JavaScript Features You Should Know",
    slug: "modern-javascript-features",
    excerpt: "Explore the latest JavaScript features that can help you write cleaner, more efficient code in your projects.",
    content: `
## Modern JavaScript Features You Should Know

JavaScript has evolved significantly in recent years with new features that make code more readable, maintainable, and efficient. Here's an overview of modern JavaScript features that every developer should know.

### 1. Optional Chaining (?.)

Optional chaining prevents errors when accessing nested properties that might be null or undefined.

\`\`\`javascript
// Without optional chaining
const streetName = user && user.address && user.address.street;

// With optional chaining
const streetName = user?.address?.street;
\`\`\`

### 2. Nullish Coalescing Operator (??)

The nullish coalescing operator provides a default value only when the left-hand side is null or undefined (not for other falsy values like 0 or an empty string).

\`\`\`javascript
// Without nullish coalescing
const count = userCount !== undefined && userCount !== null ? userCount : 10;

// With nullish coalescing
const count = userCount ?? 10;
\`\`\`

### 3. Logical Assignment Operators (&&=, ||=, ??=)

Combine logical operators with assignment for more concise code.

\`\`\`javascript
// Assign when left side is truthy (&&=)
let user = { admin: true };
user.admin &&= updateAdminPermissions(user);

// Assign when left side is falsy (||=)
user.name ||= 'Anonymous';

// Assign when left side is null/undefined (??=)
function createUser(options) {
  options.admin ??= false;
  options.language ??= 'en';
  return options;
}
\`\`\`

### 4. Array Methods: flat() and flatMap()

Flatten nested arrays with ease.

\`\`\`javascript
// Flatten one level
const arr = [1, 2, [3, 4]];
arr.flat(); // [1, 2, 3, 4]

// Flatten multiple levels
const deepArr = [1, [2, [3, [4]]]];
deepArr.flat(3); // [1, 2, 3, 4]

// Map and then flatten
const arr = [1, 2, 3];
arr.flatMap(x => [x, x * 2]); // [1, 2, 2, 4, 3, 6]
\`\`\`

### 5. Object Methods: fromEntries() and entries()

Convert between objects and array entries.

\`\`\`javascript
const obj = { a: 1, b: 2, c: 3 };

// Object to array of entries
const entries = Object.entries(obj);
// [['a', 1], ['b', 2], ['c', 3]]

// Filter or transform entries
const filteredEntries = entries.filter(([key, value]) => value > 1);
// [['b', 2], ['c', 3]]

// Convert back to object
const newObj = Object.fromEntries(filteredEntries);
// { b: 2, c: 3 }
\`\`\`

### 6. BigInt

Handle integers larger than Number.MAX_SAFE_INTEGER.

\`\`\`javascript
const max = Number.MAX_SAFE_INTEGER; // 9007199254740991
max + 1 === max + 2; // true - precision loss!

// With BigInt
const bigInt = 9007199254740991n;
bigInt + 1n === bigInt + 2n; // false - precision maintained
\`\`\`

### 7. String Methods: matchAll() and replaceAll()

Process all regex matches or replace all occurrences of a substring.

\`\`\`javascript
// matchAll returns an iterator of all matches
const text = "test1 test2 test3";
const pattern = /test(\d)/g;
const matches = [...text.matchAll(pattern)];
console.log(matches);
// [
//   ["test1", "1", index: 0, input: "test1 test2 test3", groups: undefined],
//   ["test2", "2", index: 6, input: "test1 test2 test3", groups: undefined],
//   ["test3", "3", index: 12, input: "test1 test2 test3", groups: undefined]
// ]

// replaceAll replaces all occurrences
const newText = text.replaceAll('test', 'item');
console.log(newText); // "item1 item2 item3"
\`\`\`

### 8. Promise Methods: allSettled(), any() and finally()

Advanced Promise handling.

\`\`\`javascript
// Wait for all promises to settle (fulfill or reject)
Promise.allSettled([
  fetch('/api/data'),
  fetch('/api/user')
]).then(results => {
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log('Success:', result.value);
    } else {
      console.log('Error:', result.reason);
    }
  });
});

// Get the first fulfilled promise
Promise.any([
  fetch('/api/data1'),
  fetch('/api/data2')
]).then(firstSuccess => console.log(firstSuccess))
  .catch(error => console.error('All promises rejected'));

// Execute code regardless of promise outcome
fetchData()
  .then(data => processData(data))
  .catch(error => handleError(error))
  .finally(() => hideLoadingIndicator());
\`\`\`

### 9. Private Class Fields and Methods

Encapsulate internal details using the # prefix.

\`\`\`javascript
class Counter {
  #count = 0;  // Private field
  
  #increment() {  // Private method
    this.#count++;
  }
  
  tick() {
    this.#increment();
    return this.#count;
  }
}

const counter = new Counter();
console.log(counter.tick()); // 1
// console.log(counter.#count); // Syntax error
// counter.#increment();        // Syntax error
\`\`\`

### 10. Top-level await

Use await outside of async functions in modules.

\`\`\`javascript
// In a module (not in a regular script)
const response = await fetch('/api/data');
const data = await response.json();
export { data };  // Export the fetched data
\`\`\`

## Conclusion

These modern JavaScript features can significantly improve your code by making it more concise, robust, and readable. By incorporating these features into your projects, you'll write more maintainable code and reduce common sources of bugs.
    `,
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    publishDate: "2024-02-18",
    readingTime: 9,
    author: blogAuthors[0],
    tags: [blogTags[2], blogTags[1]]
  }
];

export const fetchBlogPosts = (page = 1, limit = 6, search = '', tag = '') => {
  let filteredPosts = [...blogPosts];
  
  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchLower) ||
      post.excerpt.toLowerCase().includes(searchLower) ||
      post.content.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by tag
  if (tag) {
    filteredPosts = filteredPosts.filter(post => 
      post.tags.some(t => t.slug === tag)
    );
  }
  
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  
  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
  
  return {
    posts: paginatedPosts,
    totalPosts,
    totalPages,
    currentPage: page
  };
};

export const fetchBlogPostBySlug = (slug: string) => {
  return blogPosts.find(post => post.slug === slug);
};

export const fetchRelatedPosts = (currentPostId: string, limit = 3) => {
  const currentPost = blogPosts.find(post => post.id === currentPostId);
  if (!currentPost) return [];
  
  const currentPostTagIds = currentPost.tags.map(tag => tag.id);
  
  return blogPosts
    .filter(post => post.id !== currentPostId)
    .map(post => {
      const commonTags = post.tags.filter(tag => currentPostTagIds.includes(tag.id));
      return { post, relevance: commonTags.length };
    })
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)
    .map(item => item.post);
};
