---
title: 'Headless Drupal powering a React frontend'
excerpt: 'Unleash the full potential of your web applications by combining the flexibility of React with the robust capabilities of a headless Drupal CMS. Discover how decoupling your frontend from the backend not only streamlines development but also enhances real-time content delivery, offering a seamless and dynamic user experience. Dive into the future of web development and transform the way you build applications today!'
publishDate: '2025-09-21'
tags: ['web-development', 'programming', 'tutorial']
---

# Powering a React Frontend with Headless Drupal

In today's fast-paced development world, building dynamic applications that deliver real-time content is crucial. This is where the concept of a headless CMS comes into play. By decoupling the frontend from the backend, developers can leverage the strengths of both systems. In this blog post, we'll explore how to use Drupal as a content hub to power a React frontend, utilizing JSON:API for seamless data interchange.

## What is Headless Drupal?

Headless Drupal refers to using Drupal as a backend-only content management system, which serves content through APIs instead of traditional HTML rendering. This approach allows developers to use modern frontend technologies like React, Angular, or Vue.js to build dynamic, engaging user interfaces.

### Benefits of Headless Drupal

- **Flexibility**: Choose any frontend framework or library.
- **Scalability**: Manage and deliver content to multiple platforms (web, mobile, IoT).
- **Performance**: Optimize the frontend independently of the backend.

## Setting Up Drupal for Headless Operation

To start using Drupal as a headless CMS, you need to configure it to expose content through APIs.

### 1. Install JSON:API Module

The JSON:API module is a crucial component for enabling headless functionality in Drupal:

1. Ensure you have Composer installed on your machine.
2. Navigate to your Drupal project directory.
3. Run the following command to install the JSON:API module:

   ```bash
   composer require drupal/jsonapi
   ```

4. Enable the module:

   ```bash
   drush en jsonapi -y
   ```

### 2. Configure JSON:API

Once installed, JSON:API automatically exposes your Drupal content types as RESTful endpoints. You can customize these endpoints to suit your needs.

- **Access the Endpoint**: By default, JSON:API endpoints are available at `/jsonapi`.
- **Example Endpoint**: To access articles, use `/jsonapi/node/article`.

## Customizing API Responses

Sometimes, the default JSON:API responses may not fit your specific requirements. You can customize them by defining your own endpoints or altering existing ones.

### Using Custom Modules

1. **Create a Custom Module**:
   - Navigate to the `modules/custom` directory.
   - Create a new directory, e.g., `custom_jsonapi`.
   - Inside, create a `custom_jsonapi.info.yml` file:

     ```yaml
     name: 'Custom JSON:API'
     type: module
     description: 'Custom JSON:API modifications.'
     core_version_requirement: ^8 || ^9
     package: Custom
     ```

2. **Implement a Custom Endpoint**:
   - Create a `custom_jsonapi.routing.yml` file:

     ```yaml
     custom_jsonapi.custom_endpoint:
       path: '/custom-jsonapi/node/article'
       defaults:
         _controller: '\Drupal\custom_jsonapi\Controller\CustomJsonApiController::getArticles'
       requirements:
         _permission: 'access content'
     ```

   - Define the controller in `src/Controller/CustomJsonApiController.php`:

     ```php
     namespace Drupal\custom_jsonapi\Controller;

     use Symfony\Component\HttpFoundation\JsonResponse;

     class CustomJsonApiController {
       public function getArticles() {
         // Fetch and manipulate data as needed
         $data = [
           'articles' => [
             ['id' => 1, 'title' => 'First Article'],
             ['id' => 2, 'title' => 'Second Article'],
           ],
         ];
         return new JsonResponse($data);
       }
     }
     ```

## Integrating with React

With your API in place, you can now integrate it with a React frontend.

### Fetching Data

Use the `fetch` API or a library like Axios to retrieve data from Drupal:

```javascript
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios
      .get('http://your-drupal-site.com/jsonapi/node/article')
      .then(response => {
        setArticles(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching articles:', error);
      });
  }, []);

  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {articles.map(article => (
          <li key={article.id}>{article.attributes.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Articles;
```

### Handling Authentication

For secure data access, especially when dealing with sensitive information, you may need to implement authentication.

1. **Basic Authentication**: Use the `basic_auth` module in Drupal to enable basic HTTP authentication.

   ```bash
   drush en basic_auth -y
   ```

2. **OAuth**: For a more robust solution, consider the `simple_oauth` module.

   ```bash
   composer require drupal/simple_oauth
   ```

   Follow the module's documentation to configure OAuth tokens.

## Conclusion

By embracing a headless architecture with Drupal and React, you unlock a world of possibilities. You can create flexible, scalable, and high-performance applications that deliver seamless user experiences across multiple platforms. Whether you're a beginner or an experienced developer, leveraging Drupal's robust backend capabilities with React's dynamic frontend can elevate your application's potential.

Start experimenting with headless Drupal today and transform your development approach for modern web applications.
