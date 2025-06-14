export enum ProductStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
}

export const convertProductStatusToRussian = (category: ProductStatus) => {
  switch (category) {
    case ProductStatus.ACTIVE:
      return "Активный";
    case ProductStatus.INACTIVE:
      return "Неактивный";
    case ProductStatus.DRAFT:
      return "Редактируется";
  }
};
