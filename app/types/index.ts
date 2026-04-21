// Menu and Category Interfaces
export interface CategoryInterface {
   categoryId: number;
   categoryName: string;
}

export interface MenuInterface {
   menuId: number;
   menuName: string;
   menuDescription: string;
   menuImageUrl: string;
   price: number;
   stock: number;
   categoryId: number | null;
   category: CategoryInterface;
}
export interface AddMenuFormInterface {
   menuName: string;
   menuDescription: string;
   price: number;
   stock: number;
   categoryId: number | null;
   menuImage?: File | null;
}

export interface EditMenuFormInterface {
   menuId: number;
   menuName: string;
   menuDescription: string;
   price: number;
   stock: number;
   categoryId: number | null;
   menuImage?: File | null;
   imagePreview?: string;
}
export interface AddCategoryFormInterface {
   categoryName: string;
}
export interface EditCategoryFormInterface {
   categoryId: number;
   categoryName: string;
}
export interface AddUserFormInterface {
   name: string;
   username: string;
   password: string;
   role: string;
}
export interface EditUserFormInterface {
   userId: number;
   name: string;
   username: string;
   password: string;
   role: string;
}

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertPropsInterface {
   type: AlertType;
   message: string;
   onClose: () => void;
}

export interface MenuFilterInterface {
   categoryId?: number | null;
   categoryName?: string;
   menuName?: string;
   minPrice?: number | null;
   maxPrice?: number | null;
   searchQuery?: string;
   sortBy?: "menuName" | "categoryId" | "price" | "stock";
   sortOrder?: "asc" | "desc";
   page?: number | null;
   pageSize?: number | null;
}
export interface OrderFilterInterface {
   minTotal: number | null;
   maxTotal: number | null;
   paymentMethod: string;
   searchQuery: string;
   page: number;
   pageSize: number;
   sortBy: string;
   sortOrder: "asc" | "desc";
   dateRange: string;
   fromDate: string;
   toDate: string;
   paymentStatus: string;
}

// Product Interfaces
export interface ProductInterface {
   id: number;
   imageUrl: string;
   name: string;
   price: number;
   stock: number;
}


// Cart Interfaces
export interface CartInterface {
   total: string;
   cartItems: CartItemInterface[];
}

export interface CartItemInterface {
   id: number;
   imageUrl: string;
   name: string;
   price: number;
   quantity: number;
   subtotal: number;
   notes: string;
   stock: number;
}
export interface CartItemPropsInterface {
   item: CartItemInterface;
   stockMessage: string;
   onQuantityChange: (id: number, quantity: number) => void;
   onNotesChange: (id: number, notes: string) => void;
   onRemove: (id: number) => void;
}

export interface ShowCartModalButtonProps {
   setCartModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
   cartItemLength: number | null;
}

// User Interface (for login or user info)
export interface UserInterface {
   userId: number;
   name: string;
   username: string;
   password: string;
   role: string;
   createdAt: string;
}

// Order Interface (related to orders transactions)
export interface OrderInterface {
   orderId: number;
   createdAt: string;
   orderDetails: OrderDetailInterface[];
   total: number;
   subtotal: number;
   paymentMethod: string;
   paymentStatus: string;
}

export interface OrderDetailInterface {
   orderDetailId: number;
   quantity: number;
   menu: MenuInterface;
   price: number;
   subtotal: number;
   notes: string;
}

// Pagination Interface
export interface PaginationPropsInterface {
   totalItems: number;
   totalPages: number;
   currentPage: number;
   pageSize: number;
   hasNextPage: boolean;
   isLoading: boolean;
   onPageChange: (page: number) => void;
}
