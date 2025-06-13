import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetMeQuery,
  useUpdateUserByIdMutation,
  useDeleteUserByIdMutation,
} from "../../store/api/user-api";
import { profileSchema, ProfileFormData } from "./profile-validation";
import UpdateUser from "../../store/models/user/update-user";

export const useProfile = () => {
  const { data: user, isLoading, error, refetch } = useGetMeQuery();
  const [updateUser] = useUpdateUserByIdMutation();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [avatarBase64, setAvatarBase64] = useState<string>("");

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      name: "",
      address: "",
      phone: "",
      avatar: undefined,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
        username: user.username || "",
        name: user.name || "",
        address: user.address || "",
        phone: user.phone || "",
        password: "",
      });
      setAvatarPreview(user.avatar || null);
      setAvatarBase64(user.avatar || ""); 
    }
  }, [user]);

  const handleUpdateProfile = async (data: ProfileFormData) => {
    if (!user) return;

    const updateData: UpdateUser = {
      email: data.email,
      password: data.password || "",
      username: data.username,
      name: data.name,
      address: data.address,
      phone: data.phone,
      avatar: avatarBase64 || "", 
      role: user.role,            
      status: user.status,        
    };

    if (data.password) {
    updateData.password = data.password;
  }
  
    try {
      await updateUser({ id: user.id, updateUser: updateData }).unwrap();
      refetch();
    } catch (err) {
      console.error("Ошибка при обновлении профиля:", err);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("avatar", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarPreview(result);
        setAvatarBase64(result); 
      };
      reader.readAsDataURL(file); 
    }
  };

  return {
    user,
    form,
    avatarPreview,
    isLoading,
    error,
    openDeleteDialog,
    setOpenDeleteDialog,
    handleUpdateProfile,
    handleAvatarChange,
  };
};
