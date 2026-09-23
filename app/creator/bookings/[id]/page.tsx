import Workspace from "@/components/marketplace/Workspace";
export default async function Page({params}: {params: Promise<{id: string}>}) { const {id} = await params; return <Workspace role="creator" section="bookings" id={id} />; }
