export type CategoryInfor = {
  categoryId: number;
  iconName: string;
  title: string;
  description: null | string;
  subCategories: CategoryInfor[];
};
