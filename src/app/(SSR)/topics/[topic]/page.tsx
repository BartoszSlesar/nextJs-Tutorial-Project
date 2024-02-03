import { UnsplashImage } from "@/models/unsplash-image";
import Image from "next/image";
import styles from "./TopicPage.module.css";
import { Alert } from "@/app/components/bootstrap";
import { PageProps } from "../../../../../.next/types/app/layout";
import { Metadata } from "next";

interface TopicPageProps {
  params: { topic: string };
  // searchParams: { [key: string]: string | string[] | undefined } -> for search params
}

export function generateStaticParams() {
  // put tags you want to make static beforehead
  return ["health", "fitness", "coding"].map((topic) => ({ topic }));
}

// export const dynamicParams = false;  disables dynamic parameters

export function generateMetadata({
  params: { topic },
}: TopicPageProps): Metadata {
  return {
    title: topic + " - NextJS Image Galery",
  };
}

export default async function Page({ params: { topic } }: TopicPageProps) {
  const response = await fetch(
    `https://api.unsplash.com/photos/random?query=${topic}&count=20&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  );
  const images: UnsplashImage[] = await response.json();

  return (
    <div>
      <h1>{topic}</h1>
      <Alert>
        This page uses <strong>generateStaticParams</strong> to render and cache
        static pages at build time, even though the URL has a dynamic parameter.
        Pages that are not included in generateStaticParams will be fetched &
        rendered on first access and then{" "}
        <strong>cached for subsequent requests</strong> (this can be disabled).
      </Alert>
      {images.map((image) => (
        <Image
          src={image.urls.raw}
          width={250}
          height={250}
          alt={image.description}
          key={image.urls.raw}
          className={styles.image}
        />
      ))}
    </div>
  );
}
