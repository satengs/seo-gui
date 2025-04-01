import Permisssion from '@/lib/db/models/Permisssion';

const permissions = [
  { name: 'overview_view', description: 'Can view the AI Overview' },
  {
    name: 'manage_keywords',
    description: 'Can view and do full actions with keywords',
  },
  {
    name: 'view_keywords',
    description: 'Can only do readonly action with keywords',
  },
  { name: 'manage_users', description: 'Can manage users' },
  { name: 'manage_organizations', description: 'Can manage organizations' },
];

export async function seedPermissions() {
  try {
    const permissionsCount = await Permisssion.countDocuments();
    if (permissionsCount > 0) {
      console.log('Permissions already exist');
      return; // Skip seeding if permissions already exist
    }
    for (let p = 0; p < permissions.length; p++) {
      const newPermission = new Permisssion({
        name: permissions[p].name,
        description: permissions[p].description,
      });
      await newPermission.save();
    }
    console.log('Permissions seed successfully done');
  } catch (err) {
    console.error('Failed to seed permissions: ', err);
  }
}
