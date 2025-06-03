import { useState } from 'react';
import {
  Container,
  Paper,
  Avatar,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useGetMeQuery, useUpdateUserByIdMutation, useDeleteUserByIdMutation } from '../../store/api/user-api';
import ProfileForm from '../../components/profile-form/profile-form';
import UpdateUser from '../../store/models/user/update-user';

const ProfilePage = () => {
  const { data: user, isLoading, error, refetch } = useGetMeQuery();
  const [updateUser] = useUpdateUserByIdMutation();
  const [deleteUser] = useDeleteUserByIdMutation();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleUpdateProfile = async (updateData: UpdateUser) => {
    if (!user) return;
    try {
      await updateUser({ 
        id: user.id, 
        updateUser: updateData 
      }).unwrap();
      refetch();
    } catch (err) {
      console.error('Ошибка обновления профиля:', err);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    console.error('No Ошибка удаления аккаунта:');
    try {
      await deleteUser(user.id).unwrap();
    } catch (err) {
      console.error('Ошибка удаления аккаунта:', err);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Ошибка загрузки данных пользователя
      </Alert>
    );
  }

  if (!user) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        Пользователь не найден
      </Alert>
    );
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

//   const getRoleName = (role: UserRole) => {
//     const roleNames = {
//       [UserRole.ADMIN]: 'Администратор',
//       [UserRole.USER]: 'Пользователь',
//     };
//     return roleNames[role] || role;
//   };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Исправленное использование Grid */}
      <Grid container spacing={3} component="div">
        {/* Блок с информацией */}
        <Grid container component="div">
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={user.avatar || '/default-avatar.png'}
              sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Логин: {user.username}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Телефон: {user.phone || 'не указан'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Адрес: {user.address || 'не указан'}
            </Typography>
            {/* <Typography variant="body2" gutterBottom>
              Роль: {getRoleName(user.role)}
            </Typography> */}
            <Typography variant="body2" gutterBottom>
              Дата регистрации: {formatDate(user.createdAt)}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              sx={{ mt: 3 }}
              onClick={() => setOpenDeleteDialog(true)}
            >
              Удалить аккаунт
            </Button>
          </Paper>
        </Grid>

        {/* Форма редактирования */}
        <Grid container component="div">
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Редактировать профиль
            </Typography>
            <ProfileForm 
              user={user} 
              onSubmit={handleUpdateProfile} 
            />
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Подтвердите удаление</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Отмена</Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained">
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;