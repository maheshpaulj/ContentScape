import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    // Count total generations
    const generationsSnapshot = await getDocs(collection(db, "generations"));
    const totalGenerations = generationsSnapshot.size;

    // Count unique users (based on users collection)
    const usersSnapshot = await getDocs(collection(db, "users"));
    const totalUsers = usersSnapshot.size;

    // Optionally, aggregate generationCount from users collection
    let totalGenerationCount = 0;
    usersSnapshot.forEach((doc) => {
      const data = doc.data();
      totalGenerationCount += data.generationCount || 0;
    });

    return NextResponse.json({
      totalGenerations,
      totalUsers,
      totalGenerationCount,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
