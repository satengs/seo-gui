import Permisssion from '@/lib/db/models/Permisssion';
import Role from '@/lib/db/models/Role';

const rolesInitial = [
  {
    name: 'super_admin',
    permissions: [
      'overview_view',
      'manage_keywords',
      'manage_users',
      'manage_organizations',
    ],
  },
  {
    name: 'admin',
    permissions: ['overview_view', 'manage_organizations', 'manage_keywords'],
  },
  {
    name: 'user',
    permissions: ['overview_view', 'view_keywords'],
  },
];

export const seedRoles = async () => {
  try {
    const rolesCount = await Role.countDocuments();
    if (rolesCount > 0) {
      console.log('Roles already exist');
      return;
    }
    const permissions = await Permisssion.find();
    if (permissions.length) {
      for (let r = 0; r < rolesInitial.length; r++) {
        const rolePerm = permissions.filter((item) =>
          rolesInitial[r].permissions.includes(item.name)
        );
        const newRole = new Role({
          name: rolesInitial[r].name,
          permissions: rolePerm,
        });
        await newRole.save();
      }
    }

    console.log('Roles seed successfully done');
  } catch (err) {
    console.error('Failed to seed roles table: ', err);
  }
};
