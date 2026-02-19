'use client';

import { Plus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

import { ImageUploadInput } from '@/components/shared/ImageUploadInput';
import { FormActions } from '@/components/shared/FormActions';

import {
  ProductWithRelations,
  Category,
  Ingredient,
  PizzaSize,
  PizzaType,
} from '@/types';
import { MultiSelect } from '@/components/shared/MultiSelect';
import { useProductForm, useProductItems, useImageUpload } from '@/hooks';
import { ProductItemCard } from './ProductItemCard';

interface Props {
  open: boolean;
  onClose: () => void;
  product: ProductWithRelations | null;
  categories: Category[];
  ingredients: Ingredient[];
  sizes: PizzaSize[];
  types: PizzaType[];
}

export function ProductFormDialog({
  open,
  onClose,
  product,
  categories,
  ingredients,
  sizes,
  types,
}: Props) {
  const {
    previewUrl,
    removeImage,
    isUploading: isImageUploading,
    uploadFile,
    cleanupOrphanedImage,
    markAsSubmitted,
  } = useImageUpload(product?.imageUrl, open, 'products', product?.imageUrl);

  const {
    form,
    isEditing,
    isPending,
    isPizza,
    handleCategoryChange,
    onSubmit,
  } = useProductForm({
    product,
    open,
    onClose,
    markAsSubmitted,
    categories, // Pass categories to the hook
  });

  const { productItems, addProductItem, removeProductItem } =
    useProductItems(form);

  const handleClose = async (isOpen: boolean) => {
    if (!isOpen) {
      await cleanupOrphanedImage();
    }
    onClose();
  };

  const handleRemoveImage = async () => {
    await removeImage();
    form.setValue('imageUrl', '', { shouldValidate: true });
  };

  const handleUploadFile = async (file: File) => {
    const res = await uploadFile(file);
    if (!res.success) {
      form.setError('imageUrl', {
        type: 'manual',
        message: res.message,
      });
      return;
    }
    form.clearErrors('imageUrl');
    form.setValue('imageUrl', res.data?.imageUrl || '', {
      shouldValidate: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">
            {isEditing ? 'Редактировать продукт' : 'Создать новый продукт'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                render={() => (
                  <FormItem>
                    <FormLabel className="text-base">
                      Изображение продукта{' '}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <ImageUploadInput
                        value={previewUrl}
                        onUpload={handleUploadFile}
                        onRemove={handleRemoveImage}
                        isUploading={isImageUploading}
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
                      Название продукта <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Например: Пепперони, Маргарита, Четыре сыра"
                        {...field}
                        disabled={isPending}
                        autoComplete="off"
                        className="h-10 text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Категория <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={handleCategoryChange}
                      value={field.value}
                      disabled={isPending || isEditing} // Disable when editing
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите категорию" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: Category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isEditing && (
                      <FormDescription className="text-muted-foreground text-xs">
                        Категорию нельзя изменить при редактировании
                      </FormDescription>
                    )}
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
                        className="w-full h-10!"
                      />
                    </FormControl>
                    <FormDescription>
                      {ingredients?.length
                        ? ''
                        : 'Сначала создайте ингредиенты в разделе "Ингредиенты"'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Product Items Section */}
            <div className="space-y-4">
              <AnimatePresence>
                {isPizza && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex justify-end overflow-hidden"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={isPizza ? 'space-y-3' : ''}>
                <AnimatePresence mode="popLayout">
                  {productItems.map((_, index: number) => (
                    <ProductItemCard
                      key={index}
                      form={form}
                      index={index}
                      pizzaSizes={sizes || []}
                      pizzaTypes={types || []}
                      onRemove={removeProductItem}
                      disabled={isPending}
                      canRemove={isPizza ? productItems.length > 1 : false}
                      isPizza={isPizza}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Actions */}
            <FormActions
              isEditing={isEditing}
              isPending={isPending}
              isLoading={isImageUploading}
              onCancel={() => handleClose(false)}
              className="pt-2"
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
