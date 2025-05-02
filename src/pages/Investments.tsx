
import { AppLayout } from "@/components/layout/AppLayout";
import { InvestmentsOverview } from "@/components/InvestmentsOverview";
import { ExportInvestments } from "@/components/ExportInvestments";

const Investments = () => {
  return (
    <AppLayout 
      title="Mi Cartera"
      description="Gestiona y analiza tus inversiones en un solo lugar"
    >
      <div className="flex justify-end">
        <ExportInvestments />
      </div>
      <div className="space-y-6 mt-4">
        <InvestmentsOverview />
      </div>
    </AppLayout>
  );
};

export default Investments;
