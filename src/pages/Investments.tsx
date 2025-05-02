
import { AppLayout } from "@/components/layout/AppLayout";
import { InvestmentsOverview } from "@/components/InvestmentsOverview";

const Investments = () => {
  return (
    <AppLayout 
      title="Mi Cartera"
      description="Gestiona y analiza tus inversiones en un solo lugar"
    >
      <div className="space-y-6">
        <InvestmentsOverview />
      </div>
    </AppLayout>
  );
};

export default Investments;
