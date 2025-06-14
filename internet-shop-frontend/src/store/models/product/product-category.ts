export enum ProductCategory {
  DECORATIVE_COSMETICS = "decorative cosmetics",
  PARFUME = "parfume",
  CARE = "care",
  JEWELRY = "jewelry",
}

export const convertProductCategoryToRussian = (category: ProductCategory) => {
  switch (category) {
    case ProductCategory.DECORATIVE_COSMETICS: 
      return "Декоративная косметика";
    case ProductCategory.PARFUME: 
      return "Парфюмерия";
    case ProductCategory.CARE: 
      return "Уход";
    case ProductCategory.JEWELRY: 
      return "Украшения";
  }
}
