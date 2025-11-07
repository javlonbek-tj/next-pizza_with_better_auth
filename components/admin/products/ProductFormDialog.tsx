'use client';

import { Plus, AlertCircle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

import { ImageUploadInput } from '@/components/shared/ImageUploadInput';
import { FormActions } from '@/components/shared/FormActions';

import { ProductWithRelations } from '@/prisma/@types/prisma';
import { MultiSelect } from '@/components/shared/MultiSelect';
import { Category, Ingredient, ProductItem } from '@/lib/generated/prisma';
import {
  useProductForm,
  useProductImageUpload,
  useProductItems,
} from '@/hooks/admin/use-products';
import {
  useGetCategories,
  useGetIngredients,
  useGetPizzaSizes,
  useGetPizzaTypes,
} from '@/hooks';
import { ProductItemCard } from './ProductItemCard';

interface Props {
  open: boolean;
  onClose: () => void;
  product?: ProductWithRelations | null;
}

export function ProductFormDialog({ open, onClose, product }: Props) {
  const { form, isEditing, isPending, onSubmit, isPizzaCategory } =
    useProductForm(product, open, onClose);

  const {
    previewUrl,
    isUploading,
    uploadFile,
    handleRemoveImage,
    cleanupOrphanedImage,
    markAsSubmitted,
    resetImageState,
  } = useProductImageUpload(product, open, form);

  const { productItems, addProductItem, removeProductItem, updateProductItem } =
    useProductItems(form);

  // Fetch select options
  const { data: categories, isPending: isCategoriesLoading } =
    useGetCategories();
  const { data: ingredients, isPending: isIngredientsLoading } =
    useGetIngredients();
  const { data: pizzaSizes, isPending: isSizesLoading } = useGetPizzaSizes();
  const { data: pizzaTypes, isPending: isTypesLoading } = useGetPizzaTypes();

  const isLoadingOptions =
    isCategoriesLoading ||
    isIngredientsLoading ||
    isSizesLoading ||
    isTypesLoading;

  const handleSubmit = (data: any) => {
    console.log('Form data:', data);
    console.log('Form errors:', form.formState.errors);
    console.log('Is Pizza Category:', isPizzaCategory);

    onSubmit(data, () => {
      markAsSubmitted();
      resetImageState();
    });
  };

  const handleClose = async (isOpen: boolean) => {
    if (!isOpen) {
      await cleanupOrphanedImage();
    }
    onClose();
  };

  // Handle category change - reset product items if switching to/from pizza
  const handleCategoryChange = (value: string) => {
    const newCategoryId = value === 'none' ? null : value;
    const wasPizza = isPizzaCategory;

    form.setValue('categoryId', newCategoryId);

    console.log(form.formState.errors);

    // Check if new category is pizza
    const newCategory = categories?.find(
      (cat: Category) => cat.id === newCategoryId
    );
    const isNewPizza = newCategory?.name.toLowerCase() === 'пиццы';

    // If switching between pizza and non-pizza, reset items
    if (wasPizza !== isNewPizza) {
      form.setValue('productItems', [
        {
          price: 0,
          sizeId: null,
          typeId: null,
        },
      ]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[850px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            {isEditing ? 'Редактировать продукт' : 'Создать новый продукт'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {isEditing
              ? 'Измените информацию о продукте и его вариантах'
              : 'Заполните информацию о новом продукте и создайте варианты'}
          </DialogDescription>
        </DialogHeader>

        {isLoadingOptions ? (
          <div className="space-y-4 py-4">
            <Skeleton className="rounded-lg w-full h-48" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-full h-32" />
            <Skeleton className="w-full h-32" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-md">
                    <Info className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Основная информация</h3>
                </div>

                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Изображение продукта{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <ImageUploadInput
                          value={previewUrl}
                          onChange={field.onChange}
                          onUpload={uploadFile}
                          onRemove={handleRemoveImage}
                          isUploading={isUploading}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Название продукта{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Например: Пепперони, Маргарита, Четыре сыра"
                          {...field}
                          disabled={isPending}
                          autoComplete="off"
                          className="text-base"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Категория <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        value={field.value ?? 'none'}
                        onValueChange={handleCategoryChange}
                        disabled={isPending || !categories?.length}
                      >
                        <FormControl>
                          <SelectTrigger className="text-base">
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Без категории</SelectItem>
                          {categories?.map((category: Category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {categories?.length
                          ? isPizzaCategory
                            ? 'Для пиццы будут доступны размеры и типы теста'
                            : 'Для других категорий указывается только цена'
                          : 'Сначала создайте категории в разделе "Категории"'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ingredients */}
                <FormField
                  control={form.control}
                  name="ingredientIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Ингредиенты</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={
                            ingredients?.map((ing: Ingredient) => ({
                              label: ing.name,
                              value: ing.id,
                            })) || []
                          }
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Выберите ингредиенты"
                          disabled={isPending || !ingredients?.length}
                        />
                      </FormControl>
                      <FormDescription>
                        {ingredients?.length
                          ? 'Выберите ингредиенты, входящие в состав продукта'
                          : 'Сначала создайте ингредиенты в разделе "Ингредиенты"'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Product Items Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="flex items-center gap-2 font-semibold text-lg">
                      {isPizzaCategory ? 'Варианты пиццы' : 'Цена продукта'}
                      <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {isPizzaCategory
                        ? 'Создайте варианты с разными размерами, типами теста и ценами'
                        : 'Укажите цену продукта'}
                    </p>
                  </div>
                  {isPizzaCategory && (
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={addProductItem}
                      disabled={isPending}
                      className="cursor-pointer"
                    >
                      <Plus className="mr-2 w-4 h-4" />
                      Добавить вариант
                    </Button>
                  )}
                </div>

                {/* Info Alert for Pizza */}
                {isPizzaCategory &&
                  (!pizzaSizes?.length || !pizzaTypes?.length) && (
                    <Alert className="bg-amber-50 border-amber-200">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <AlertTitle className="text-amber-900">
                        Внимание
                      </AlertTitle>
                      <AlertDescription className="text-amber-800">
                        {!pizzaSizes?.length && !pizzaTypes?.length
                          ? 'Сначала создайте размеры и типы пиццы в соответствующих разделах'
                          : !pizzaSizes?.length
                          ? 'Сначала создайте размеры пиццы в разделе "Размеры пиццы"'
                          : 'Сначала создайте типы пиццы в разделе "Типы пиццы"'}
                      </AlertDescription>
                    </Alert>
                  )}

                {productItems.length === 0 ? (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertTitle>Нет вариантов продукта</AlertTitle>
                    <AlertDescription>
                      Добавьте хотя бы один вариант продукта. Нажмите
                      &quot;Добавить вариант&quot; чтобы создать.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {productItems.map((item: ProductItem, index: number) => (
                      <ProductItemCard
                        key={index}
                        item={item}
                        index={index}
                        pizzaSizes={pizzaSizes || []}
                        pizzaTypes={pizzaTypes || []}
                        onUpdate={updateProductItem}
                        onRemove={removeProductItem}
                        disabled={isPending}
                        canRemove={isPizzaCategory && productItems.length > 1}
                        isPizzaCategory={isPizzaCategory}
                      />
                    ))}
                  </div>
                )}

                {form.formState.errors.productItems && (
                  <Alert variant="destructive">
                    <AlertCircle className="w-4 h-4" />
                    <AlertDescription>
                      {form.formState.errors.productItems.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Actions */}
              <FormActions
                isEditing={isEditing}
                isPending={isPending}
                isLoading={isUploading}
                onCancel={() => handleClose(false)}
                className="pt-2"
              />
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
