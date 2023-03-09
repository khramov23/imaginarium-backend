import { UserDocument } from '../../user/user.model';
import { Types } from 'mongoose';

export class UserResponse {
  _id: Types.ObjectId;
  username: string;
  email: string;
  isActivated: boolean;
  role: string;
  followers: Types.ObjectId[];
  subscriptions: Types.ObjectId[];
  favorites: Types.ObjectId[];
  own: Types.ObjectId[];
  avatar: string;

  constructor(user: UserDocument) {
    this._id = user._id;
    this.username = user.username;
    this.email = user.email;
    this.isActivated = user.isActivated;
    this.role = user.role.value;
    this.followers = user.followers;
    this.subscriptions = user.subscriptions;
    this.favorites = user.favorites;
    this.own = user.own;
    this.avatar = user.avatar;
  }
}
