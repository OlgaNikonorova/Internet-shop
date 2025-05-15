export default interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
