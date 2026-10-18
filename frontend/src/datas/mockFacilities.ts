export interface FacilityType {
    id: string;
    name: string;
}

export interface Facility {
    id: string;
    name: string;
    slug: string;
    typeId: string;
    location: string;
    mapUrl?: string;
    shortDescription: string;
    fullDescription: string;
    image: string;
    gallery?: string[];
    characteristics?: string[];
}

export const mockFacilityTypes: FacilityType[] = [
    { id: 't1', name: 'Corporate' },
    { id: 't2', name: 'Industrial' },
    { id: 't3', name: 'Agricultural' },
    { id: 't4', name: 'Operational' }
];

export const mockFacilities: Facility[] = [
    {
        id: 'f1',
        name: 'Corporate Headquarters',
        slug: 'corporate-headquarters',
        typeId: 't1',
        location: 'Addis Ababa, Ethiopia',
        shortDescription: 'The central administrative hub supporting MIDI’s executive, institutional, and sector coordination functions.',
        fullDescription: 'Our Institutional Headquarters represents the administrative core of the Mineral Industry Development Institute (MIDI). Located in Addis Ababa, this facility houses our executive leadership, mineral technology specialists, laboratory management, and industry coordination directorates. It features modern administrative facilities, technical resource libraries, and dedicated conference areas designed to facilitate national mineral sector planning and stakeholder coordination.',
        image: '/factory2.jpg',
        gallery: ['/factory2.jpg', '/factory3.jpg', '/factory.jpg'],
        characteristics: [
            'Executive boardrooms and conference centers',
            'Advanced IT and communication infrastructure',
            'Centralized corporate administrative offices',
            'Accessible urban location'
        ]
    },
    {
        id: 'f2',
        name: 'Central Industrial Processing Site',
        slug: 'central-industrial-processing-site',
        typeId: 't2',
        location: 'Oromia Region, Ethiopia',
        shortDescription: 'A large-scale industrial facility equipped with processing and manufacturing infrastructure.',
        fullDescription: 'The Central Industrial Processing Site is a primary manufacturing physical asset. Spanning several hectares, this site features extensive factory floor space, heavy-duty electrical infrastructure, and structural frameworks designed to accommodate large-scale industrial machinery. The facility is strategically positioned near major transit routes to facilitate heavy transport access.',
        image: '/factory1.jpg',
        gallery: ['/factory1.jpg', '/factory.jpg', '/factory3.jpg'],
        characteristics: [
            'High-capacity industrial electrical grid',
            'Reinforced factory flooring',
            'Heavy transport access roads',
            'On-site maintenance and utility structures'
        ]
    },
    {
        id: 'f3',
        name: 'Agricultural Operations Hub',
        slug: 'agricultural-operations-hub',
        typeId: 't3',
        location: 'Amhara Region, Ethiopia',
        shortDescription: 'An expansive agricultural site dedicated to supporting raw commodity collection and initial handling.',
        fullDescription: 'The Agricultural Operations Hub serves as our primary physical presence in the agricultural sector. The site encompasses extensive open-air storage zones, covered handling areas, and dedicated weighing stations. Designed specifically to handle large volumes of raw agricultural commodities during harvest seasons, this facility ensures a streamlined physical flow of goods from farms to our processing networks.',
        image: '/home-1.jpg',
        gallery: ['/home-1.jpg', '/home-2.jpg', '/home-3.jpg'],
        characteristics: [
            'Large-capacity weighbridges',
            'Covered commodity receiving areas',
            'Extensive open yard storage',
            'Agricultural testing and inspection stations'
        ]
    },
    {
        id: 'f4',
        name: 'Strategic Logistics Depot',
        slug: 'strategic-logistics-depot',
        typeId: 't4',
        location: 'Dire Dawa, Ethiopia',
        shortDescription: 'A key operational footprint providing secure physical storage and transit infrastructure.',
        fullDescription: 'Located near critical national trade corridors, the Strategic Logistics Depot is a major operational facility. It consists of multiple high-clearance structural units, reinforced concrete staging areas, and perimeter security infrastructure. The site is physically designed to accommodate the rapid turnaround of transport fleets and the secure containment of diverse cargo types.',
        image: '/factory.jpg',
        gallery: ['/factory.jpg', '/factory2.jpg', '/factory1.jpg'],
        characteristics: [
            'High-clearance storage structures',
            'Heavy-duty concrete staging areas',
            'Integrated loading bays',
            'Comprehensive perimeter security infrastructure'
        ]
    }
];

export function getFacilityBySlug(slug: string): Facility | undefined {
    return mockFacilities.find(f => f.slug === slug);
}

export function getFacilityTypeById(id: string): FacilityType | undefined {
    return mockFacilityTypes.find(t => t.id === id);
}

export function getFacilitiesByType(typeId: string): Facility[] {
    if (typeId === 'all') return mockFacilities;
    return mockFacilities.filter(f => f.typeId === typeId);
}
