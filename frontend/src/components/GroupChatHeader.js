import React from "react";
import { Users } from "lucide-react";

export default function GroupChatHeader({ groupId }) {
  // Placeholder: Replace with real group data fetch
  return (
    <div className="bg-green-700 text-white px-6 py-4 flex items-center gap-4 rounded-b-2xl shadow-lg max-w-2xl mx-auto mt-6">
      <Users className="w-8 h-8" />
      <div>
        <div className="font-bold text-xl">Farmer Group Name</div>
        <div className="text-sm">Members: 12</div>
      </div>
      <div className="ml-auto">
        {/* Profile/Settings button or info here */}
      </div>
    </div>
  );
}
