import UserModel from '../models/userModel';

type RawUserData = Record<string, string | undefined>;

export function mapToUserModel(data: RawUserData): UserModel {
  return {
    id: data.id ?? data._id ?? '',
    email: data.email ?? '',
    name: data.name ?? '',
    role: (data.role as 'admin' | 'user') ?? 'user',
  };
}

export function mapToUserModels(dataArray: RawUserData[]): UserModel[] {
  return dataArray.map(mapToUserModel);
}
