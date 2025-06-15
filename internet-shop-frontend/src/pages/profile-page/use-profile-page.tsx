import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetMeQuery,
  useUpdateUserByIdMutation,
} from "../../store/api/user-api";
import { profileSchema, ProfileFormData } from "./profile-validation";
import UpdateUser from "../../store/models/user/update-user";
import { useLogoutUserMutation } from "../../store/api/auth-api";
import { useDispatch } from "react-redux";
import { logout, setAvatar } from "../../store/slices/user-slice";
import { useUploadFileMutation } from "../../store/api/files-api";

export const useProfilePage = () => {
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetMeQuery(undefined, { refetchOnMountOrArgChange: true });
  const [updateUser] = useUpdateUserByIdMutation();
  const [uploadFile] = useUploadFileMutation();
  const [logoutUser] = useLogoutUserMutation();
  const dispatch = useDispatch();
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email,
      password: undefined,
      username: user?.username,
      name: user?.name,
      address: user?.address,
      phone: user?.phone,
    },
  });

  useEffect(() => {
    if (user && !isPasswordEditable) {
      form.reset({
        email: user.email,
        password: undefined,
        username: user.username,
        name: user.name,
        address: user.address,
        phone: user.phone,
      });
    }
  }, [form, isPasswordEditable, user]);

  const handleUpdateProfile = async (data: ProfileFormData) => {
    if (!user) return;

    const cleanData = {
      password: data.password ?? undefined,
      email: data.email ?? undefined,
      username: data.username ?? undefined,
      name: data.name ?? undefined,
      address: data.address ?? undefined,
      phone: data.phone ?? undefined,
    };

    const updateData: UpdateUser = {
      ...cleanData,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
    };

    if (!isPasswordEditable) {
      updateData.password = undefined;
    }

    try {
      await updateUser({ id: user.id, updateUser: updateData }).unwrap();
      refetch();
    } catch (err) {
      console.error("Ошибка при обновлении профиля:", err);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите изображение");
        return;
      }

      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        alert("Файл слишком большой. Максимальный размер: 5MB");
        return;
      }

      const formData = new FormData();
      formData.append("files", file);

      const uploadResults = await uploadFile(formData).unwrap();

      if (!uploadResults?.[0]?.path) {
        throw new Error("Неверный формат ответа от сервера");
      }

      await updateUser({
        id: user!.id,
        updateUser: { avatar: uploadResults[0].path },
      });

      dispatch(setAvatar(uploadResults[0].path));

      refetch();
    } catch (err) {
      alert("Не удалось загрузить аватар. Пожалуйста, попробуйте ещё раз.");
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
  };

  return {
    user,
    form,
    isLoading,
    error,
    handleUpdateProfile,
    handleAvatarChange,
    handleLogout,
    isPasswordEditable,
    setIsPasswordEditable,
  };
};
