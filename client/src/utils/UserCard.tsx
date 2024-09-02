import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
type UserCardProps = {
  username: string;
};

const UserCard = ({ username }: UserCardProps) => {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-800 shadow-lg rounded-lg hover:bg-gray-700 transition-colors duration-300">
      <Avatar className="w-16 h-16 border-2 border-gray-600 rounded-full overflow-hidden">
        <AvatarImage
          src="/naruto.jpg"
          alt="User 2"
          className="object-cover w-full h-full"
        />
        <AvatarFallback className="bg-gray-600 text-gray-200">
          {username}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-semibold text-white">{username}</h3>
        <p className="text-sm text-gray-400">User</p>
      </div>
    </div>
  );
};

export default UserCard;
