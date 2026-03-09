import { Product } from "@/types/product";

type LowStockProductsProps = {
    products: Product[];
};

export default function LowStockProducts({
    products,
}: LowStockProductsProps) {
    return (
        <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4">
                <h3 className="text-lg font-semibold">Kam qolgan mahsulotlar</h3>
                <p className="text-sm text-gray-500">Stock 5 yoki undan kam</p>
            </div>

            <div className="space-y-3">
                {products.length === 0 ? (
                    <p className="text-sm text-gray-500">Barcha mahsulotlar yetarli</p>
                ) : (
                    products.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center justify-between rounded-xl border p-3"
                        >
                            <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-500">
                                    ${product.price} · {product.description || "No description"}
                                </p>
                            </div>

                            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
                                Stock: {product.stock}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}