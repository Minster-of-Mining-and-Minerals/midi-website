import HeroSection from '@/components/pages/home-page-components/HeroSection'

import PurposeSection from '@/components/pages/home-page-components/PurposeSection'
import CardSection from '@/components/pages/home-page-components/CardSection'
import PartnersSection from '@/components/pages/home-page-components/PartnersSection'
import PurposeAndImpact from '@/components/pages/home-page-components/PurposeAndImpact'
import PeopleAndCulture from '@/components/pages/careers-page-components/PeopleAndCulture'

const page = () => {
    return (
        <div className='flex flex-col items-center' >
            <HeroSection />
            <PurposeSection />
            <PurposeAndImpact />
            <CardSection />
            <PartnersSection />
            {/* Same "Our Culture" section as the Careers page; full width inside the centered column */}
            <div className="w-full">
                <PeopleAndCulture />
            </div>
        </div>
    )
}

export default page