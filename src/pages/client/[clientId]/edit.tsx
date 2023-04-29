import { useRouter } from "next/router";

export default function ClientEdit() {
  const router = useRouter();

  return <main>ClientEdit routes: {router.query.clientId}</main>;
}
