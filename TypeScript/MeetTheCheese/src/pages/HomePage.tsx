import BranchesSection from '../components/BranchesSection';
import CravingTiles from '../components/CravingTiles';
import FeaturedMenu from '../components/FeaturedMenu';
import Hero from '../components/Hero';
import MenuBrowser from '../components/MenuBrowser';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CravingTiles />
      <FeaturedMenu />
      <div className="pt-14">
        <MenuBrowser />
      </div>
      <BranchesSection />
    </>
  );
}
