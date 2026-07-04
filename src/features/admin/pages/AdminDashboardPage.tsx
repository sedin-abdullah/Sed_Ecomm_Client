import { useDashboardSummary, useBestSellingProducts } from '@/features/admin/hooks/useAdmin';
import { Card, CardBody } from '@/components/ui/Card';
import { PriceTag } from '@/components/ui/PriceTag';
import { Skeleton } from '@/components/ui/Skeleton';
import { handleImageError } from '@/lib/imageFallback';

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card>
      <CardBody>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-bold">{value}</p>
      </CardBody>
    </Card>
  );
}

export function AdminDashboardPage() {
  const { data: summary, isLoading } = useDashboardSummary();
  const { data: bestSellers } = useBestSellingProducts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <StatCard label="Total Sales" value={<PriceTag price={summary?.totalSales ?? 0} />} />
          <StatCard label="Daily Sales" value={<PriceTag price={summary?.dailySales ?? 0} />} />
          <StatCard label="Monthly Sales" value={<PriceTag price={summary?.monthlySales ?? 0} />} />
          <StatCard label="Total Revenue" value={<PriceTag price={summary?.totalRevenue ?? 0} />} />
          <StatCard label="Total Orders" value={summary?.totalOrders ?? 0} />
          <StatCard label="Total Customers" value={summary?.totalCustomers ?? 0} />
          <StatCard label="Pending Orders" value={summary?.pendingOrders ?? 0} />
          <StatCard label="Delivered Orders" value={summary?.deliveredOrders ?? 0} />
          <StatCard label="Cancelled Orders" value={summary?.cancelledOrders ?? 0} />
        </div>
      )}

      <Card>
        <CardBody>
          <h2 className="mb-4 text-sm font-semibold">Best Selling Products</h2>
          <div className="space-y-3">
            {bestSellers?.map(({ product, unitsSold }) => (
              <div key={product.id} className="flex items-center gap-3 border-b border-border pb-3 last:border-0">
                <img src={product.images[0]?.url} alt="" onError={handleImageError} className="size-10 rounded-lg object-cover" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-muted-foreground">{unitsSold} units sold</p>
                </div>
                <PriceTag price={product.price} size="sm" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
