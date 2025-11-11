export interface DictType {
  homepage?: {
    title?: string;
    greeting?: string;
    viewPosts?: string;
  };
  languageSwitcher?: {
    label?: string;
  };
  common?: {
    back?: string;
  };
  auth?: {
    login?: {
      title?: string;
      subtitle?: string;
      email?: string;
      password?: string;
      rememberMe?: string;
      signIn?: string;
      googleSignIn?: string;
      noAccount?: string;
      register?: string;
      invalidCredentials?: string;
      signingIn?: string;
      invalid_email?: string;
      password_too_short?: string;
      login_successful?: string;
      validation_failed?: string;
      server_error?: string;
      email_invalid?: string;
      password_invalid?: string;
    };
    register?: {
      title?: string;
      subtitle?: string;
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      signUp?: string;
      googleSignUp?: string;
      haveAccount?: string;
      login?: string;
      passwordMismatch?: string;
      emailExists?: string;
      registrationFailed?: string;
      signingUp?: string;
      successMessage?: string;
      successful_registration?: string;
      name_too_short?: string;
      email_invalid?: string;
      password_too_short?: string;
      confirm_password_too_short?: string;
      server_error?: string;
    };
  };
  dashboard?: {
    posts?: {
      label?: string;
      title?: string;
      description?: string;
      addPost?: string;
      addNewPost?: string;
      editPost?: string;
      edit?: string;
      delete?: string;
      confirmDelete?: string;
      notFound?: string;
      noTitle?: string;
      noContent?: string;
      invalidId?: string;
      deleteSuccess?: string;
      deleteFailed?: string;
      deleteError?: string;
      deleteTimeout?: string;
      readMore?: string;
      loading?: string;
      formDescription?: string;
      formTitle?: string;
      formContent?: string;
      cancel?: string;
      errorsMessages?: {
        missingFields?: string;
        updateFailed?: string;
        notFound?: string;
        server_error?: string;
      };
      successMessages?: {
        createSuccess?: string;
        updateSuccess?: string;
      };
    };
    postDetail?: {
      loading?: string;
    };
  };
  useProfile?: {
    role?: string;
    logout?: string;
    logoutSuccess?: string;
  };
}
