import "../style.css";

export const metadata = {
    title: "Skyline Weather",
    description: "A clear, focused weather dashboard for the places that matter to you.",
    manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }) {
    return <html lang="en" dir="ltr"><body>{children}</body></html>;
}
