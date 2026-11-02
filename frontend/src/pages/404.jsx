import Head from "next/head";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

export default function NotFound() {
  const router = useRouter();

  return (
    <UserLayout>
      <Head>
        <title>Page not found · ProLink</title>
      </Head>
      <main
        style={{
          minHeight: "calc(100vh - var(--nav-h))",
          display: "grid",
          placeItems: "center",
          padding: "var(--s-5)",
          textAlign: "center",
        }}
      >
        <div>
          <p className="eyebrow">Error 404</p>
          <h1 className="display" style={{ fontSize: "var(--text-hero)", marginTop: "var(--s-4)" }}>
            This link is <em>broken</em>.
          </h1>
          <p style={{ color: "var(--muted)", marginTop: "var(--s-4)" }}>
            The page or profile you&apos;re looking for doesn&apos;t exist.
          </p>
          <div style={{ display: "flex", gap: "var(--s-3)", justifyContent: "center", marginTop: "var(--s-6)" }}>
            <button type="button" className="btn btn-accent" onClick={() => router.push("/")}>
              Back home
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => router.push("/discover")}>
              Discover people
            </button>
          </div>
        </div>
      </main>
    </UserLayout>
  );
}
