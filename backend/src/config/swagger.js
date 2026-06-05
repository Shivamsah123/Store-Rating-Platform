const swaggerJSDoc = require('swagger-jsdoc');

const port = process.env.PORT || 5000;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Store Rating Platform API',
    version: '1.0.0',
    description: 'Complete API documentation for the Store Rating Platform.',
    contact: {
      name: 'API Support'
    }
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: 'Development server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', minLength: 20, maxLength: 60 },
          email: { type: 'string', format: 'email' },
          address: { type: 'string', maxLength: 400 },
          role: { type: 'string', enum: ['ADMIN', 'USER', 'STORE_OWNER'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Store: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          address: { type: 'string', maxLength: 400 },
          ownerId: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Rating: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          userId: { type: 'integer' },
          storeId: { type: 'integer' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          comment: { type: 'string', maxLength: 500, nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ],
  paths: {
    '/api/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'address'],
                properties: {
                  name: { type: 'string', example: 'System Administrator Name' },
                  email: { type: 'string', example: 'user@example.com' },
                  password: { type: 'string', example: 'Password123!' },
                  address: { type: 'string', example: '123 Main Street, City, Country' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation error' },
          409: { description: 'Email already in use' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'Login user',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'user@example.com' },
                  password: { type: 'string', example: 'Password123!' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Login successful' },
          401: { description: 'Invalid email or password' }
        }
      }
    },
    '/api/users/change-password': {
      put: {
        summary: 'Change user password',
        tags: ['User Profile'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPassword', 'newPassword'],
                properties: {
                  currentPassword: { type: 'string', example: 'Password123!' },
                  newPassword: { type: 'string', example: 'NewPassword123!' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Password changed successfully' },
          400: { description: 'Validation error or incorrect password' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/api/stores': {
      get: {
        summary: 'Get all stores with pagination and search',
        tags: ['Stores'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'sortField', in: 'query', schema: { type: 'string' } },
          { name: 'sortOrder', in: 'query', schema: { type: 'string', enum: ['ASC', 'DESC'] } }
        ],
        responses: {
          200: { description: 'Stores fetched successfully' }
        }
      }
    },
    '/api/ratings': {
      post: {
        summary: 'Submit a new store rating',
        tags: ['Ratings'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['storeId', 'rating'],
                properties: {
                  storeId: { type: 'integer', example: 1 },
                  rating: { type: 'integer', example: 5 },
                  comment: { type: 'string', example: 'Great service and friendly staff!', maxLength: 500 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Rating submitted' },
          400: { description: 'Validation error or duplicate rating' }
        }
      }
    },
    '/api/ratings/{storeId}': {
      put: {
        summary: 'Update an existing store rating',
        tags: ['Ratings'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'storeId', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['rating'],
                properties: {
                  rating: { type: 'integer', example: 4 },
                  comment: { type: 'string', example: 'Updated my review after a second visit.', maxLength: 500 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Rating updated' },
          404: { description: 'Rating not found' }
        }
      }
    },
    '/api/admin/dashboard': {
      get: {
        summary: 'Get admin dashboard stats and growth analytics',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Stats fetched' }
        }
      }
    },
    '/api/admin/users': {
      get: {
        summary: 'View and filter all users (paginated)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'role', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Users fetched' }
        }
      },
      post: {
        summary: 'Admin creates a user',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'address', 'role'],
                properties: {
                  name: { type: 'string', example: 'Store Owner Bob Smith' },
                  email: { type: 'string', example: 'bob@example.com' },
                  password: { type: 'string', example: 'Password123!' },
                  address: { type: 'string', example: '456 Main St, City' },
                  role: { type: 'string', enum: ['ADMIN', 'USER', 'STORE_OWNER'], example: 'STORE_OWNER' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User created' }
        }
      }
    },
    '/api/admin/stores': {
      get: {
        summary: 'View and filter all stores (paginated)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Stores fetched' }
        }
      },
      post: {
        summary: 'Admin creates a store',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'address', 'ownerId'],
                properties: {
                  name: { type: 'string', example: 'Supermarket Store Local' },
                  email: { type: 'string', example: 'supermarket@example.com' },
                  address: { type: 'string', example: '789 Central Ave, City' },
                  ownerId: { type: 'integer', example: 2 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Store created' }
        }
      }
    },
    '/api/admin/users/{id}': {
      get: {
        summary: 'View user profile and store ratings (if owner)',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'integer' } }
        ],
        responses: {
          200: { description: 'User details fetched' }
        }
      }
    },
    '/api/admin/global-search': {
      get: {
        summary: 'Global search users and stores',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: { description: 'Search results' }
        }
      }
    },
    '/api/admin/audit-logs': {
      get: {
        summary: 'Fetch audit log history',
        tags: ['Admin'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Logs retrieved' }
        }
      }
    },
    '/api/store-owner/dashboard': {
      get: {
        summary: 'Get store owner dashboard metrics',
        tags: ['Store Owner'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Dashboard stats' }
        }
      }
    },
    '/api/store-owner/ratings': {
      get: {
        summary: 'Get ratings history for stores owned by owner',
        tags: ['Store Owner'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Ratings history list' }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: []
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;

