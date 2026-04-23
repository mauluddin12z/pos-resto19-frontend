import React, { useCallback, useState } from "react";
import LoadingButton from "../ui/LoadingButton";
import TextInput from "../ui/TextInput";

interface formErrors {
   categoryName?: string;
}

interface CategoryFormProps {
   formData: any;
   formErrors: formErrors;
   isSubmitting: boolean;
   isAdding: boolean;
   handleChange: (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
   ) => void;
   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
const CategoryForm = ({
   formData,
   formErrors,
   isSubmitting,
   isAdding,
   handleChange,
   handleSubmit,
}: CategoryFormProps) => {
   return (
      <div className="max-w-sm mx-auto bg-white rounded-lg overflow-hidden p-2">
         <form onSubmit={handleSubmit}>
            {/* Header */}
            <h2 className="text-2xl font-semibold text-gray-800">
               {isAdding ? "Add Category" : "Edit Category"}
            </h2>

            {/* Category Name */}
            <div className="mb-4 mt-4">
               <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-gray-700"
               >
                  Category Name
               </label>
               {formErrors.categoryName && (
                  <p className="text-xs text-red-500 mb-1">
                     {formErrors.categoryName}
                  </p>
               )}
               <TextInput
                  id="categoryName"
                  name="categoryName"
                  placeholder="Enter category name"
                  value={formData.categoryName}
                  onChange={handleChange}
               />
            </div>

            {/* Submit Button */}
            <button
               type="submit"
               className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  isSubmitting
                     ? "opacity-50 cursor-not-allowed"
                     : "cursor-pointer"
               }`}
               disabled={isSubmitting}
            >
               {isSubmitting ? (
                  isAdding ? (
                     <div className="flex gap-2 justify-center items-center">
                        <LoadingButton /> Adding...
                     </div>
                  ) : (
                     <div className="flex gap-2 justify-center items-center">
                        <LoadingButton /> Updating...
                     </div>
                  )
               ) : isAdding ? (
                  "Add Category"
               ) : (
                  "Save Changes"
               )}
            </button>
         </form>
      </div>
   );
};

export default CategoryForm;
