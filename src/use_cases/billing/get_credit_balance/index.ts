import { UserQueries } from '../../../db/queries/UserQueries';
import { userModel } from '../../../db/user';

export async function getCreditBalanceUseCase(userId: string): Promise<{ balance: number }> {
  const userQ = new UserQueries(userModel);
  const users = await userQ.getUserById(userId);
  const user = Array.isArray(users) ? users[0] : users;
  return { balance: user?.credit_balance ?? 0 };
}
