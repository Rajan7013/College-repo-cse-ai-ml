export default function SignOutButton({ children }: { children: React.ReactNode }) {
    // Mobile-specific Sign Out not needed if we rely on Clerk's default or Profile page actions.
    // This is a placeholder if we need a dedicated mobile logout.
    // Since we use /profile page for settings, user can sign out there.
    return <>{children}</>;
}
