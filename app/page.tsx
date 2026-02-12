'use client'

import { useState, useRef, useEffect } from 'react'
import { FaMountain, FaDumbbell, FaBackpack, FaHeartbeat, FaRoute, FaFileAlt, FaComments, FaTimes, FaPaperPlane, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { callAIAgent } from '@/lib/aiAgent'

const THEME_VARS = {
  '--background': '35 29% 95%',
  '--foreground': '30 22% 14%',
  '--card': '35 29% 92%',
  '--card-foreground': '30 22% 14%',
  '--popover': '35 29% 90%',
  '--popover-foreground': '30 22% 14%',
  '--primary': '27 61% 26%',
  '--primary-foreground': '35 29% 98%',
  '--secondary': '35 20% 88%',
  '--secondary-foreground': '30 22% 18%',
  '--accent': '43 75% 38%',
  '--accent-foreground': '35 29% 98%',
  '--destructive': '0 84% 60%',
  '--destructive-foreground': '0 0% 98%',
  '--muted': '35 15% 85%',
  '--muted-foreground': '30 20% 45%',
  '--border': '27 61% 26%',
  '--input': '35 15% 75%',
  '--ring': '27 61% 26%',
} as React.CSSProperties

const AGENT_ID = '698dac7b4b37f0ab5ca235e4'

interface Message {
  role: 'user' | 'agent'
  content: string
  category?: string
  experience_level?: string
  key_recommendations?: string[]
  safety_warnings?: string[]
  next_steps?: string[]
  timeline_considerations?: string
}

interface Section {
  id: string
  icon: React.ElementType
  title: string
  description: string
  content: {
    overview: string
    subsections: {
      title: string
      details: string[]
    }[]
  }
}

const sections: Section[] = [
  {
    id: 'training',
    icon: FaDumbbell,
    title: 'Physical Training',
    description: 'Comprehensive 12-week training protocols to build the strength, endurance, and resilience needed for high-altitude mountaineering.',
    content: {
      overview: 'Cho Oyu demands exceptional cardiovascular fitness, muscular endurance, and mental fortitude. This progressive training plan prepares your body for the extreme demands of climbing above 8,000 meters.',
      subsections: [
        {
          title: 'Phase 1: Base Building (Weeks 1-4)',
          details: [
            'Build aerobic base with 4-5 cardio sessions per week (running, cycling, hiking)',
            'Target heart rate: 60-70% max HR for 45-90 minutes',
            'Begin weighted stair climbing: 20-30 minutes with 10-15lb pack',
            'Core strengthening: planks, side planks, dead bugs 3x/week',
            'Flexibility and mobility work: yoga or dynamic stretching daily'
          ]
        },
        {
          title: 'Phase 2: Strength & Power (Weeks 5-8)',
          details: [
            'Increase pack weight to 25-35lbs for stair climbing and hiking',
            'Add hill repeats and interval training: 8-10 x 2-3 minute hard efforts',
            'Leg strength: squats, lunges, step-ups with weight 2x/week',
            'Upper body: pull-ups, push-ups, shoulder press for pack carrying',
            'Back-to-back training days to simulate expedition fatigue',
            'Long weekend hikes: 4-6 hours with elevation gain'
          ]
        },
        {
          title: 'Phase 3: Peak Conditioning (Weeks 9-12)',
          details: [
            'Pack weight: 40-50lbs for stair climbing and extended hikes',
            'VO2 max intervals: 5-6 x 3-5 minutes at 90-95% max HR',
            'Multi-day training blocks: consecutive 6-8 hour days',
            'Altitude simulation if available: hypoxic training or sleep tents',
            'Technical skill practice: crampon work, ice axe technique',
            'Taper final week: reduce volume by 40-50%, maintain intensity'
          ]
        },
        {
          title: 'Key Training Principles',
          details: [
            'Progressive overload: gradually increase duration, weight, and intensity',
            'Recovery is training: prioritize 7-9 hours sleep, active recovery days',
            'Nutrition: fuel sessions properly, practice expedition foods',
            'Mental training: visualization, meditation, discomfort tolerance',
            'Equipment familiarity: train in boots and gear you\'ll use'
          ]
        }
      ]
    }
  },
  {
    id: 'gear',
    icon: FaBackpack,
    title: 'Gear & Equipment',
    description: 'Essential equipment checklist covering technical gear, clothing systems, and safety equipment for an 8,000-meter expedition.',
    content: {
      overview: 'Proper gear is critical for safety and success on Cho Oyu. This comprehensive list covers everything from base layers to technical climbing equipment, tested for extreme high-altitude conditions.',
      subsections: [
        {
          title: 'Technical Climbing Gear',
          details: [
            'Mountaineering boots: double or single with integrated gaiter, rated -40°C minimum',
            'Crampons: 12-point, compatible with your boots, anti-balling plates',
            'Ice axe: 60-70cm technical axe with leash',
            'Harness: lightweight alpine harness with adjustable leg loops',
            'Ascender: handled ascender (Petzl, Black Diamond)',
            'Belay device: ATC or similar with locking carabiner',
            'Carabiners: 4-6 locking, 4-6 non-locking HMS style',
            'Helmet: lightweight climbing helmet',
            'Trekking poles: adjustable, with baskets'
          ]
        },
        {
          title: 'Clothing System',
          details: [
            'Base layers: 2-3 sets merino wool or synthetic (top & bottom)',
            'Mid-layer insulation: fleece jacket, insulated pants',
            'Down jacket: 800+ fill, hooded, rated for extreme cold',
            'Down pants: full-zip expedition weight for high camps',
            'Shell jacket: Gore-Tex or equivalent, hood, pit zips',
            'Shell pants: full-side zip Gore-Tex, reinforced knees',
            'Gloves: liner gloves, soft shell gloves, expedition mitts',
            'Hat: warm beanie, balaclava, sun hat with neck protection',
            'Socks: 4-6 pairs wool expedition socks, vapor barrier liners'
          ]
        },
        {
          title: 'Sleeping & Camp Gear',
          details: [
            'Sleeping bag: -40°C rated, 800+ fill down, expedition grade',
            'Sleeping pad: insulated, R-value 6+, suitable for snow platforms',
            'Headlamp: with extra batteries (cold-resistant lithium)',
            'Water bottles: wide-mouth insulated, 2-3 liters total',
            'Thermos: 1 liter vacuum insulated for hot drinks',
            'Pee bottle: wide-mouth 1 liter (essential for high camps)',
            'Sunglasses: category 4, side shields, 100% UV protection',
            'Goggles: double lens, interchangeable lens system'
          ]
        },
        {
          title: 'Safety & Navigation',
          details: [
            'Oxygen system: mask, regulator, and cylinders (arranged by outfitter)',
            'Satellite communicator: Garmin inReach or similar for emergency',
            'First aid kit: personal medications, blister care, altitude meds',
            'Repair kit: duct tape, cable ties, sewing kit, stove repair',
            'GPS device or smartphone with offline maps',
            'Whistle and signal mirror',
            'Prussik cord and spare carabiners'
          ]
        }
      ]
    }
  },
  {
    id: 'acclimatization',
    icon: FaHeartbeat,
    title: 'Acclimatization Protocol',
    description: 'Strategic altitude adaptation schedule using rotation system to safely prepare your body for the extreme altitude of Cho Oyu.',
    content: {
      overview: 'Proper acclimatization is the single most important factor for summit success and safety. This proven rotation schedule gradually exposes your body to increasing altitude while allowing adequate recovery.',
      subsections: [
        {
          title: 'Trek to Base Camp (Days 1-7)',
          details: [
            'Drive Kathmandu to Tingri/Zhangmu (3,800m): Day 1',
            'Acclimatization day in Tingri: short hikes, hydration: Day 2',
            'Drive to Chinese Base Camp (5,100m): Day 3',
            'Rest and organize at Base Camp: Days 4-5',
            'Short acclimatization hikes around BC: Days 6-7',
            'Focus: gradual altitude gain, recognize early AMS symptoms',
            'Sleep well, maintain hydration, light activity only'
          ]
        },
        {
          title: 'Rotation 1: Advanced Base Camp (Days 8-14)',
          details: [
            'Carry loads to ABC (5,700m), sleep at ABC: 2 nights',
            'Practice crampon skills on glacier, gear check',
            'Descend to Base Camp for rest: 3-4 nights',
            'Purpose: introduce body to 5,700m, move gear to ABC',
            'Watch for: headaches, sleep quality, appetite loss',
            'Recovery focus: eat well, rehydrate, gentle walking only'
          ]
        },
        {
          title: 'Rotation 2: Camp 1 (Days 15-22)',
          details: [
            'Move to ABC, sleep 1 night',
            'Climb to Camp 1 (6,400m), sleep 1 night',
            'Optional: touch Camp 2 (7,100m) and return to C1',
            'Descend all the way to Base Camp: 4-5 nights rest',
            'Purpose: push altitude ceiling, assess oxygen needs',
            'Critical phase: many turn back if struggling at C1',
            'Rest cycle: complete recovery, refuel glycogen stores'
          ]
        },
        {
          title: 'Rotation 3: Camp 2 & Pre-Summit (Days 23-32)',
          details: [
            'Move to ABC: 1 night',
            'Climb to Camp 1: 1 night',
            'Climb to Camp 2 (7,100m): 1-2 nights',
            'Descend to Base Camp: 3-4 nights final rest',
            'Purpose: full acclimatization to 7,100m, gear caching',
            'Begin oxygen use above Camp 2 if needed',
            'Monitor weather windows for summit push'
          ]
        },
        {
          title: 'Summit Push (Days 33-38)',
          details: [
            'Continuous push: ABC → C1 → C2 → C3 (7,500m) → Summit',
            'Typical schedule: ABC (night) → C1 (night) → C2 (night) → C3 (evening arrival) → Summit (midnight start) → descend to C1 or ABC',
            'Use supplemental oxygen from Camp 2 or Camp 3',
            'Weather window: need 3-4 clear days minimum',
            'Turn-around times: strict discipline (typically 2pm)',
            'Post-summit: rapid descent to lower camps for recovery'
          ]
        }
      ]
    }
  },
  {
    id: 'medical',
    icon: FaHeartbeat,
    title: 'Medical & Health',
    description: 'Pre-expedition medical screening, essential medications, nutrition strategies, and health management for high-altitude climbing.',
    content: {
      overview: 'High-altitude mountaineering places extreme stress on every body system. Proper medical preparation, preventive medications, and nutrition strategies are essential for performance and safety.',
      subsections: [
        {
          title: 'Pre-Expedition Medical Screening',
          details: [
            'Cardiac evaluation: stress ECG, especially if over 40',
            'Pulmonary function test: identify any respiratory limitations',
            'Comprehensive physical exam with expedition medicine specialist',
            'Dental checkup: treat all cavities, no loose fillings (pressure)',
            'Ophthalmology: check for retinal issues, update prescription',
            'Vaccinations: hepatitis A/B, typhoid, tetanus, rabies (optional)',
            'Blood panel: baseline values, check for anemia',
            'Discuss pre-existing conditions with physician'
          ]
        },
        {
          title: 'Altitude Medications',
          details: [
            'Acetazolamide (Diamox): 125-250mg twice daily for prevention',
            'Dexamethasone: emergency treatment for HACE/HAPE (4-8mg)',
            'Nifedipine: HAPE treatment (30mg extended release)',
            'Sildenafil (Viagra): alternative HAPE prevention (50mg)',
            'Pain relief: ibuprofen, acetaminophen (avoid aspirin at altitude)',
            'Sleep aids: consider Ambien for limited use at high camps',
            'Consult physician: proper dosing, contraindications, side effects'
          ]
        },
        {
          title: 'General Medical Kit',
          details: [
            'Antibiotics: azithromycin for respiratory, ciprofloxacin for GI',
            'Anti-diarrheal: loperamide (Imodium), oral rehydration salts',
            'Nausea: ondansetron (Zofran), metoclopramide',
            'Throat lozenges and cough suppressant',
            'Blister treatment: moleskin, 2nd Skin, antibiotic ointment',
            'Sunscreen: SPF 50+, zinc oxide for face',
            'Lip balm: SPF 30+, multiple tubes',
            'Personal prescription medications: triple your normal supply'
          ]
        },
        {
          title: 'Nutrition & Hydration',
          details: [
            'Caloric needs: 5,000-6,000 calories/day at extreme altitude',
            'Carbohydrate emphasis: 60-70% of calories, easier to digest',
            'Protein: maintain muscle mass, 1.5-2g per kg body weight',
            'Fats: calorie-dense, but harder to digest above 7,000m',
            'Hydration: 4-5 liters per day minimum, more during climbing',
            'Electrolytes: replace sodium, potassium lost through breathing',
            'Appetite suppression: common above 6,500m, force eating',
            'Foods: instant noodles, freeze-dried meals, energy gels, chocolate, nuts'
          ]
        },
        {
          title: 'Common Health Issues',
          details: [
            'Acute Mountain Sickness (AMS): headache, nausea, fatigue - descend if severe',
            'High Altitude Pulmonary Edema (HAPE): cough, breathlessness - DESCEND IMMEDIATELY',
            'High Altitude Cerebral Edema (HACE): confusion, ataxia - DESCEND IMMEDIATELY',
            'Frostbite prevention: keep extremities warm and dry, avoid tight clothing',
            'Snow blindness: wear eye protection 100% of time on snow',
            'Dehydration: monitor urine color, force fluid intake',
            'Know evacuation protocols and helicopter landing zones'
          ]
        }
      ]
    }
  },
  {
    id: 'logistics',
    icon: FaFileAlt,
    title: 'Logistics & Permits',
    description: 'Essential permits, travel arrangements, expedition costs, insurance requirements, and administrative details for Cho Oyu.',
    content: {
      overview: 'Cho Oyu expeditions require careful logistical planning, permits from Chinese authorities, and comprehensive insurance. Most climbers join organized expeditions that handle permits and logistics.',
      subsections: [
        {
          title: 'Permits & Fees (Tibet/China Side)',
          details: [
            'Chinese Climbing Permit: approximately $3,000-4,000 per person',
            'Tibet Tourism Bureau (TTB) Permit: $150-200',
            'Tibet Aliens Travel Permit: included in guided packages',
            'Environmental fee: $100-150',
            'Liaison Officer fee: $2,500-3,500 (shared among team)',
            'Garbage deposit: $3,000-4,000 (refundable if rules followed)',
            'Peak season: April-May and September-October',
            'Note: independent climbing not allowed - must join authorized expedition'
          ]
        },
        {
          title: 'Expedition Costs',
          details: [
            'Guided expedition: $15,000-45,000 depending on service level',
            'Budget operators: $15,000-25,000 (basic services, larger groups)',
            'Mid-range: $25,000-35,000 (better food, smaller groups, experienced guides)',
            'Premium: $35,000-45,000 (1:1 guide ratio, luxury base camp)',
            'Costs typically include: permits, base camp, meals, group gear, guide services',
            'Additional costs: international flights ($1,500-2,500), personal gear ($3,000-8,000)',
            'Oxygen: $500-800 per bottle (typically 3-4 bottles needed)',
            'Tips for staff: budget $500-1,000'
          ]
        },
        {
          title: 'Insurance Requirements',
          details: [
            'Evacuation coverage: mandatory, minimum $100,000 for helicopter rescue',
            'Medical coverage: $500,000+ recommended for high-altitude complications',
            'Repatriation: ensure policy covers return of remains (morbid but necessary)',
            'Specialized providers: Global Rescue, Ripcord Rescue, IMG',
            'Standard travel insurance: insufficient - must explicitly cover mountaineering above 6,000m',
            'Read policy carefully: many exclude "extreme sports" or cap altitude',
            'Emergency contacts: provide to expedition leader and family',
            'Carry proof of insurance at all times'
          ]
        },
        {
          title: 'Travel & Transportation',
          details: [
            'International flights: to Kathmandu, Nepal',
            'Kathmandu to Tingri: overland drive (2-3 days) via Friendship Highway',
            'Tibet entry: guided tour required, process through Nepal-China border',
            'Tingri to Base Camp: 3-4 hour drive on rough road',
            'Return journey: reverse route, budget extra days for delays',
            'Visa requirements: Chinese visa (can arrange in Kathmandu for groups)',
            'Recommended arrival: 3-4 days early in Kathmandu for gear check',
            'Recommended buffer: 2-3 extra days post-expedition for delays'
          ]
        },
        {
          title: 'Best Climbing Season',
          details: [
            'Spring (April-May): primary season, more stable weather',
            'Spring advantages: longer weather windows, warmer temperatures',
            'Spring challenges: more teams, potential crowding on route',
            'Autumn (September-October): fewer climbers, colder conditions',
            'Autumn advantages: quieter mountain, clear views',
            'Autumn challenges: shorter windows, colder temps, early snow',
            'Monsoon (June-August): not recommended, heavy snow and storms',
            'Winter (November-March): extremely cold, very few attempts'
          ]
        }
      ]
    }
  },
  {
    id: 'route',
    icon: FaRoute,
    title: 'Route Information',
    description: 'Detailed camp-by-camp breakdown of the northwest ridge route, including elevation profiles, hazards, and technical considerations.',
    content: {
      overview: 'The standard route on Cho Oyu follows the northwest ridge from the Tibetan side. While technically considered one of the "easier" 8,000m peaks, it still demands respect with crevasse danger, avalanche risk, and extreme altitude challenges.',
      subsections: [
        {
          title: 'Base Camp (5,100m / 16,732ft)',
          details: [
            'Location: grassy moraine area, relatively comfortable',
            'Facilities: expedition tents, dining tent, toilet tents, communications',
            'Duration: 3-4 weeks total time spent here during rotations',
            'Activities: rest, gear organization, acclimatization hikes',
            'Hazards: minimal, watch for altitude sickness symptoms',
            'Amenities: many expeditions provide WiFi, comfortable sleeping tents',
            'Weather: can be windy, cold at night, relatively dry'
          ]
        },
        {
          title: 'Advanced Base Camp (5,700m / 18,700ft)',
          details: [
            'Route from BC: glacier walk, 4-6 hours, moderate pace',
            'Terrain: moraine, glacier ice, some crevasse crossings',
            'Camp setup: on glacier, platforms must be prepared',
            'Fixed ropes: minimal, some ladder crossings over crevasses',
            'Hazards: crevasses (roped travel may be required), cold wind',
            'Acclimatization: critical first exposure to thin air',
            'Time here: multiple nights during rotations'
          ]
        },
        {
          title: 'Camp 1 (6,400m / 21,000ft)',
          details: [
            'Route from ABC: steep snow slopes, fixed ropes begin',
            'Duration: 4-6 hours climbing, 1,000m elevation gain',
            'Terrain: 35-40 degree snow slopes, some ice sections',
            'Technical: front-pointing, ice axe/pole use, jumar on fixed lines',
            'Hazards: avalanche danger after snowfall, crevasses, rockfall',
            'Camp conditions: exposed, windy, tent platforms on snow',
            'Acclimatization: many climbers struggle here - critical test'
          ]
        },
        {
          title: 'Camp 2 (7,100m / 23,294ft)',
          details: [
            'Route from C1: continued steep climbing, bergschrund crossing',
            'Duration: 4-5 hours, technical crux of the route',
            'Bergschrund: large crevasse, usually laddered, can be intimidating',
            'Terrain: 40-45 degree slopes, sustained climbing',
            'Altitude effects: significant, many start oxygen here',
            'Hazards: exposure, weather changes rapidly, avalanche after storms',
            'Strategy: some climbers skip C2 and go directly to C3 on summit push'
          ]
        },
        {
          title: 'Camp 3 (7,500m / 24,606ft)',
          details: [
            'Route from C2: snow ridge, moderate angle climbing',
            'Duration: 3-4 hours from C2',
            'Camp location: ridge with spectacular views, exposed to wind',
            'Purpose: high camp for summit push, arrive afternoon before summit day',
            'Oxygen: strongly recommended for sleeping',
            'Rest: minimal sleep, prepare for midnight summit start',
            'Weather check: final decision point for summit attempt'
          ]
        },
        {
          title: 'Summit Push (8,188m / 26,864ft)',
          details: [
            'Start time: midnight to 2am from Camp 3',
            'Route: northwest ridge, moderate angle snow slopes',
            'Duration: 6-8 hours to summit, 3-4 hours descent to C3',
            'Technical difficulty: moderate, but exhausting at extreme altitude',
            'Terrain: 30-35 degree snow, some cornices near summit',
            'Oxygen: 2-3 bottles needed for summit day',
            'Turn-around time: typically 2pm - strict discipline required',
            'Summit: rounded snow dome, prayer flags, incredible views',
            'Descent: same route, focus and energy management critical'
          ]
        },
        {
          title: 'Route Hazards & Considerations',
          details: [
            'Crevasses: throughout glacier sections, stay roped or on fixed lines',
            'Avalanche: risk after heavy snowfall, assess conditions daily',
            'Rockfall: minimal compared to other peaks, but possible',
            'Weather: storms can arrive quickly, winds extreme above 7,500m',
            'Altitude: primary challenge - HAPE/HACE risk increases above 7,000m',
            'Crowds: spring season can see bottlenecks at bergschrund',
            'Route finding: typically well-marked with fixed ropes and wands',
            'Descent: more accidents occur going down - stay focused'
          ]
        }
      ]
    }
  }
]

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### ')) return <h4 key={i} className="font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h4>
        if (line.startsWith('## ')) return <h3 key={i} className="font-semibold text-base mt-3 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# ')) return <h2 key={i} className="font-bold text-lg mt-4 mb-2">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="ml-4 list-disc text-sm">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line)) return <li key={i} className="ml-4 list-decimal text-sm">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm">{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part)
}

