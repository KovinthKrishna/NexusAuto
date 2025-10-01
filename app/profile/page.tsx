import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ProfileManager from "@/components/profile/ProfileManager";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileManager />
    </ProtectedRoute>
  );
}
