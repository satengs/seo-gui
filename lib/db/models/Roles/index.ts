import * as mongoose from 'mongoose';

const rolesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Roles || mongoose.model('Roles', rolesSchema);
