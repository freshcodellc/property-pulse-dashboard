import { getUser } from './auth-client';

async function bootstrapAppData() {
  const data = await getUser();

  if (!data) {
    return { user: null, token: '' };
  }
  const { user } = data;
  return {
    user,
  };
}

export { bootstrapAppData };
