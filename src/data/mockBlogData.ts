
import { BlogAuthor, BlogPost, BlogTag } from "../types/BlogTypes";

export const blogAuthors: BlogAuthor[] = [
  {
    id: "1",
    name: "Animesh Pandey",
    bio: "Senior Software Engineer with 6+ years of experience in PHP, Python, and backend development.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: "2",
    name: "Jane Smith",
    bio: "Full-stack developer specializing in React and Node.js with a passion for modern web technologies.",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
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
    id: "1",
    title: "Understanding React Hooks: A Deep Dive",
    slug: "understanding-react-hooks",
    excerpt: "Learn how React Hooks revolutionize state management and side effects in functional components.",
    content: `
## Introduction to React Hooks

React Hooks were introduced in React 16.8 as a way to use state and other React features without writing a class. They enable functional components to have access to stateful logic and lifecycle features previously only available in class components.

### Why Hooks?

Hooks solve several problems:
- They allow you to reuse stateful logic between components
- They organize related logic in one place
- They help avoid "wrapper hell" from higher-order components and render props

\`\`\`jsx
// Example of useState Hook
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

### The useEffect Hook

The useEffect Hook lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React classes, but unified into a single API.

\`\`\`jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
    
    // Optional cleanup function (similar to componentWillUnmount)
    return () => {
      document.title = 'React App';
    };
  }, [count]); // Only re-run the effect if count changes

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
\`\`\`

## Custom Hooks

One of the most powerful features of Hooks is the ability to create your own custom Hooks, allowing you to extract and reuse stateful logic between different components.

\`\`\`jsx
// Custom Hook for form handling
function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);
  
  function handleChange(e) {
    setValue(e.target.value);
  }
  
  return {
    value,
    onChange: handleChange
  };
}

// Using the custom Hook
function LoginForm() {
  const username = useFormInput('');
  const password = useFormInput('');
  
  function handleSubmit(e) {
    e.preventDefault();
    console.log('Submitting:', username.value, password.value);
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" {...username} placeholder="Username" />
      <input type="password" {...password} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
\`\`\`

## Conclusion

React Hooks represent a paradigm shift in how we write React components. They simplify component logic, improve code reusability, and make testing easier. As you become more familiar with Hooks, you'll discover that they offer a more intuitive way to work with React's component model.
    `,
    coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    publishDate: "2023-10-15",
    readingTime: 8,
    author: blogAuthors[0],
    tags: [blogTags[1], blogTags[2]]
  },
  {
    id: "2",
    title: "Building Scalable Backend Systems with Python",
    slug: "building-scalable-backend-systems",
    excerpt: "Explore architectural patterns and best practices for building highly scalable backend systems using Python.",
    content: `
## Building Scalable Backend Systems with Python

In today's digital landscape, building backend systems that can handle growing user bases and increasing workloads is crucial. Python, with its simplicity and robust ecosystem, provides excellent tools for creating such scalable systems.

### Microservices Architecture

Microservices architecture has become a popular approach for building scalable systems. Instead of a monolithic application, functionality is divided into small, independent services.

\`\`\`python
# Example Flask microservice
from flask import Flask, jsonify
import requests

app = Flask(__name__)

@app.route('/user/<user_id>', methods=['GET'])
def get_user(user_id):
    # In a microservice architecture, this might call another service
    response = requests.get(f'http://user-service/users/{user_id}')
    return jsonify(response.json())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
\`\`\`

### Asynchronous Programming

Python's asyncio library allows for non-blocking I/O operations, which can significantly improve the performance of I/O-bound applications.

\`\`\`python
import asyncio
import aiohttp

async def fetch_data(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

async def main():
    tasks = [
        fetch_data('https://api.example.com/data/1'),
        fetch_data('https://api.example.com/data/2'),
        fetch_data('https://api.example.com/data/3'),
    ]
    results = await asyncio.gather(*tasks)
    for result in results:
        print(result)

if __name__ == '__main__':
    asyncio.run(main())
\`\`\`

### Message Queues

For tasks that are time-consuming or need to be processed later, message queues like RabbitMQ or Kafka are invaluable.

\`\`\`python
# Using Celery with RabbitMQ for task queuing
from celery import Celery

app = Celery('tasks', broker='pyamqp://guest@localhost//')

@app.task
def process_data(data):
    # Time-consuming data processing
    result = complex_processing(data)
    return result

# In your web application
def handle_request(request):
    data = request.get_json()
    process_data.delay(data)  # Non-blocking task enqueuing
    return {"status": "processing"}
\`\`\`

### Database Optimization

Proper database design and query optimization are crucial for scalability.

\`\`\`python
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    posts = relationship("Post", back_populates="author")

class Post(Base):
    __tablename__ = 'posts'
    id = Column(Integer, primary_key=True)
    title = Column(String)
    content = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'))
    author = relationship("User", back_populates="posts")

# Create indexes for frequently queried columns
# Use connection pooling
engine = create_engine('postgresql://user:password@localhost/dbname', pool_size=10, max_overflow=20)
\`\`\`

### Caching Strategies

Implementing caching reduces database load and improves response times.

\`\`\`python
import redis
from functools import wraps
import json

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache(ttl=300):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{json.dumps(args)}:{json.dumps(kwargs)}"
            cached_result = redis_client.get(key)
            
            if cached_result:
                return json.loads(cached_result)
                
            result = func(*args, **kwargs)
            redis_client.setex(key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator

@cache(ttl=60)
def get_user_data(user_id):
    # Expensive database query
    return {"id": user_id, "name": "John Doe", "email": "john@example.com"}
\`\`\`

## Conclusion

Building scalable backend systems with Python requires a combination of architectural patterns, tools, and best practices. By leveraging microservices, asynchronous programming, message queues, database optimization, and caching, you can create systems that grow seamlessly with your user base.

Remember that scalability is not just about handling more requests but also about maintaining reliability and performance as your application grows.
    `,
    coverImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    publishDate: "2023-11-02",
    readingTime: 12,
    author: blogAuthors[0],
    tags: [blogTags[3], blogTags[4], blogTags[5]]
  },
  {
    id: "3",
    title: "The Role of DevOps in Modern Software Development",
    slug: "role-of-devops",
    excerpt: "Discover how DevOps practices bridge the gap between development and operations for faster, more reliable software delivery.",
    content: `
## The Role of DevOps in Modern Software Development

DevOps has transformed how organizations develop, deploy, and maintain software. By breaking down silos between development and operations teams, DevOps practices enable faster delivery of high-quality software.

### Continuous Integration and Continuous Deployment (CI/CD)

CI/CD pipelines automate the build, test, and deployment processes, ensuring that code changes are reliably delivered to production.

\`\`\`yaml
# Example GitHub Actions workflow for CI/CD
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
        
    - name: Install dependencies
      run: npm install
      
    - name: Run tests
      run: npm test
      
    - name: Build
      run: npm run build
      
  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # Deployment commands here
\`\`\`

### Infrastructure as Code (IaC)

IaC allows teams to manage infrastructure using code and version control, ensuring consistency and reproducibility.

\`\`\`terraform
# Example Terraform configuration for provisioning AWS resources
provider "aws" {
  region = "us-west-2"
}

resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  
  tags = {
    Name = "WebServer"
    Environment = "Production"
  }
  
  user_data = <<-EOF
              #!/bin/bash
              echo "Hello, World" > index.html
              nohup busybox httpd -f -p 8080 &
              EOF
}

resource "aws_security_group" "allow_web" {
  name        = "allow_web_traffic"
  description = "Allow web inbound traffic"
  
  ingress {
    description = "HTTP"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
\`\`\`

### Monitoring and Observability

Effective monitoring and observability practices help teams understand system behavior and quickly identify issues.

\`\`\`python
# Example using Prometheus client library for Python
from prometheus_client import start_http_server, Summary, Counter, Gauge
import random
import time

# Create metrics
REQUEST_TIME = Summary('request_processing_seconds', 'Time spent processing request')
REQUESTS = Counter('http_requests_total', 'Total HTTP Requests', ['method', 'endpoint'])
INPROGRESS = Gauge('http_requests_inprogress', 'Number of in-progress HTTP requests')

# Decorate function with metric
@REQUEST_TIME.time()
@INPROGRESS.track_inprogress()
def process_request(request):
    # Process request here
    time.sleep(random.random())
    REQUESTS.labels(method=request.method, endpoint=request.path).inc()

if __name__ == '__main__':
    # Start server to expose metrics
    start_http_server(8000)
    # Application code here
\`\`\`

### Containerization and Orchestration

Containers provide consistency across environments, while orchestration tools like Kubernetes manage deployment, scaling, and operations.

\`\`\`dockerfile
# Example Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
\`\`\`

\`\`\`yaml
# Example Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-application
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
      - name: web-container
        image: my-web-app:latest
        ports:
        - containerPort: 5000
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
\`\`\`

### Collaboration and Culture

DevOps is not just about tools and technology—it's also about fostering a culture of collaboration, shared responsibility, and continuous improvement.

Some key cultural practices include:

1. **Blameless Post-mortems**: Focus on learning from failures, not assigning blame
2. **Cross-functional Teams**: Developers, operations, and other stakeholders working together
3. **Continuous Learning**: Regular sharing of knowledge through documentation, pair programming, and community participation

## Conclusion

DevOps practices enable organizations to deliver software faster, more reliably, and with higher quality. By embracing CI/CD, infrastructure as code, monitoring, containerization, and a collaborative culture, teams can respond more quickly to market demands and provide better experiences for their users.
    `,
    coverImage: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    publishDate: "2023-12-05",
    readingTime: 10,
    author: blogAuthors[1],
    tags: [blogTags[5], blogTags[4]]
  },
  {
    id: "4",
    title: "5 Career Tips for Junior Developers",
    slug: "career-tips-junior-developers",
    excerpt: "Essential advice for junior developers looking to accelerate their growth and advance their careers in tech.",
    content: `
## 5 Career Tips for Junior Developers

Starting your career as a developer can be both exciting and overwhelming. Here are five essential tips to help junior developers navigate their early career path and set themselves up for long-term success.

### 1. Master the Fundamentals

Before diving into the latest frameworks and libraries, make sure you have a solid grasp of programming fundamentals. Strong knowledge of data structures, algorithms, and design patterns will serve you throughout your entire career.

\`\`\`javascript
// Example: Understanding how closures work in JavaScript
function createCounter() {
  let count = 0;  // This variable is "closed over" by the inner function
  
  return function() {
    count += 1;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
\`\`\`

Focus on:
- Core language features
- Common data structures and algorithms
- Problem-solving skills
- Clean code principles

### 2. Build Projects Outside of Work

Personal projects are invaluable for learning new skills and demonstrating your abilities to potential employers.

\`\`\`bash
# Starting a new project
mkdir my-portfolio
cd my-portfolio
npm init -y
git init
# Start coding and committing regularly
\`\`\`

Project ideas:
- Personal portfolio website
- Clone of a simple app you use regularly
- Tool that solves a problem you face
- Contribution to open-source projects

### 3. Learn to Communicate Effectively

Technical skills alone aren't enough. The ability to explain complex concepts clearly and collaborate with others is crucial.

Example of explaining a technical concept effectively:

"The debounce function prevents a function from being called multiple times in quick succession. Think of it like waiting until someone stops typing before performing a search, rather than searching after every keystroke."

\`\`\`javascript
// Simple debounce implementation
function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Usage
const debouncedSearch = debounce(() => {
  // Search implementation
  console.log('Searching...');
}, 300);

// Call this on each keystroke
searchInput.addEventListener('input', debouncedSearch);
\`\`\`

### 4. Seek Regular Feedback

Don't wait for annual reviews. Actively seek feedback on your code and approach to problems.

Strategies for getting feedback:
- Request code reviews even when not required
- Share your approach to problems before implementing
- Ask specific questions about your code
- Participate in pair programming sessions

### 5. Develop a Growth Mindset

Technology evolves rapidly. Embracing continuous learning and seeing challenges as opportunities will help you adapt and grow.

\`\`\`markdown
## Learning Plan Example

### Current Quarter Focus:
- Deepen React knowledge
- Learn TypeScript fundamentals
- Improve unit testing skills

### Learning Resources:
- Complete "React Testing Library" course
- Build a TypeScript project
- Read "Clean Code" by Robert Martin
- Attend local JavaScript meetup

### Success Metrics:
- Convert one project to TypeScript
- Achieve 80%+ test coverage on personal project
- Share a learning presentation with the team
\`\`\`

Remember that everyone starts somewhere, and making mistakes is part of the learning process. Stay curious, be patient with yourself, and celebrate your progress along the way.

## Conclusion

Your early years as a developer are foundational. By mastering fundamentals, building projects, communicating effectively, seeking feedback, and maintaining a growth mindset, you'll set yourself up for a successful and fulfilling career in software development.
    `,
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    publishDate: "2024-01-10",
    readingTime: 7,
    author: blogAuthors[1],
    tags: [blogTags[6]]
  },
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
