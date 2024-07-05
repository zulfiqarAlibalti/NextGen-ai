import { useUser } from "@clerk/nextjs";
import { Avatar,
     AvatarFallback,
      AvatarImage 
} from "@/components/ui/avatar";

export const UserAvatar = () => {
    const { user } = useUser();

    const profileImageUrl = user?.profileImageUrl || "";
    const firstNameInitial = user?.firstName?.charAt(0) || "";
    const lastNameInitial = user?.lastName?.charAt(0) || "";

    return (
        <Avatar className="h-8 w-8">
            <AvatarImage src={profileImageUrl} />
            <AvatarFallback>
                {firstNameInitial}
                {lastNameInitial}
            </AvatarFallback>
        </Avatar>
    );
};
