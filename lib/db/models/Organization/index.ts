import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  // },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

//super admin ->assign admin into organization, he can see all organization,create anuma u assign admini
//admin crud organization, create i depqum assign inqn iran

export default mongoose.models.Organization ||
  mongoose.model('Organization', organizationSchema);