function SectionCard({ section, isExpanded, onToggle }: { section: Section; isExpanded: boolean; onToggle: () => void }) {
  const Icon = section.icon
  const [expandedSubsections, setExpandedSubsections] = useState<Set<number>>(new Set())

  const toggleSubsection = (index: number) => {
    setExpandedSubsections(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  if (!Icon) {
    return null
  }

  return (
    <div className="bg-[hsl(35_29%_92%)] border border-[hsl(27_61%_26%)] rounded-lg shadow-md transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-[hsl(43_75%_38%)]/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-[hsl(43_75%_38%)]" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-xl font-semibold text-foreground mb-2">{section.title}</h3>
            <p className="text-sm text-[hsl(30_20%_45%)] leading-relaxed mb-4">{section.description}</p>
            <button onClick={onToggle} className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(27_61%_26%)] text-[hsl(35_29%_98%)] rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              {isExpanded ? (
                <>
                  <FaChevronUp className="w-3 h-3" />
                  <span>Collapse</span>
                </>
              ) : (
                <>
                  <span>Explore</span>
                  <FaChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-[hsl(27_61%_26%)] space-y-6">
            <div className="bg-[hsl(35_20%_88%)]/50 rounded-lg p-4">
              <p className="text-sm text-[hsl(30_22%_18%)] leading-relaxed">{section.content.overview}</p>
            </div>

            <div className="space-y-4">
              {section.content.subsections.map((subsection, index) => (
                <div key={index} className="border border-[hsl(27_61%_26%)] rounded-lg overflow-hidden">
                  <button onClick={() => toggleSubsection(index)} className="w-full px-4 py-3 bg-[hsl(35_15%_85%)]/30 hover:bg-[hsl(35_15%_85%)]/50 transition-colors flex items-center justify-between">
                    <h4 className="font-serif font-semibold text-base text-foreground">{subsection.title}</h4>
                    {expandedSubsections.has(index) ? (
                      <FaChevronUp className="w-4 h-4 text-[hsl(30_20%_45%)]" />
                    ) : (
                      <FaChevronDown className="w-4 h-4 text-[hsl(30_20%_45%)]" />
                    )}
                  </button>
                  {expandedSubsections.has(index) && (
                    <div className="px-4 py-4 bg-[hsl(35_29%_92%)]">
                      <ul className="space-y-2">
                        {subsection.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[hsl(43_75%_38%)] mt-2" />
                            <span className="text-sm text-foreground leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ChatPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [availablePrompts, setAvailablePrompts] = useState([
    "What's the 12-week training schedule?",
    "Essential gear checklist for Cho Oyu?",
    "How does the acclimatization rotation work?",
    "What permits do I need for Nepal?",
    "Tell me about the route from Base Camp to Summit"
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input
    if (!textToSend.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content: textToSend }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    if (messageText && availablePrompts.includes(messageText)) {
      setAvailablePrompts(prev => prev.filter(p => p !== messageText))
    }

    try {
      const result = await callAIAgent(textToSend, AGENT_ID)

      if (result?.success) {
        const data = result?.response?.result
        const guidance = data?.guidance ?? ''
        const category = data?.category ?? ''
        const experienceLevel = data?.experience_level ?? ''
        const recommendations = Array.isArray(data?.key_recommendations) ? data.key_recommendations : []
        const warnings = Array.isArray(data?.safety_warnings) ? data.safety_warnings : []
        const nextSteps = Array.isArray(data?.next_steps) ? data.next_steps : []
        const timeline = data?.timeline_considerations ?? ''

        const agentMessage: Message = {
          role: 'agent',
          content: guidance,
          category,
          experience_level: experienceLevel,
          key_recommendations: recommendations,
          safety_warnings: warnings,
          next_steps: nextSteps,
          timeline_considerations: timeline
        }
        setMessages(prev => [...prev, agentMessage])
      } else {
        const errorMessage: Message = {
          role: 'agent',
          content: 'I apologize, but I encountered an error processing your request. Please try again or rephrase your question.'
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'agent',
        content: 'I apologize, but I encountered a technical error. Please try again in a moment.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) return null

  return (
    <aside className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-[hsl(35_29%_92%)] border-l border-[hsl(27_61%_26%)] shadow-2xl z-50 flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[hsl(27_61%_26%)] bg-[hsl(27_61%_26%)]/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[hsl(43_75%_38%)]/10 flex items-center justify-center">
            <FaMountain className="w-5 h-5 text-[hsl(43_75%_38%)]" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-semibold text-foreground">Expedition Advisor</h2>
            <p className="text-xs text-[hsl(30_20%_45%)]">Expert guidance for Cho Oyu</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[hsl(35_15%_85%)]/50 flex items-center justify-center transition-colors">
          <FaTimes className="w-4 h-4 text-[hsl(30_20%_45%)]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[hsl(43_75%_38%)]/10 flex items-center justify-center mx-auto mb-4">
              <FaMountain className="w-8 h-8 text-[hsl(43_75%_38%)]" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Welcome to Your Expedition Advisor</h3>
            <p className="text-sm text-[hsl(30_20%_45%)] mb-6 max-w-xs mx-auto">Ask me anything about preparing for Cho Oyu - training, gear, acclimatization, and more.</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg px-4 py-3 ${message.role === 'user' ? 'bg-[hsl(27_61%_26%)] text-[hsl(35_29%_98%)]' : 'bg-[hsl(35_15%_85%)] text-foreground'}`}>
              {message.role === 'agent' && message.category && (
                <div className="mb-2 pb-2 border-b border-[hsl(27_61%_26%)]/20">
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-[hsl(43_75%_38%)]/20 text-[hsl(43_75%_38%)]">
                    {message.category}
                  </span>
                  {message.experience_level && (
                    <span className="inline-block ml-2 px-2 py-0.5 rounded text-xs font-medium bg-[hsl(35_20%_88%)] text-[hsl(30_22%_18%)]">
                      {message.experience_level}
                    </span>
                  )}
                </div>
              )}

              <div className="text-sm leading-relaxed whitespace-pre-wrap">{renderMarkdown(message.content)}</div>

              {message.role === 'agent' && (
                <>
                  {Array.isArray(message.key_recommendations) && message.key_recommendations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[hsl(27_61%_26%)]/20">
                      <h4 className="text-xs font-semibold mb-2 uppercase tracking-wide opacity-75">Key Recommendations</h4>
                      <ul className="space-y-1">
                        {message.key_recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="flex-shrink-0 w-1 h-1 rounded-full bg-[hsl(43_75%_38%)] mt-2" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(message.safety_warnings) && message.safety_warnings.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[hsl(27_61%_26%)]/20">
                      <h4 className="text-xs font-semibold mb-2 uppercase tracking-wide opacity-75 text-[hsl(0_84%_60%)]">Safety Warnings</h4>
                      <ul className="space-y-1">
                        {message.safety_warnings.map((warning, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="flex-shrink-0 w-1 h-1 rounded-full bg-[hsl(0_84%_60%)] mt-2" />
                            <span>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {message.timeline_considerations && (
                    <div className="mt-3 pt-3 border-t border-[hsl(27_61%_26%)]/20">
                      <h4 className="text-xs font-semibold mb-2 uppercase tracking-wide opacity-75">Timeline Considerations</h4>
                      <p className="text-sm">{message.timeline_considerations}</p>
                    </div>
                  )}

                  {Array.isArray(message.next_steps) && message.next_steps.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[hsl(27_61%_26%)]/20">
                      <h4 className="text-xs font-semibold mb-2 uppercase tracking-wide opacity-75">Next Steps</h4>
                      <ul className="space-y-1">
                        {message.next_steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="flex-shrink-0 font-semibold opacity-50">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-lg px-4 py-3 bg-[hsl(35_15%_85%)]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[hsl(43_75%_38%)] animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-[hsl(43_75%_38%)] animate-pulse animation-delay-200" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 rounded-full bg-[hsl(43_75%_38%)] animate-pulse animation-delay-400" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {availablePrompts.length > 0 && messages.length === 0 && (
        <div className="px-6 py-3 border-t border-[hsl(27_61%_26%)] bg-[hsl(35_15%_85%)]/30">
          <p className="text-xs font-medium text-[hsl(30_20%_45%)] mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {availablePrompts.slice(0, 3).map((prompt, index) => (
              <button key={index} onClick={() => handleSend(prompt)} className="px-3 py-1.5 bg-[hsl(35_20%_88%)] hover:bg-[hsl(35_20%_88%)]/80 text-[hsl(30_22%_18%)] rounded-full text-xs transition-colors">
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-6 py-4 border-t border-[hsl(27_61%_26%)] bg-[hsl(35_29%_95%)]/50">
        <div className="flex gap-2">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ask about training, gear, route..." disabled={isLoading} className="flex-1 px-4 py-2 bg-[hsl(35_15%_75%)] border border-[hsl(27_61%_26%)] rounded-lg text-sm text-foreground placeholder:text-[hsl(30_20%_45%)] focus:outline-none focus:ring-2 focus:ring-[hsl(27_61%_26%)] disabled:opacity-50" />
          <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="px-4 py-2 bg-[hsl(43_75%_38%)] text-[hsl(35_29%_98%)] rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
            <FaPaperPlane className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default function Home() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [chatOpen, setChatOpen] = useState(false)

  const toggleSection = (sectionId: string) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId)
  }

  return (
    <div style={THEME_VARS} className="min-h-screen bg-[hsl(35_29%_95%)]">
      <header className="border-b border-[hsl(27_61%_26%)] bg-[hsl(35_29%_92%)] sticky top-0 z-40 backdrop-blur-sm bg-[hsl(35_29%_92%)]/95">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[hsl(43_75%_38%)]/10 flex items-center justify-center">
              <FaMountain className="w-7 h-7 text-[hsl(43_75%_38%)]" />
            </div>
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight">Cho Oyu Expedition Guide</h1>
              <p className="text-sm text-[hsl(30_20%_45%)] mt-1">Comprehensive preparation for the world's 6th highest peak (8,188m)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <p className="text-base text-foreground leading-relaxed">
            Cho Oyu, meaning "Turquoise Goddess" in Tibetan, is considered one of the more accessible 8,000-meter peaks.
            However, success requires meticulous preparation across physical training, technical skills, acclimatization, and logistics.
            This guide provides comprehensive information for each critical aspect of your expedition preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {sections.map(section => (
            <SectionCard key={section.id} section={section} isExpanded={expandedSection === section.id} onToggle={() => toggleSection(section.id)} />
          ))}
        </div>

        <div className="bg-[hsl(35_29%_92%)] border border-[hsl(27_61%_26%)] rounded-lg p-6 max-w-3xl mx-auto">
          <h3 className="font-serif text-xl font-semibold text-foreground mb-3">Agent Information</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[hsl(43_75%_38%)]/10 flex items-center justify-center mt-0.5">
                <FaMountain className="w-4 h-4 text-[hsl(43_75%_38%)]" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-foreground">Expedition Advisor Agent</h4>
                <p className="text-xs text-[hsl(30_20%_45%)] mt-0.5">
                  AI-powered advisor providing personalized guidance on Cho Oyu preparation, training protocols, gear selection,
                  acclimatization strategies, route information, and logistics planning. Adapts recommendations based on your
                  experience level and timeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <button onClick={() => setChatOpen(true)} className="fixed bottom-6 right-6 bg-[hsl(43_75%_38%)] text-[hsl(35_29%_98%)] px-6 py-4 rounded-full shadow-2xl hover:shadow-[hsl(43_75%_38%)]/25 hover:scale-105 transition-all duration-200 flex items-center gap-3 font-medium z-40">
        <FaComments className="w-5 h-5" />
        <span className="hidden md:inline">Ask Advisor</span>
      </button>

      <ChatPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}
