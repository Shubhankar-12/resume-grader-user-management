import { paymentSubscriptionQueries, userQueries } from "../../db";
import { userModel } from "../../db/user";
import { planLimits } from "../constants/constant";

export async function resetUsageCron() {
  try {
    const allUsers = await userModel.find({ status: "ENABLED" });
    if (!allUsers || allUsers.length === 0) {
      console.log("No users found to reset usage.");
      return;
    }
    const results = await Promise.all(
      allUsers.map(async (user) => {
        const userPlan =
          await paymentSubscriptionQueries.getUserCurrentSubscription(user._id);
        if (!userPlan || userPlan.length === 0) {
          console.log(
            `No active subscription found for user ${user._id}. Adding default usage.`
          );
          return await userQueries.updateUser({
            user_id: user._id,
            usage: {
              resumeUploads: 0,
              tailoredResumes: 0,
              coverLetters: 0,
              githubAnalyses: 0,
            },
          });
        } else {
          const plan = userPlan[0].plan || "FREE";
          const defaultUsage = {
            resumeUploads: 0,
            tailoredResumes: 0,
            coverLetters: 0,
            githubAnalyses: 0,
          };

          // Reset usage based on plan limits
          return await userQueries.updateUser({
            user_id: user._id,
            usage: {
              ...defaultUsage,
              ...planLimits[plan],
            },
          });
        }
      })
    );

    console.log("Usage reset completed for all users:", results);
  } catch (error) {
    console.error("Error resetting usage:", error);
  }
}
