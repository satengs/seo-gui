import Roles from '@/lib/db/models/schemas/Roles';

const rolesInitial = [
  {
    name: 'super_admin',
  },
  {
    name: 'admin',
  },
  {
    name: 'user',
  },
];

export const seedRoles = async () => {
  try {
    for (let r = 0; r < rolesInitial.length; r++) {
      await Roles.create({
        name: rolesInitial[r].name,
      });
    }
    console.log('Roles seed successfully done');
  } catch (err) {
    console.error('Failed to seed roles table: ', err);
  }
};
