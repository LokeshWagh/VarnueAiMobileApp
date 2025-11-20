// app/index.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // always go to login when app opens
  }, []);

  return null;
}
