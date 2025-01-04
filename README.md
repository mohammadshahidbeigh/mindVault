# MindVault - Personal Knowledge Management System

MindVault is a comprehensive web application built for researchers, academics, and professionals to organize, manage, and collaborate on research papers, articles, books, and personal notes. Designed to streamline the research workflow, it offers powerful tools to upload, categorize, search, and share academic content, making it an essential resource for anyone involved in research or writing.

## Features

- User Authentication and Authorization:
MindVault ensures secure access with user authentication powered by JWT (JSON Web Tokens). Only authorized users can upload, manage, and collaborate on content, protecting sensitive academic data.

- Upload, Manage, and Update Content:
Users can upload, update, and delete research papers, articles, books, or notes. This feature allows easy management of academic resources, ensuring that users can keep their content up-to-date and organized effortlessly.

- Categorization with Tags and Metadata:
Users can categorize their content using tags and metadata, enabling better organization and quicker access to relevant materials. This makes managing large repositories of research papers and academic notes much easier.

- Advanced Search Functionality:
MindVault features an efficient search system powered by GraphQL, allowing users to quickly locate papers, notes, or other materials based on tags, titles, or keywords. The advanced search ensures accurate and fast retrieval of relevant content.

- Data Visualization:
MindVault includes data visualization tools that provide insights into research trends, citation metrics, and other academic data. This helps users track the progress of their research and discover trends in their field.

- Responsive Design:
With a fully responsive design, the platform provides a seamless user experience on both desktop and mobile devices, allowing researchers to access and manage their resources anytime, anywhere.

- Video Integration:
MindVault also allows users to watch educational videos directly on the platform using React-Player. This feature adds a multimedia element to the research experience, enabling users to consume video content alongside reading materials.

## Technology Stack

- Frontend: React.js with TypeScript
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)
- State Management: Redux
- UI Framework: Material-UI
- GraphQL for efficient data querying
- XSS protection for enhanced security
- Containerization: Docker
- Deployment: AWS EC2
  - GraphQL Endpoint: [http://43.205.10.7:4000/graphql](http://43.205.10.7:4000/graphql)
  - Application Endpoint: [http://43.205.10.7:3000/](http://43.205.10.7:3000/)
- CI/CD: GitHub Actions

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables
4. Run the development server with `npm run dev`

## Contributing

We welcome contributions to improve MindVault. Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
