import mongoose, { Schema, Document } from 'mongoose';

enum UserRole {
  Admin = 'admin',
  User = 'user'
}

interface IUser extends Document {
  id: string;
  username: string;
  password: string;
  email: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  verified: boolean;
}

const UserSchema: Schema = new Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  verified: { type: Boolean, required: true }
});

const UserModel = mongoose.model<IUser>('User', UserSchema);

export default UserModel;