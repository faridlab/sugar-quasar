export default {
  app: {
    name: 'Sugar Quasar',
    description: 'Admin Dashboard with DDD Architecture',
  },
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    search: 'Search',
    loading: 'Loading...',
    noData: 'No data available',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    actions: 'Actions',
  },
  auth: {
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember Me',
  },
  validation: {
    required: '{field} is required',
    email: 'Please enter a valid email',
    minLength: '{field} must be at least {min} characters',
    maxLength: '{field} must not exceed {max} characters',
  },
  messages: {
    success: {
      created: '{resource} created successfully',
      updated: '{resource} updated successfully',
      deleted: '{resource} deleted successfully',
    },
    error: {
      generic: 'An error occurred. Please try again.',
      notFound: '{resource} not found',
      unauthorized: 'You are not authorized to perform this action',
    },
  },
};
