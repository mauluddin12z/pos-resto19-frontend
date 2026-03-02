import React from "react";
import LoadingButton from "../ui/LoadingButton";
import TextInput from "../ui/TextInput";

interface formErrors {
   name?: string;
   username?: string;
   password?: string;
   role?: string;
}
interface UserFormProps {
   formData: any;
   isSubmitting: boolean;
   isAdding: boolean;
   handleChange: (
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
   ) => void;
   handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
   formErrors: formErrors;
}

const UserForm = ({
   formData,
   isSubmitting,
   isAdding,
   handleChange,
   handleSubmit,
   formErrors,
}: UserFormProps) => {
   const userRole = ["admin", "superadmin"];
   return (
      <div className="max-w-sm mx-auto bg-white rounded-lg overflow-hidden px-5 pb-5">
         <form onSubmit={handleSubmit}>
            {/* Header */}
            <h2 className="text-2xl font-semibold text-gray-800">
               {isAdding ? "Add User" : "Edit User"}
            </h2>

            {/* name */}
            <div className="mb-4 mt-4">
               <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
               >
                  Name
               </label>
               {formErrors.name && (
                  <p className="text-xs text-red-500 mb-1">{formErrors.name}</p>
               )}
               <TextInput
                  id="name"
                  name="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={handleChange}
               />
            </div>

            {/* username */}
            <div className="mb-4 mt-4">
               <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
               >
                  Username
               </label>
               {formErrors.username && (
                  <p className="text-xs text-red-500 mb-1">
                     {formErrors.username}
                  </p>
               )}
               <TextInput
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
               />
            </div>

            {/* role */}
            <div className="mb-4">
               <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
               >
                  Role
               </label>
               {formErrors.role && (
                  <p className="text-xs text-red-500 mb-1">{formErrors.role}</p>
               )}
               <select
                  id="role"
                  name="role"
                  value={formData.role || ""}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
               >
                  <option value="" disabled>
                     Select a role
                  </option>
                  {userRole?.map((role, index) => (
                     <option key={index} value={role}>
                        {role}
                     </option>
                  ))}
               </select>
            </div>

            {/* password */}
            <div className="mb-4 mt-4">
               <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
               >
                  password
               </label>
               {formErrors.password && (
                  <p className="text-xs text-red-500 mb-1">
                     {formErrors.password}
                  </p>
               )}
               <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
               />
            </div>

            {/* Submit Button */}
            <button
               type="submit"
               className={`w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${
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
                  "Add User"
               ) : (
                  "Save Changes"
               )}
            </button>
         </form>
      </div>
   );
};

export default UserForm;
