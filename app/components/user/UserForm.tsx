import React from "react";
import LoadingButton from "../ui/LoadingButton";
import { FormInput } from "../ui/FormInput";
import { Field } from "../ui/Field";
import { FormSelect } from "../ui/FormSelect";
import { ChevronDown, Eye, EyeOff } from "lucide-react";

interface formErrors {
  name?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}
interface UserFormProps {
  formData: any;
  dialog: any;
  showPwd: boolean;
  setShowPwd: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formErrors: formErrors;
}

const UserForm = ({
  formData,
  dialog,
  showPwd,
  setShowPwd,
  handleChange,
  handleSubmit,
  formErrors,
}: UserFormProps) => {
  const userRole = ["admin", "superadmin"];
  return (
    <div className="max-w-sm mx-auto bg-white rounded-lg overflow-hidden px-5 pb-5">
      <form id="user-form" onSubmit={handleSubmit} className="space-y-5">
        <Field
          label="Nama Lengkap"
          htmlFor="name"
          required
          error={formErrors.name}
        >
          <FormInput
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            maxLength={100}
            placeholder="Contoh: Andi Pratama"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Username"
            htmlFor="username"
            required
            error={formErrors.username}
            hint="Untuk login ke sistem"
          >
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                @
              </span>
              <input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                maxLength={20}
                placeholder="andi"
                autoComplete="off"
                className={
                  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60" +
                  " pl-8"
                }
              />
            </div>
          </Field>

          <Field label="Peran" htmlFor="role" required>
            <div className="relative">
              <FormSelect
                id="role"
                value={formData.role}
                onChange={handleChange}
                name="role"
              >
                <option value="" disabled>
                  Pilih Peran
                </option>
                {userRole?.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </FormSelect>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={dialog.mode === "edit" ? "Password Baru" : "Password"}
            htmlFor="password"
            required
            error={formErrors.password}
            hint={
              dialog.mode === "edit"
                ? "Kosongkan jika tidak diubah"
                : "Minimal 6 karakter"
            }
          >
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPwd ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                maxLength={64}
                placeholder="••••••"
                autoComplete="new-password"
                className={
                  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60" +
                  " pr-10"
                }
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={
                  showPwd ? "Sembunyikan password" : "Tampilkan password"
                }
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {showPwd ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </Field>

          <Field
            label="Konfirmasi Password"
            htmlFor="confirmPassword"
            required
            error={formErrors.confirmPassword}
          >
            <FormInput
              id="confirmPassword"
              name="confirmPassword"
              type={showPwd ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              maxLength={64}
              placeholder="••••••"
              autoComplete="new-password"
            />
          </Field>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
