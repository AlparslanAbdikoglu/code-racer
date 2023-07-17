import Image from "next/image";

import { getCurrentUser } from "@/lib/session";

import Achievement from "@/components/achievement";
import { AddBio } from "@/components/add-bio";
import { achievements } from "@/config/achievements";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ChangeNameForm from "./_components/change-name-form";
import ProfileNav from "./_components/profile-nav";
import { Heading } from "@/components/ui/heading";
import LogoutBtn from "./_components/logout-button";

export const metadata = {
  title: "Profile Page",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const photoURL = user?.image as string;
  const displayName = user?.name as string;
  const uid = user?.id as string;
  const userAchievements = await prisma.achievement.findMany({
    where: {
      userId: uid,
    },
  });
  const totalPoints = 0;

  return (
    <main>
      <article className="md:h-[calc(100vh-56px)]">
        <section className="w-full h-full gap-5 md:flex">
          <div className="w-full py-5 border-b md:w-1/3 md:border-r md:border-b-0 md:pt-[20vh]">
            <div>
              <Link
                href={`/view-photo?photoURL=${photoURL}`}
                title="View Profile Picture"
                prefetch
                className="block w-40 mx-auto rounded-full"
              >
                <Image
                  src={photoURL ?? "/placeholder-image.jpg"}
                  alt="Profile Picture"
                  width={200}
                  height={200}
                  loading="eager"
                  fetchPriority="high"
                  priority
                  className="object-cover w-full h-full rounded-full"
                />
              </Link>
            </div>
            <div className="mt-5">
              <ChangeNameForm displayName={displayName} />
            </div>
            <div className="flex items-center justify-center gap-5">
              <AddBio />
              <span>Total Points: {totalPoints}</span>
            </div>
            <div className="flex items-center justify-center gap-5 mt-10">
              <ProfileNav displayName={displayName} />
              <LogoutBtn />
            </div>
          </div>
          <div className="flex-1 md:h-full md:overflow-y-auto">
            {userAchievements.length ? (
              <>
                <div className="py-5">
                  <Heading title="Achievements" centered />
                </div>
                <ul className="flex flex-wrap p-5">
                  {userAchievements.map(({ achievementType, unlockedAt }) => {
                    const achievement = achievements.find(
                      (achievement) => achievement.type === achievementType,
                    );
                    if (!achievement) return null;
                    return (
                      <Achievement
                        key={achievement.type}
                        achievement={{
                          name: achievement.name,
                          description: achievement.description,
                          unlockedAt,
                          image: achievement.image,
                        }}
                      />
                    );
                  })}
                </ul>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full md:pt-[12vh]">
                <p className="p-5 text-2xl font-bold">
                  Sorry currently you have no achievements.
                  <Link href="/race" className="underline">
                    Race
                  </Link>{" "}
                  to earn some{" "}
                </p>
                <Image
                  src="/images/achiebement_page.svg"
                  width={500}
                  height={500}
                  alt="image"
                />
              </div>
            )}
          </div>
        </section>
      </article>
    </main>
  );
}
