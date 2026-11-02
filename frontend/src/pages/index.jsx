import Image from "next/image";
import { Poppins } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

// Self-hosted and preloaded by Next.js; only the weights this page uses
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-poppins" });

export default function Home() {


  const router = useRouter()

  return (
    <UserLayout>
      <div className={`${styles.container} ${poppins.variable}`}>

        <div className={styles.mainContainer}>

          <div className={styles.mainContainer_left}>
            <p>Connect with Friends without Exaggeration</p>
            <p>A True social media platform, with stories, no blufs!</p>
            <div onClick={()=>{
              router.push("/login")
            }} className={styles.buttonJoin}>
              <p>Join Now</p>
            </div>
          </div>

          <div className={styles.mainContainer_right}>
            {/* Hero is the LCP element: served resized as WebP/AVIF and preloaded */}
            <Image
              className={styles.img}
              src="/images/img1.png"
              alt=""
              width={480}
              height={480}
              sizes="(max-width: 480px) 14rem, (max-width: 768px) 18rem, (max-width: 1024px) 22rem, 30rem"
              priority
            />
          </div>

        </div>

      </div>
    </UserLayout>
  );
}
