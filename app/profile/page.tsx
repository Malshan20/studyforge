import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProfileCard } from "@/components/profile/profile-card"
import { AchievementsGrid } from "@/components/profile/achievements-grid"
import { AvatarSelector } from "@/components/profile/avatar-selector"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch achievements
  const { data: achievements } = await supabase.from("achievements").select("*")

  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("achievement_id, unlocked_at")
    .eq("user_id", user.id)

  const unlockedIds = new Set(userAchievements?.map((ua) => ua.achievement_id) || [])

  const achievementsWithStatus = achievements?.map((achievement) => ({
    ...achievement,
    unlocked: unlockedIds.has(achievement.id),
    unlocked_at: userAchievements?.find((ua) => ua.achievement_id === achievement.id)?.unlocked_at,
  }))

  // Fetch available avatars
  const { data: avatars } = await supabase.from("avatars").select("*")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <DashboardHeader profile={profile} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-1">
            <ProfileCard profile={profile} />
            <AvatarSelector
              avatars={avatars || []}
              currentAvatar={profile?.avatar_url}
              userLevel={profile?.level || 1}
            />
          </div>
          <div className="lg:col-span-2">
            <AchievementsGrid achievements={achievementsWithStatus || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
