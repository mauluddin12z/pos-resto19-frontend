import React from "react";
import { Field } from "../ui/Field";
import { FormInput } from "../ui/FormInput";

interface formErrors {
  categoryName?: string;
}

interface CategoryFormProps {
  formData: any;
  formErrors: formErrors;
  isDisable: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
const CategoryForm = ({
  formData,
  formErrors,
  isDisable,
  handleChange,
  handleSubmit,
}: CategoryFormProps) => {
  return (
    <form id="category-form" onSubmit={handleSubmit} className="space-y-5">
      <Field
        label="Nama Kategori"
        htmlFor="categoryName"
        required
        error={formErrors.categoryName}
        hint="Contoh: Makanan, Minuman, Snack"
      >
        <FormInput
          id="categoryName"
          name="categoryName"
          placeholder="Masukkan nama kategori"
          value={formData.categoryName}
          onChange={handleChange}
          disabled={isDisable}
        />
      </Field>
    </form>
  );
};

export default CategoryForm;
