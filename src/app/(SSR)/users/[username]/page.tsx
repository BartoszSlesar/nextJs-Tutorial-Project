import { Alert } from "@/app/components/bootstrap";
import { Metadata } from "next";
import { UnsplashUser } from "@/models/unsplash-user";
import { notFound } from "next/navigation";
import { cache } from "react";

interface UserPageProps {
  params: { username: string };
}

async function getUser(username: string): Promise<UnsplashUser> {
  // The nextjs will not duplicate the fetch data if it the same call but only for fetch method, it does not work on others like axion
  const response = await fetch(
    `https://api.unsplash.com/users/${username}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  );

  if (response.status === 404) {
    notFound();
  }

  return await response.json();
}

// To not call the same call twise use bellow

// const thisIsNameYouChoose = cache(getUser); use this variable if you are using diferent call method than fetch

export async function generateMetadata({
  params: { username },
}: UserPageProps): Promise<Metadata> {
  const user = await getUser(username);
  return {
    title:
      ([user.first_name, user.last_name].filter(Boolean).join(" ") ||
        user.username) + " - NextJS Image Galery",
  };
}

export default async function Page({ params: { username } }: UserPageProps) {
  const user = await getUser(username);

  return (
    <div>
      <Alert>
        This profile page uses <strong>generateMetadata</strong> to set the{" "}
        <strong>page title</strong> dynamically from the API response.
      </Alert>
      <h1>{user.username}</h1>
      <p>First name: {user.first_name}</p>
      <p>Last name: {user.last_name}</p>
      <a href={"https://unsplash.com/" + user.username}> Unsplash profile</a>
    </div>
  );
}
