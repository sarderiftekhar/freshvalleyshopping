import { Metadata } from "next";
import Wrapper from "@/layouts/wrapper";
import Header from "@/layouts/header/header";
import FeatureArea from "@/components/feature/feature-area";
import BreadcrumbTwo from "@/components/breadcrumb/breadcrumb-2";
import Footer from "@/layouts/footer/footer";
import ShopArea from "@/components/shop/shop-area";

export const metadata: Metadata = {
  title: "Shop - Orfarm",
};

export default function ShopPage() {
  return (
    <Wrapper>
      {/* header start */}
      <Header />
      {/* header end */}

      <main>
        {/* breadcrumb-area-start */}
        <BreadcrumbTwo title="Shop" bgClr="grey-bg" />
        {/* breadcrumb-area-end */}

        {/* shop area start */}
        <ShopArea />
        {/* shop area end */}

        {/* feature area start */}
        <FeatureArea style_2={true} />
        {/* feature area end */}
      </main>

      {/* footer start */}
      <Footer />
      {/* footer end */}
    </Wrapper>
  );
}
