# MovieBuzz - Movie Information Platform

## Overview

MovieBuzz is a modern web application built with Angular that provides users with comprehensive movie information, reviews, and related content. The application features a clean, user-friendly interface powered by Ant Design (ng-zorro-antd) components.

## Technical Stack

- **Frontend Framework**: Angular 19.2.0
- **UI Components**: ng-zorro-antd 19.2.1
- **State Management**: NgRx Store
- **Styling**: SCSS
- **Development Tools**: Angular CLI 19.2.6

## Project Structure

```
src/
├── app/                    # Main application module
├── assets/                 # Static assets
├── _auth/                  # Authentication related code
├── _interceptors/          # HTTP interceptors
├── _models/               # TypeScript interfaces and models
├── _pipes/                # Custom Angular pipes
├── _services/             # Application services
├── _utils/                # Utility functions
└── Components/            # Reusable UI components
```

## Key Features

1. **Movie Information Display**

   - Detailed movie listings
   - Movie details and descriptions
   - Cast and crew information

2. **User Interface**

   - Modern and responsive design
   - Ant Design components integration
   - Intuitive navigation

3. **Authentication**

   - User authentication system
   - Protected routes
   - User session management

4. **Data Management**
   - State management using NgRx
   - HTTP interceptors for API communication
   - Data models and interfaces

## Development Setup

1. **Prerequisites**

   - Node.js
   - Angular CLI
   - npm or yarn

2. **Installation**

   ```bash
   npm install
   ```

3. **Running the Application**

   ```bash
   npm start
   ```

4. **Building for Production**
   ```bash
   npm run build
   ```

## Testing

The application includes a comprehensive testing setup with:

- Jasmine for unit testing
- Karma as the test runner
- Angular's built-in testing utilities

## Dependencies

### Core Dependencies

- @angular/\* (v19.2.0)
- ng-zorro-antd (v19.2.1)
- rxjs (v7.8.0)

### Development Dependencies

- TypeScript (v5.7.2)
- Angular CLI (v19.2.6)
- Testing frameworks (Jasmine, Karma)

## Best Practices

1. **Code Organization**

   - Modular architecture
   - Separation of concerns
   - Reusable components

2. **Performance**

   - Lazy loading of modules
   - Optimized bundle size
   - Efficient state management

3. **Security**
   - Authentication interceptors
   - Secure HTTP communication
   - Protected routes

## Future Enhancements

1. Enhanced movie search capabilities
2. User reviews and ratings system
3. Social sharing features
4. Personalized recommendations
5. Advanced filtering options

## Contributing

Please refer to the project's contribution guidelines for information on how to contribute to the development of MovieBuzz.

## License

[Specify your license information here]
