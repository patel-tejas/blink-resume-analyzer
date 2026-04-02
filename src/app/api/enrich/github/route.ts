import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: true, message: "Username is required" },
        { status: 400 }
      );
    }

    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN || undefined,
    });

    // Fetch user profile
    const { data: user } = await octokit.users.getByUsername({ username });

    // Fetch repos sorted by stars
    const { data: repos } = await octokit.repos.listForUser({
      username,
      sort: "updated",
      per_page: 6,
    });

    // Sort by stars descending
    const topRepos = repos
      .sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count ?? 0,
        language: r.language,
        url: r.html_url,
      }));

    return NextResponse.json({
      username: user.login,
      avatar: user.avatar_url,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      topRepos,
      profileUrl: user.html_url,
    });
  } catch (error: unknown) {
    console.error("GitHub API error:", error);

    const message =
      error instanceof Error && error.message.includes("rate limit")
        ? "GitHub rate limit reached. Try again later."
        : "Could not fetch GitHub profile.";

    return NextResponse.json(
      { error: true, message },
      { status: 200 } // Return 200 so client can still proceed
    );
  }
}
