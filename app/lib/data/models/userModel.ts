interface UserModel {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export default UserModel;
