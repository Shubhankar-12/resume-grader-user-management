export async function fetchReadme(
  username: string,
  repoName: string
): Promise<string> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.v3.raw",
          // Authorization: `Bearer YOUR_GITHUB_TOKEN`, // Optional for higher limits
        },
      }
    );

    if (!response.ok) throw new Error("Failed to fetch README");

    const readmeContent = await response.text();

    return readmeContent;
  } catch (error) {
    console.error(`Error fetching README for ${username}/${repoName}:`, error);
    return "";
  }
}
