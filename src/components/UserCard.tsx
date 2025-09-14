import { User } from '@/lib/database';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm transition-all hover:shadow-md bg-white">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👤</span>
          <h3 className="font-semibold text-lg">
            {user.name}
          </h3>
        </div>
      </div>
      
      <div className="space-y-2 mb-3">
        <p className="text-gray-600 flex items-center gap-2">
          <span>📧</span>
          {user.email}
        </p>

      </div>
      
    </div>
  );
}
