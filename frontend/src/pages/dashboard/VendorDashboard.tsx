import {
  ClipboardList,
  Package,
  ShoppingCart,
  Truck,
  Boxes,
  Activity,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Badge from "@/components/ui/badge";

const metrics = [
  {
    title: "Purchase Orders",
    value: "—",
    description: "Total purchase orders",
    icon: ClipboardList,
  },
  {
    title: "Pending Orders",
    value: "—",
    description: "Orders awaiting processing",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "—",
    description: "Medicine products supplied",
    icon: Package,
  },
  {
    title: "Deliveries",
    value: "—",
    description: "Delivery activity overview",
    icon: Truck,
  },
];

const vendorModules = [
  {
    title: "Purchase Orders",
    description: "Review and manage purchase orders.",
    icon: ClipboardList,
    href: "/procurement",
  },
  {
    title: "Medicine Catalogue",
    description: "View the available medicine catalogue.",
    icon: Package,
    href: "/medicines",
  },
  {
    title: "Inventory",
    description: "Review inventory and stock information.",
    icon: Boxes,
    href: "/inventory",
  },
  {
    title: "Order Activity",
    description: "Monitor order and delivery activity.",
    icon: Activity,
    href: "/orders",
  },
];

function VendorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Vendor Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your medicine supply and procurement activities.
          </p>
        </div>

        <Badge variant="info">Vendor Workspace</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.title}>
              <CardContent className="flex items-start justify-between p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {metric.description}
                  </p>
                </div>

                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Operations</CardTitle>
          <CardDescription>
            Access your supply and procurement modules.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          {vendorModules.map((module) => {
            const Icon = module.icon;

            return (
              <a
                key={module.title}
                href={module.href}
                className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                  <Icon className="size-5" />
                </div>

                <div>
                  <h3 className="font-semibold">{module.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
              </a>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest procurement order activity.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingCart className="mb-3 size-8 text-muted-foreground" />
              <h3 className="font-semibold">No order data available</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Order information will appear here after procurement API
                integration.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Delivery Overview</CardTitle>
            <CardDescription>Track your delivery operations.</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Truck className="mb-3 size-8 text-muted-foreground" />
              <h3 className="font-semibold">No delivery information</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Delivery tracking will be displayed when the relevant backend
                functionality is available.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default VendorDashboard;
