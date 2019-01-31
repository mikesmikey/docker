import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {roleType, defaultRoleType} from '../../config/role';
import mongoosePaginate from 'mongoose-paginate';
const { Schema } = mongoose;

export const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  roles: { 
    type: [{ type: String, enum: roleType }],
    default: defaultRoleType
  },
  status: { 
    type: Boolean,
    default: true
  },
}, {
  timestamps: true,
});


UserSchema.pre('save', function(next) {
  const user = this;
  var SALT_FACTOR = 5;
  
  if(!user.isModified('password')) {
    return next();
  }
  this.password = bcrypt.hashSync(this.password, SALT_FACTOR);
  next();
});

UserSchema.methods.comparePassword = function(passwordAttempt, cb) {
  bcrypt.compare(passwordAttempt, this.password, (err, isMatch) => {
    if(err) {
      return cb(err);
    } else {
      cb(null, isMatch);
    }
  });
}
UserSchema.plugin(mongoosePaginate);
export default mongoose.model('User', UserSchema);